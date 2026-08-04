/// <reference types="node" />

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse/sync'
import { parse as createCsvParser } from 'csv-parse'
import { stringify } from 'csv-stringify/sync'
import { LOL_TERMS } from '../web/src/data/lolColumns'
import type { DatasetRecord, TermEntry } from '../web/src/types/dataset'
import { EXPLICIT_CITATION_CATALOG } from './citationCatalogData.ts'

const PREVIEW_ROW_CAP = 250

const DATASET_SOURCES: Record<string, string> = {
  'apd-2025': 'APD_2025.csv',
  'atsface-2023': 'ATSFACE_2023.csv',
  'blc-2019': 'BLC_2019.csv',
  'blt-c-2016': 'BLT_C_2016.csv',
  'bluff-2020': 'BLUFF_2020.csv',
  'ccd-2014': 'CCD_2014.csv',
  'csc-2005': 'CSC_2005.csv',
  'csi-2014': 'CSI_2014.csv',
  'decop-en-2020': 'DECOP_EN_2020.csv',
  'decop-it-2020': 'DECOP_IT_2020.csv',
  'decour-2012': 'DECOUR_2012.csv',
  'defabel-2024': 'DEFABEL_2024.csv',
  'defabel-2025': 'DEFABEL_2025.csv',
  'derev-2014': 'DEREV_2014.csv',
  'derev-2020': 'DEREV_2020.csv',
  'difraud-2024': 'DIFRAUD_2024.csv',
  'diplomacy-2020': 'DIPLOMACY_2020.csv',
  'hip-2022': 'HIP_2022.csv',
  'int-2021': 'INT_2021.csv',
  'kleinberg-2018': 'KLEINBERG_2018.csv',
  'legaleye-2025': 'LEGALEYE_2025.csv',
  'li-2014': 'LI_2014.csv',
  'loconte-2025': 'LOCONTE_2025.csv',
  'mafiagame-2022': 'MAFIAGAME_2022.csv',
  'mafiascum-2019': 'MAFIASCUM_2019.csv',
  'spyridis-2024': 'SPYRIDIS_2024.csv',
  'meajor-2025': 'MEAJOR_2025.csv',
  'monaro-2022': 'MONARO_2022.csv',
  'mu3d-2019': 'MU3D_2019.csv',
  'open-2015': 'OPEN_2015.csv',
  'ott-2011': 'OTT_2011.csv',
  'ott-2013': 'OTT_2013.csv',
  'patra-2025': 'PATRA_2025.csv',
  'pops-2017': 'POPS_2017.csv',
  'real-d-2015': 'REAL_D_2015.csv',
  'real-t-2015': 'REAL_T_2015.csv',
  'ru-frdc-2022': 'RU_FRDC_2022.csv',
  'sarzynska-2023': 'SARZYNSKA_2023.csv',
  'sbu-2020': 'SBU_2020.csv',
  'sharma-2025': 'SHARMA_2025.csv',
  'soldner-2022': 'SOLDNER_2022.csv',
  'trec-2005': 'TREC_2005.csv',
}

interface CsvPreview {
  headers: string[]
  previewRows: string[][]
  fullRows: string[][]
  sourcePath: string
}

interface ArchivePayload {
  datasets: DatasetRecord[]
  terms: TermEntry[]
  csvPreviewsByDatasetId: Record<string, CsvPreview>
}

const CITATION_STYLES = [
  {
    id: 'apa',
    downloadExtension: 'txt',
    contentType: 'text/plain; charset=utf-8',
  },
  {
    id: 'bibtex',
    downloadExtension: 'bib',
    contentType: 'text/x-bibtex; charset=utf-8',
  },
  {
    id: 'biblatex',
    downloadExtension: 'bib',
    contentType: 'text/x-bibtex; charset=utf-8',
  },
  {
    id: 'chicago-mla',
    downloadExtension: 'txt',
    contentType: 'text/plain; charset=utf-8',
  },
  {
    id: 'endnote-xml',
    downloadExtension: 'xml',
    contentType: 'application/xml; charset=utf-8',
  },
  {
    id: 'harvard',
    downloadExtension: 'txt',
    contentType: 'text/plain; charset=utf-8',
  },
  {
    id: 'nature',
    downloadExtension: 'txt',
    contentType: 'text/plain; charset=utf-8',
  },
  {
    id: 'vancouver',
    downloadExtension: 'txt',
    contentType: 'text/plain; charset=utf-8',
  },
] as const

