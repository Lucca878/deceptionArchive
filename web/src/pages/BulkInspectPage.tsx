import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { archiveData } from '../data/archiveData'
import { csvPreviewsByDatasetId } from '../data/csvPreviews'

const FIELDS: { label: string; key: string }[] = [
  { label: 'Year Range', key: 'yearRange' },
  { label: 'Language', key: 'language' },
  { label: 'Statements', key: 'statementCount' },
  { label: 'Ground Truth', key: 'groundTruth' },
  { label: 'Topic', key: 'topic' },
  { label: 'Type of Deception', key: 'typeOfDeception' },
  { label: 'Source & Research Design', key: 'sourceAndResearchDesign' },
  { label: 'Within/Between Design', key: 'withinOrBetweenDesign' },
  { label: 'Format', key: 'format' },
  { label: 'Open-source', key: 'openSource' },
]

const PREVIEW_ROWS = 20

const escapeCsv = (v: string) =>
  v.includes(',') || v.includes('"') || v.includes('\n')
    ? `"${v.replace(/"/g, '""')}"`
    : v

function downloadCsvFile(filename: string, headers: string[], rows: string[][]) {
  const lines = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) => row.map(escapeCsv).join(',')),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function BulkInspectPage() {
  const [params] = useSearchParams()
  const ids = (params.get('ids') ?? '').split(',').filter(Boolean)
  const datasets = ids
    .map((id) => archiveData.datasets.find((d) => d.id === id))
    .filter(Boolean) as typeof archiveData.datasets

  const [showAllCsv, setShowAllCsv] = useState(false)

  // Build the combined CSV rows in memory for display and download
  const allHeaders = Array.from(
    new Set(datasets.flatMap((d) => csvPreviewsByDatasetId[d.id]?.headers ?? [])),
  )
  const csvHeaders = ['dataset_id', ...allHeaders]

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

  const visibleCsvRows = showAllCsv ? allCsvRows : allCsvRows.slice(0, PREVIEW_ROWS)

  const bulkDownload = () => {
    downloadCsvFile(
      `lol-bulk-${datasets.map((d) => d.id).join('_').slice(0, 60)}.csv`,
      csvHeaders,
      allCsvRows,
    )
  }

  const downloadSingleDataset = (datasetId: string) => {
    const preview = csvPreviewsByDatasetId[datasetId]
    if (!preview) return
    downloadCsvFile(`lol-${datasetId}.csv`, preview.headers, preview.fullRows)
  }

  if (!datasets.length) {
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
          <button type="button" className="csv-toggle-btn" onClick={bulkDownload}>
            Download combined CSV
          </button>
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
                {hasCsv ? `Download ${d.name}` : `${d.name} (no CSV)`}
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
                  const val = key === 'yearRange'
                    ? d.yearRange
                    : (d.metadata as unknown as Record<string, unknown>)[key]
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
          {allCsvRows.length > PREVIEW_ROWS && (
            <button type="button" className="csv-toggle-btn" onClick={() => setShowAllCsv((v) => !v)}>
              {showAllCsv
                ? `Show first ${PREVIEW_ROWS} rows`
                : `Show all ${allCsvRows.length.toLocaleString()} rows`}
            </button>
          )}
        </div>
        <p className="csv-preview-caption">
          Showing {visibleCsvRows.length.toLocaleString()} of {allCsvRows.length.toLocaleString()} total rows
          across {datasets.length} dataset{datasets.length !== 1 ? 's' : ''}
        </p>
        <div className="csv-preview-table-wrap">
          <table className="csv-preview-table">
            <thead>
              <tr>
                {csvHeaders.map((h) => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {visibleCsvRows.map((row, i) => (
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
