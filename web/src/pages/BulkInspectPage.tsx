import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useArchiveData } from '../data/archiveClient'
import type { DatasetRecord } from '../types/dataset'

function formatProportion(value: string) {
  const n = Number(value)
  if (!Number.isFinite(n)) return value
  return n.toFixed(2)
}

const FIELDS: { label: string; key: string }[] = [
  { label: 'Year Range', key: 'yearRange' },
  { label: 'Language', key: 'language' },
  { label: 'Statements', key: 'statementCount' },
  { label: 'Ground Truth', key: 'groundTruth' },
  { label: 'Topic', key: 'topic' },
  { label: 'Type of Deception', key: 'typeOfDeception' },
  { label: 'Truthful/Deceptive Proportion', key: 'truthfulDeceptiveProportion' },
  { label: 'Source & Research Design', key: 'sourceAndResearchDesign' },
  { label: 'Within/Between Design', key: 'withinOrBetweenDesign' },
  { label: 'Format', key: 'format' },
  { label: 'Open-source', key: 'openSource' },
  { label: 'Reuse', key: 'reuse' },
  { label: 'Dataset Available', key: 'datasetAvailable' },
  { label: 'Documented in Academic Outlet', key: 'documentedInAcademicOutlet' },
]

export function BulkInspectPage() {
  const [params] = useSearchParams()
  const { data } = useArchiveData()
  const apiBaseUrl = import.meta.env.DEV
    ? (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000')
    : ''
  const ids = (params.get('ids') ?? '').split(',').filter(Boolean)
  const datasets = ids
    .map((id) => data?.datasets.find((d) => d.id === id))
    .filter(Boolean) as DatasetRecord[]

  const csvPreviewsByDatasetId = data?.csvPreviewsByDatasetId ?? {}
  const INITIAL_ROWS = 10
  const TABLE_CAP = 250
  const [expandedCsv, setExpandedCsv] = useState(false)

  // Build the combined CSV rows in memory for display and download
  const allHeaders = Array.from(
    new Set(datasets.flatMap((d) => csvPreviewsByDatasetId[d.id]?.headers ?? [])),
  )
  const csvHeaders = ['dataset_id', ...allHeaders]
  const totalRows = datasets.reduce((sum, d) => sum + (d.metadata.statementCount ?? 0), 0)

  const allCsvRows: string[][] = []
  for (const d of datasets) {
    const preview = csvPreviewsByDatasetId[d.id]
    if (!preview) continue
    for (const row of preview.fullRows) {
      const mapped = allHeaders.map((h) => {
        const idx = preview.headers.indexOf(h)
        return idx >= 0 ? (row[idx] ?? '') : ''
      })
      allCsvRows.push([d.id, ...mapped])
    }
  }

  const bulkDownload = () => {
    const idsParam = datasets.map((d) => d.id).join(',')
    const url = `${apiBaseUrl}/api/download-bulk-csv?ids=${encodeURIComponent(idsParam)}`
    const a = document.createElement('a')
    a.href = url
    a.download = `lol-bulk-${datasets.map((d) => d.id).join('_').slice(0, 60)}.csv`
    a.click()
  }

  const visiblePreviewRows = expandedCsv
    ? Math.min(allCsvRows.length, TABLE_CAP)
    : Math.min(allCsvRows.length, INITIAL_ROWS)

  const downloadSingleDataset = (datasetId: string) => {
    const preview = csvPreviewsByDatasetId[datasetId]
    if (!preview) return
    const url = `${apiBaseUrl}/api/download-dataset-csv/${encodeURIComponent(datasetId)}`
    const a = document.createElement('a')
    a.href = url
    a.download = `lol-${datasetId}.csv`
    a.click()
  }

  if (!datasets.length) {
    if (!data) {
      return (
        <section className="panel">
          <p className="eyebrow">Loading</p>
          <h2>Archive data is loading</h2>
        </section>
      )
    }

    return (
      <section className="panel">
        <h2>No datasets selected</h2>
        <p>Return to the dataset list and select datasets to compare.</p>
        <Link to="/" className="text-link">Back to datasets</Link>
      </section>
    )
  }

  return (
    <section className="panel">
      <div className="bulk-inspect-header">
        <div>
          <p className="eyebrow">Bulk Inspect</p>
          <h2>Comparing {datasets.length} dataset{datasets.length !== 1 ? 's' : ''}</h2>
        </div>
        <div className="bulk-inspect-actions">
          <Link to="/" className="csv-toggle-btn">
            Back to datasets
          </Link>
        </div>
      </div>

      <div className="bulk-separate-downloads" aria-label="Download selected CSV files separately">
        <p className="bulk-separate-downloads-title">Download selected CSVs separately</p>
        <div className="bulk-separate-downloads-list">
          {datasets.map((d) => {
            const hasCsv = Boolean(csvPreviewsByDatasetId[d.id])
            return (
              <button
                key={d.id}
                type="button"
                className="csv-toggle-btn"
                onClick={() => downloadSingleDataset(d.id)}
                disabled={!hasCsv}
                title={hasCsv ? `Download ${d.name}` : `No CSV available for ${d.name}`}
              >
                {hasCsv
                  ? `Download ${d.name} (${d.metadata.statementCount.toLocaleString()} rows)`
                  : `${d.name} (no CSV)`}
              </button>
            )
          })}
        </div>
      </div>

      <h3>Metadata comparison</h3>
      <div className="bulk-table-wrap">
        <table className="bulk-table">
          <thead>
            <tr>
              <th className="bulk-table-field-col">Field</th>
              {datasets.map((d) => (
                <th key={d.id}>
                  <Link to={`/datasets/${d.id}`} className="text-link">{d.name}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FIELDS.map(({ label, key }) => (
              <tr key={key}>
                <td className="bulk-table-field-col">{label}</td>
                {datasets.map((d) => {
                  let val = key === 'yearRange'
                    ? d.yearRange
                    : (d.metadata as unknown as Record<string, unknown>)[key]

                  if (key === 'truthfulDeceptiveProportion' && typeof val === 'string') {
                    val = formatProportion(val)
                  }

                  return (
                    <td key={d.id}>
                      {val != null && val !== ''
                        ? String(val)
                        : <span className="bulk-table-empty">—</span>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="csv-preview-block">
        <div className="csv-preview-header-row">
          <h3>Combined CSV preview</h3>
          <button type="button" className="csv-toggle-btn" onClick={bulkDownload}>
            {datasets.length === 1
              ? `Download CSV (${totalRows.toLocaleString()} rows)`
              : `Download combined CSV (${totalRows.toLocaleString()} rows)`}
          </button>
          {allCsvRows.length > INITIAL_ROWS && (
            <button type="button" className="csv-toggle-btn" onClick={() => setExpandedCsv((v) => !v)}>
              {expandedCsv ? `Show first ${INITIAL_ROWS} rows` : `Preview up to ${TABLE_CAP} rows`}
            </button>
          )}
        </div>
        <p className="csv-preview-caption">
          Showing {visiblePreviewRows.toLocaleString()} of {totalRows.toLocaleString()} rows
          {' across '}{datasets.length} dataset{datasets.length !== 1 ? 's' : ''}
          {' · preview capped at '}{TABLE_CAP}; download contains all rows
        </p>
        <div className="csv-preview-table-wrap">
          <table className="csv-preview-table">
            <thead>
              <tr>
                {csvHeaders.map((h) => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {(expandedCsv ? allCsvRows.slice(0, TABLE_CAP) : allCsvRows.slice(0, INITIAL_ROWS)).map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell || '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