type CitationStyleId = (typeof CITATION_STYLES)[number]['id']
type CitationStyleConfig = (typeof CITATION_STYLES)[number]
type CitationCatalog = Record<string, Record<CitationStyleId, string>>

const citationCatalog = EXPLICIT_CITATION_CATALOG as CitationCatalog

function buildCitationExport(datasetIds: string[], styleId: CitationStyleId) {
  const style = CITATION_STYLES.find((item) => item.id === styleId)

  if (!style) {
    throw new Error(`Unsupported citation style: ${styleId}`)
  }

  const uniqueDatasetIds = Array.from(new Set(datasetIds))
  const selectedEntries: string[] = []
  const unmatchedDatasetIds: string[] = []
  const seenEntries = new Set<string>()

  for (const datasetId of uniqueDatasetIds) {
    const entry = citationCatalog[datasetId]?.[styleId]

    if (!entry) {
      unmatchedDatasetIds.push(datasetId)
      continue
    }

    if (!seenEntries.has(entry)) {
      seenEntries.add(entry)
      selectedEntries.push(entry)
    }
  }

  if (selectedEntries.length === 0) {
    throw new Error(
      unmatchedDatasetIds.length
        ? `No citations matched for: ${unmatchedDatasetIds.join(', ')}`
        : 'No citations matched the requested dataset selection',
    )
  }

  if (unmatchedDatasetIds.length > 0) {
    throw new Error(`Missing citation mappings for: ${unmatchedDatasetIds.join(', ')}`)
  }

  return {
    content: renderStyleExport(style, selectedEntries),
    contentType: style.contentType,
    fileName: buildExportFileName(uniqueDatasetIds, style),
  }
}

function renderStyleExport(style: CitationStyleConfig, entries: string[]) {
  if (style.id === 'endnote-xml') {
    const records = entries
      .map((entry) =>
        entry
          .replace(/^<\?xml[^>]*>\s*/i, '')
          .replace(/^<xml><records>/i, '')
          .replace(/<\/records><\/xml>\s*$/i, ''),
      )
      .join('')

    return `<?xml version="1.0" encoding="UTF-8"?>\n<xml><records>${records}</records></xml>\n`
  }

  if (style.id === 'nature' || style.id === 'vancouver') {
    return `${entries
      .map((entry, index) => `${index + 1}. ${entry.replace(/^\d+\.\s*/, '').trim()}`)
      .join('\n\n')
      .trim()}\n`
  }

  return `${entries.map((entry) => entry.trimEnd()).join('\n\n').trim()}\n`
}

function buildExportFileName(datasetIds: string[], style: CitationStyleConfig) {
  const datasetLabel = datasetIds.length === 1 ? datasetIds[0] : `${datasetIds.length}-datasets`
  return `lol-citations-${datasetLabel}-${style.id}.${style.downloadExtension}`
}

let payload: ArchivePayload | null = null
let payloadInitError: string | null = null
let payloadInitInProgress = false

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const webDataRoot = path.join(projectRoot, 'web', 'src', 'data')
const defaultDatasetCsvRoot = path.join(webDataRoot, 'LOL', 'Dataset_id')
const datasetCsvRoot = process.env.LOL_DATASET_DIR?.trim()
  ? path.resolve(process.env.LOL_DATASET_DIR)
  : defaultDatasetCsvRoot
