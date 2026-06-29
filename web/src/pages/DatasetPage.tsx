import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useArchiveData } from '../data/archiveClient'

export function DatasetPage() {
  const { datasetId } = useParams()
  const { data } = useArchiveData()
  const [showAll, setShowAll] = useState(false)
  const dataset = data?.datasets.find((item) => item.id === datasetId)
  const sourceAndResearchDesign =
    dataset?.metadata.sourceAndResearchDesign ??
    dataset?.metadata.experimentalDesign ??
    'Not specified'
  const csvPreview = dataset ? data?.csvPreviewsByDatasetId[dataset.id] : undefined
  const visibleRows = csvPreview
    ? showAll
      ? csvPreview.fullRows
      : csvPreview.previewRows
    : []

  if (!data) {
    return (
      <section className="panel">
        <p className="eyebrow">Loading</p>
        <h2>Archive data is loading</h2>
      </section>
    )
  }

  const downloadCsv = () => {
    if (!csvPreview || !dataset) return
    const escape = (v: string) =>
      v.includes(',') || v.includes('"') || v.includes('\n')
        ? `"${v.replace(/"/g, '""')}"`
        : v
    const lines = [
      csvPreview.headers.map(escape).join(','),
      ...csvPreview.fullRows.map((row) => row.map(escape).join(',')),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${dataset.id}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!dataset) {
    return (
      <section className="panel">
        <h2>Dataset not found</h2>
        <p>The dataset identifier does not match any entry in the current archive.</p>
        <Link to="/" className="text-link">
          Back to dataset list
        </Link>
      </section>
    )
  }

  return (
    <section className="panel">
      <p className="eyebrow">Dataset Detail</p>
      <h2>{dataset.name}</h2>
      <p>{dataset.description}</p>
      <div className="detail-grid">
        <div>
          <h3>Core metadata</h3>
          <ul className="meta-list">
            <li>Language: {dataset.metadata.language}</li>
            <li>Statements: {dataset.metadata.statementCount.toLocaleString()}</li>
            <li>Ground truth: {dataset.metadata.groundTruth}</li>
            <li>Topic: {dataset.metadata.topic}</li>
            <li>Source and research design: {sourceAndResearchDesign}</li>
            <li>Coverage: {dataset.yearRange}</li>
            <li>
              Original source:{' '}
              {dataset.originalSource.url !== '#' ? (
                <a
                  href={dataset.originalSource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  {dataset.originalSource.label}
                </a>
              ) : (
                <span>{dataset.originalSource.label}</span>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="csv-preview-block">
        <div className="csv-preview-header-row">
          <h3>CSV Preview</h3>
          {csvPreview && (
            <button type="button" className="csv-toggle-btn" onClick={downloadCsv}>
              Download CSV ({csvPreview.fullRows.length.toLocaleString()} rows)
            </button>
          )}
          {csvPreview && csvPreview.fullRows.length > csvPreview.previewRows.length && (
            <button
              type="button"
              className="csv-toggle-btn"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll
                ? `Show first ${csvPreview.previewRows.length} rows`
                : `Show all ${csvPreview.fullRows.length} rows`}
            </button>
          )}
        </div>
        {csvPreview ? (
          <>
            <p className="csv-preview-caption">
              Showing {visibleRows.length.toLocaleString()} of{' '}
              {dataset.metadata.statementCount.toLocaleString()} total rows
              {' · '}{csvPreview.sourcePath}
            </p>
            <div className="csv-preview-table-wrap" role="region" aria-label="CSV preview table">
              <table className="csv-preview-table">
                <thead>
                  <tr>
                    {csvPreview.headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, rowIndex) => (
                    <tr key={`${dataset.id}-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={`${dataset.id}-${rowIndex}-${cellIndex}`}>{cell || '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="csv-preview-caption">No CSV preview is available for this dataset.</p>
        )}
      </div>

      <Link to="/" className="text-link">
        Back to dataset list
      </Link>
    </section>
  )
}
