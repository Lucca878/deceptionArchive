/// <reference types="node" />

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse/sync'
import { parse as createCsvParser } from 'csv-parse'
import { stringify } from 'csv-stringify/sync'
import { archiveData } from '../web/src/data/archiveData'
import { EXPLICIT_CITATION_CATALOG } from './citationCatalogData.ts'

const PREVIEW_ROW_CAP = 250

const DATASET_SOURCES: Record<string, string> = {
  'apd-2025': 'APD_2025_id.csv',
  'atsface-2023': 'ATSFACE_2023_id.csv',
  'blc-2019': 'BLC_2019_id.csv',
  'blt-c-2016': 'BLT_C_2016_id.csv',
  'bluff-2020': 'BLUFF_2020_id.csv',
  'ccd-2014': 'CCD_2014_id.csv',
  'csc-2005': 'CSC_2005_id.csv',
  'csi-2014': 'CSI_2014_id.csv',
  'decop-en-2020': 'DECOP_EN_2020_id.csv',
  'decop-it-2020': 'DECOP_IT_2020_id.csv',
  'decour-2012': 'DECOUR_2012_id.csv',
  'defabel-2024': 'DEFABEL_2024_id.csv',
  'defabel-2025': 'DEFABEL_2025_id.csv',
  'derev-2014': 'DEREV_2014_id.csv',
  'derev-2020': 'DEREV_2020_id.csv',
  'difraud-2024': 'DIFRAUD_2024_id.csv',
  'hip-2022': 'HIP_2022_id.csv',
  'int-2021': 'INT_2021_id.csv',
  'legaleye-2025': 'LEGALEYE_2025_id.csv',
  'li-2014': 'LI_2014_id.csv',
  'loconte-2025': 'LOCONTE_2025_id.csv',
  'mafiagame-2022': 'MAFIA/Copia di MAFIAGAME_2022_clean.csv',
  'mafiascum-2019': 'MAFIA/Copia di MAFIASCUM_2019_clean.csv',
  'spyridis-2024': 'MAFIA/SPYRIDIS_2024_id.csv',
  'meajor-2025': 'MeAJOR_2025_id.csv',
  'monaro-2022': 'MONARO_2022_id.csv',
  'mu3d-2019': 'MU3D_2019_id.csv',
  'open-2015': 'OPEN_2015_id.csv',
  'ott-2011': 'OTT_2011_id.csv',
  'ott-2013': 'OTT_2013_id.csv',
  'patra-2025': 'PATRA_2025_id.csv',
  'pops-2017': 'POPS_2017_id.csv',
  'real-d-2015': 'REAL_D_2015_id.csv',
  'real-t-2015': 'REAL_T_2015_id.csv',
  'ru-frdc-2022': 'RU_FRDC_2022_id.csv',
  'sarzynska-2023': 'SARZYNSKA_2023_id.csv',
  'sbu-2020': 'SBU_2020_id.csv',
  'sharma-2025': 'SHARMA_2025_id.csv',
  'soldner-2022': 'SOLDNER_2022_id.csv',
  'trec-2005': 'TREC_2005_id.csv',
}

interface CsvPreview {
  headers: string[]
  previewRows: string[][]
  fullRows: string[][]
  sourcePath: string
}

interface ArchivePayload {
  datasets: typeof archiveData.datasets
  terms: typeof archiveData.terms
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

function parseCsvContent(content: string): string[][] {
  return parse(content, {
    relax_quotes: true,
  }) as string[][]
}

async function readCsvPreviewRows(
  absolutePath: string,
  cap: number,
): Promise<{ headers: string[]; rows: string[][]; totalRows: number }> {
  return new Promise((resolve, reject) => {
    const rows: string[][] = []
    let totalRows = 0
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
        resolve({ headers, rows, totalRows })
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

        totalRows += 1

        if (rows.length < cap) {
          rows.push(clean)
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
  statementCountByDatasetId: Record<string, number>
}> {
  const entries = await Promise.all(
    Object.entries(DATASET_SOURCES).map(async ([datasetId, relPath]) => {
      const absolutePath = path.join(datasetCsvRoot, relPath)
      const { headers, rows, totalRows } = await readCsvPreviewRows(absolutePath, PREVIEW_ROW_CAP)

      const preview: CsvPreview = {
        headers,
        previewRows: rows,
        fullRows: rows,
        sourcePath: relPath,
      }

      return [datasetId, preview, totalRows] as const
    }),
  )

  const previewsByDatasetId: Record<string, CsvPreview> = {}
  const statementCountByDatasetId: Record<string, number> = {}

  for (const [datasetId, preview, totalRows] of entries) {
    previewsByDatasetId[datasetId] = preview
    statementCountByDatasetId[datasetId] = totalRows
  }

  return {
    previewsByDatasetId,
    statementCountByDatasetId,
  }
}

async function initializePayload() {
  const { previewsByDatasetId, statementCountByDatasetId } = await buildCsvPreviewsByDatasetId()

  const datasets = archiveData.datasets.map((dataset) => {
    const statementCount = statementCountByDatasetId[dataset.id]
    if (statementCount == null) {
      return dataset
    }

    return {
      ...dataset,
      metadata: {
        ...dataset.metadata,
        statementCount,
      },
    }
  })

  payload = {
    ...archiveData,
    datasets,
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