const datasetCsvParentDir = path.dirname(datasetCsvRoot)
const metadataCsvCandidates = [
  path.join(datasetCsvParentDir, 'Deception_archive_metadata.csv'),
  path.join(datasetCsvParentDir, 'Deception archive_metadata.csv'),
  path.join(webDataRoot, 'LOL', 'Deception_archive_metadata.csv'),
  path.join(webDataRoot, 'LOL', 'Deception archive_metadata.csv'),
]

interface MetadataCsvRow {
  Dataset?: string
  Dataset_id?: string
  Key?: string
  'Within or Between design'?: string
  Reuse?: string
  'Open-source'?: string
  'Ground truth'?: string
  'Dataset documented in academic outlet'?: string
  'No of statements or utterances'?: string
  'Truthful / deceptive proportion'?: string
  Format?: string
  Language?: string
  Topic?: string
  'Topic standardized'?: string
  'Type of deception'?: string
  Source?: string
  'Dataset available'?: string
  Note?: string
}

function normalizeValue(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim()
}

function csvFileCodeFromSourcePath(relPath: string): string {
  const base = path.basename(relPath, path.extname(relPath)).toUpperCase()
  return base
    .replace(/^COPIA DI /, '')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_')
    .replace(/_ID$/, '')
    .replace(/_CLEAN$/, '')
}

function buildDatasetIdByMetadataCode(): Record<string, string> {
  const byCode: Record<string, string> = {}

  for (const [datasetId, relPath] of Object.entries(DATASET_SOURCES)) {
    const code = csvFileCodeFromSourcePath(relPath)
    byCode[code] = datasetId
  }

  return byCode
}

async function loadMetadataRows(): Promise<Record<string, MetadataCsvRow>> {
  let csvPath: string | null = null

  for (const candidate of metadataCsvCandidates) {
    try {
      await readFile(candidate)
      csvPath = candidate
      break
    } catch {
      // Try next candidate path.
    }
  }

  if (!csvPath) {
    console.warn('No metadata CSV found; continuing with archiveData.ts metadata only')
    return {}
  }

  const raw = await readFile(csvPath, 'utf-8')
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_quotes: true,
  }) as MetadataCsvRow[]

  const datasetIdByCode = buildDatasetIdByMetadataCode()
  const mapped: Record<string, MetadataCsvRow> = {}
  const unknownCodes = new Set<string>()
  const duplicateDatasetIds = new Set<string>()
  const seenCodesByDatasetId = new Map<string, string>()

  for (const row of rows) {
    const code = normalizeValue(row.Dataset_id).toUpperCase().replace(/\s+/g, '_')
    if (!code) continue
    const datasetId = datasetIdByCode[code]
    if (!datasetId) {
      unknownCodes.add(code)
      continue
    }

    const alreadySeenCode = seenCodesByDatasetId.get(datasetId)
    if (alreadySeenCode && alreadySeenCode !== code) {
      duplicateDatasetIds.add(datasetId)
    }

    seenCodesByDatasetId.set(datasetId, code)
    mapped[datasetId] = row
  }

  const missingDatasetIds = Object.keys(DATASET_SOURCES)
    .filter((datasetId) => mapped[datasetId] == null)
    .sort()

  if (unknownCodes.size > 0) {
    console.warn(
      `Metadata Dataset_id values with no DATASET_SOURCES match: ${Array.from(unknownCodes).sort().join(', ')}`,
    )
  }

  if (duplicateDatasetIds.size > 0) {
    console.warn(
      `Multiple metadata Dataset_id rows mapped to the same dataset id: ${Array.from(duplicateDatasetIds).sort().join(', ')}`,
    )
  }

  if (missingDatasetIds.length > 0) {
    throw new Error(
      `Metadata CSV is missing rows for dataset IDs: ${missingDatasetIds.join(', ')}`,
    )
  }

  console.log(`Loaded ${Object.keys(mapped).length} metadata rows from ${path.basename(csvPath)}`)
  return mapped
}

function mergeDatasetMetadata(
  datasetId: string,
  statementCount: number,
  row: MetadataCsvRow,
): DatasetRecord {
  const sourceAndResearchDesign = normalizeValue(row.Source)
  const topic = normalizeValue(row.Topic)
  const topicStandardized = normalizeValue(row['Topic standardized'])
  const language = normalizeValue(row.Language)
  const typeOfDeception = normalizeValue(row['Type of deception'])
  const groundTruth = normalizeValue(row['Ground truth'])
  const withinOrBetweenDesign = normalizeValue(row['Within or Between design'])
  const format = normalizeValue(row.Format)
  const documentedInAcademicOutlet = normalizeValue(row['Dataset documented in academic outlet'])
  const truthfulDeceptiveProportion = normalizeValue(row['Truthful / deceptive proportion'])
  const note = normalizeValue(row.Note)
  const key = normalizeValue(row.Key)
  const datasetName = normalizeValue(row.Dataset)
  const topicTagParts = topic
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  const tags = Array.from(
    new Set([
      ...topicTagParts,
      typeOfDeception,
      format,
      language,
    ].filter((value) => value.length > 0)),
  )

  const yearMatch = datasetId.match(/-(\d{4})$/)
  const yearRange = yearMatch ? yearMatch[1] : ''
  const descriptionParts = [
    datasetName,
    topic ? `Topic: ${topic}.` : '',
    typeOfDeception ? `Deception type: ${typeOfDeception}.` : '',
    sourceAndResearchDesign ? `Design/source: ${sourceAndResearchDesign}.` : '',
  ].filter(Boolean)

  return {
    id: datasetId,
    name: datasetName,
    description: descriptionParts.join(' '),
    yearRange,
    tags,
    metadata: {
      statementCount,
      language,
      topic,
      topicStandardized: topicStandardized || undefined,
      sourceAndResearchDesign,
      experimentalDesign: sourceAndResearchDesign,
      typeOfDeception,
      groundTruth,
      withinOrBetweenDesign,
      format,
      documentedInAcademicOutlet,
      truthfulDeceptiveProportion,
      note,
      key,
      openSource: normalizeValue(row['Open-source']),
      reuse: normalizeValue(row.Reuse),
      datasetAvailable: normalizeValue(row['Dataset available']),
    },
    originalSource: {
      label: normalizeValue(row['Dataset available']) || 'Unknown',
      url: '#',
    },
  }
}

function json(response: import('node:http').ServerResponse, status: number, body: unknown) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  })
  response.end(JSON.stringify(body))
}

function normalizeCell(cell: string) {
  return cell.replace(/\r\n/g, ' ').replace(/\r/g, ' ').replace(/\n/g, ' ')
}

function parseStatementCount(value: unknown): number {
  const normalized = normalizeValue(value)
  if (!normalized) return 0
  const digits = normalized.replace(/[^\d]/g, '')
  if (!digits) return 0
  const parsed = Number.parseInt(digits, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

function parseCsvContent(content: string): string[][] {
  return parse(content, {
    relax_quotes: true,
  }) as string[][]
}

async function readCsvPreviewRows(
  absolutePath: string,
  cap: number,
): Promise<{ headers: string[]; rows: string[][] }> {
  return new Promise((resolve, reject) => {
    const rows: string[][] = []
    let headers: string[] = []
    let hasHeaders = false
    let resolved = false

    const parser = createCsvParser({
      relax_quotes: true,
    })

    const stream = createReadStream(absolutePath, { encoding: 'utf-8' })

    const finish = () => {
      if (!resolved) {
        resolved = true
        resolve({ headers, rows })
      }
    }

    parser.on('readable', () => {
      let record: string[] | null
      // Drain all currently parsed records.
      while ((record = parser.read() as string[] | null) !== null) {
        const clean = record.map((cell) => normalizeCell(String(cell ?? '')))

        if (!hasHeaders) {
          headers = clean
          hasHeaders = true
          continue
        }

        if (rows.length < cap) {
          rows.push(clean)
          if (rows.length === cap) {
            stream.destroy()
            finish()
            return
          }
        }
      }
    })

    parser.on('error', (error) => {
      if (!resolved) reject(error)
    })

    stream.on('error', (error) => {
      if (!resolved) reject(error)
    })

    stream.on('close', finish)
    stream.pipe(parser)
  })
}

async function buildCsvPreviewsByDatasetId(): Promise<{
  previewsByDatasetId: Record<string, CsvPreview>
}> {
  const entries = await Promise.all(
    Object.entries(DATASET_SOURCES).map(async ([datasetId, relPath]) => {
      const absolutePath = path.join(datasetCsvRoot, relPath)
      const { headers, rows } = await readCsvPreviewRows(absolutePath, PREVIEW_ROW_CAP)

      const preview: CsvPreview = {
        headers,
        previewRows: rows,
        fullRows: rows,
        sourcePath: relPath,
      }

      return [datasetId, preview] as const
    }),
  )

  const previewsByDatasetId: Record<string, CsvPreview> = {}

  for (const [datasetId, preview] of entries) {
    previewsByDatasetId[datasetId] = preview
  }

  return {
    previewsByDatasetId,
  }
}

async function initializePayload() {
  const [{ previewsByDatasetId }, metadataRowsByDatasetId] = await Promise.all([
    buildCsvPreviewsByDatasetId(),
    loadMetadataRows(),
  ])

  const datasets = Object.entries(DATASET_SOURCES).map(([datasetId]) => {
    const metadataRow = metadataRowsByDatasetId[datasetId]
    if (!metadataRow) {
      throw new Error(`Metadata CSV row missing for dataset id: ${datasetId}`)
    }

    const statementCount = parseStatementCount(metadataRow['No of statements or utterances'])

    return mergeDatasetMetadata(datasetId, statementCount, metadataRow)
  })

  payload = {
    datasets,
    terms: LOL_TERMS,
    csvPreviewsByDatasetId: previewsByDatasetId,
  }
}

async function ensurePayloadInitialized() {
  if (payload || payloadInitInProgress) return

  payloadInitInProgress = true
  try {
    await initializePayload()
    payloadInitError = null
    console.log(`Archive payload initialized (CSV root: ${datasetCsvRoot})`)
  } catch (error) {
    payload = null
    payloadInitError = error instanceof Error ? error.message : String(error)
    console.error('Failed to initialize archive payload:', error)
  } finally {
    payloadInitInProgress = false
  }
}

function getCsvFilePath(datasetId: string): string | null {
  const sourcePath = DATASET_SOURCES[datasetId]
  if (!sourcePath) return null

  const normalized = path.normalize(sourcePath)
  if (normalized.startsWith('..')) return null

  return path.join(datasetCsvRoot, normalized)
}

function sendCsv(response: import('node:http').ServerResponse, filename: string, content: string) {
  response.writeHead(200, {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Access-Control-Allow-Origin': '*',
  })
  response.end(content)
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1')

  if (request.method === 'OPTIONS') {
    json(response, 204, {})
    return
  }

  if (url.pathname === '/health' || url.pathname === '/api/health') {
    if (!payload) {
      json(response, 503, {
        ok: false,
        status: payloadInitInProgress ? 'initializing' : 'not-ready',
        error: payloadInitError ?? 'Archive payload is initializing',
      })
      return
    }

    json(response, 200, {
      ok: true,
      datasets: payload.datasets.length,
      terms: payload.terms.length,
      csvPreviews: Object.keys(payload.csvPreviewsByDatasetId).length,
    })
    return
  }

  if (!payload) {
    json(response, 503, {
      error: payloadInitError ?? 'Archive payload is initializing',
    })
    return
  }

  if (url.pathname === '/api/archive-payload') {
    json(response, 200, payload)
    return
  }

  if (url.pathname.startsWith('/api/download-dataset-csv/')) {
    const datasetId = decodeURIComponent(url.pathname.replace('/api/download-dataset-csv/', ''))
    const csvPath = getCsvFilePath(datasetId)

    if (!csvPath) {
      json(response, 404, { error: 'Dataset CSV not found' })
      return
    }

    response.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${datasetId}.csv"`,
      'Access-Control-Allow-Origin': '*',
    })

    const stream = createReadStream(csvPath)
    stream.on('error', () => {
      if (!response.headersSent) {
        json(response, 500, { error: 'Failed to read dataset CSV' })
      } else {
        response.end()
      }
    })
    stream.pipe(response)
    return
  }

  if (url.pathname === '/api/download-bulk-csv') {
    const idsRaw = url.searchParams.get('ids') ?? ''
    const datasetIds = idsRaw.split(',').map((v) => v.trim()).filter(Boolean)

    if (datasetIds.length === 0) {
      json(response, 400, { error: 'No dataset ids provided' })
      return
    }

    Promise.all(
      datasetIds.map(async (datasetId) => {
        const csvPath = getCsvFilePath(datasetId)
        if (!csvPath) {
          throw new Error(`Missing CSV source for ${datasetId}`)
        }

        const content = await readFile(csvPath, 'utf-8')
        const rows = parseCsvContent(content)

        const headers = rows[0] ?? []
        const dataRows = rows.slice(1)
        return { datasetId, headers, dataRows }
      }),
    )
      .then((datasets) => {
        const allHeaders: string[] = []
        const seen = new Set<string>()

        for (const d of datasets) {
          for (const h of d.headers) {
            if (!seen.has(h)) {
              seen.add(h)
              allHeaders.push(h)
            }
          }
        }

        const outHeaders = ['dataset_id', ...allHeaders]
        const outRows: string[][] = [outHeaders]

        for (const d of datasets) {
          const headerIndex = new Map<string, number>()
          d.headers.forEach((h, idx) => headerIndex.set(h, idx))

          for (const row of d.dataRows) {
            const mapped = allHeaders.map((h) => {
              const idx = headerIndex.get(h)
              return idx == null ? '' : (row[idx] ?? '')
            })
            outRows.push([d.datasetId, ...mapped])
          }
        }

        const csv = stringify(outRows)
        sendCsv(response, `lol-bulk-${datasetIds.join('_').slice(0, 60)}.csv`, csv)
      })
      .catch((error: unknown) => {
        console.error('Failed to build bulk CSV:', error)
        json(response, 500, { error: 'Failed to build bulk CSV' })
      })
    return
  }

  if (url.pathname === '/api/export-citations') {
    const idsRaw = url.searchParams.get('ids') ?? ''
    const styleId = url.searchParams.get('style') ?? 'apa'
    const datasetIds = idsRaw.split(',').map((value) => value.trim()).filter(Boolean)

    if (datasetIds.length === 0) {
      json(response, 400, { error: 'No dataset ids provided' })
      return
    }

    try {
      const result = buildCitationExport(datasetIds, styleId as CitationStyleId)

      response.writeHead(200, {
        'Content-Type': result.contentType,
        'Content-Disposition': `attachment; filename="${result.fileName}"`,
        'Access-Control-Allow-Origin': '*',
      })
      response.end(result.content)
    } catch (error: unknown) {
      console.error('Failed to export citations:', error)
      json(response, 422, {
        error: error instanceof Error ? error.message : 'Failed to export citations',
      })
    }
    return
  }

  json(response, 404, { error: 'Not found' })
})

const port = Number(process.env.PORT ?? 3000)

server.listen(port, '0.0.0.0', () => {
  console.log(`Archive backend listening on ${port}`)
  void ensurePayloadInitialized()

  // Keep retrying in case required data files arrive after container start.
  setInterval(() => {
    if (!payload) {
      void ensurePayloadInitialized()
    }
  }, 30_000)
  })