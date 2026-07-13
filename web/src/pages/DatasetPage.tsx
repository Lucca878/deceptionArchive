import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useArchiveData } from '../data/archiveClient'

function formatProportion(value: string) {
  const n = Number(value)
  if (!Number.isFinite(n)) return value
  return n.toFixed(2)
}

export function DatasetPage() {
  const { datasetId } = useParams()
  const { data } = useArchiveData()
  const apiBaseUrl = import.meta.env.DEV
    ? (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000')
    : ''
  const dataset = data?.datasets.find((item) => item.id === datasetId)
  const sourceAndResearchDesign =
    dataset?.metadata.sourceAndResearchDesign ??
    dataset?.metadata.experimentalDesign ??
    'Not specified'
  const csvPreview = dataset ? data?.csvPreviewsByDatasetId[dataset.id] : undefined
  const totalRows = dataset?.metadata.statementCount ?? 0
  const availableRows = csvPreview?.fullRows.length ?? 0
  const INITIAL_ROWS = 10
  const TABLE_CAP = 250
  const [expanded, setExpanded] = useState(false)
  const visibleRows = csvPreview
    ? expanded
      ? csvPreview.fullRows.slice(0, TABLE_CAP)
      : csvPreview.fullRows.slice(0, INITIAL_ROWS)
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
    const url = `${apiBaseUrl}/api/download-dataset-csv/${encodeURIComponent(dataset.id)}`
    const a = document.createElement('a')
    a.href = url
    a.download = `${dataset.id}.csv`
    a.click()
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
            {dataset.metadata.typeOfDeception ? (
              <li>Type of deception: {dataset.metadata.typeOfDeception}</li>
            ) : null}
            {dataset.metadata.truthfulDeceptiveProportion ? (
              <li>
                Truthful/deceptive proportion: {formatProportion(dataset.metadata.truthfulDeceptiveProportion)}
              </li>
            ) : null}
            {dataset.metadata.withinOrBetweenDesign ? (
              <li>Within/Between design: {dataset.metadata.withinOrBetweenDesign}</li>
            ) : null}
            {dataset.metadata.format ? (
              <li>Format: {dataset.metadata.format}</li>
            ) : null}
            {dataset.metadata.openSource ? (
              <li>Open-source: {dataset.metadata.openSource}</li>
            ) : null}
            {dataset.metadata.reuse ? (
              <li>Reuse: {dataset.metadata.reuse}</li>
            ) : null}
            {dataset.metadata.datasetAvailable ? (
              <li>Dataset available: {dataset.metadata.datasetAvailable}</li>
            ) : null}
            {dataset.metadata.documentedInAcademicOutlet ? (
              <li>Documented in academic outlet: {dataset.metadata.documentedInAcademicOutlet}</li>
            ) : null}
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
              Download CSV ({totalRows.toLocaleString()} rows)
            </button>
          )}
          {csvPreview && availableRows > INITIAL_ROWS && (
            <button
              type="button"
              className="csv-toggle-btn"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded
                ? `Show first ${INITIAL_ROWS} rows`
                : `Preview up to ${TABLE_CAP} rows`}
            </button>
          )}
        </div>
        {csvPreview ? (
          <>
            <p className="csv-preview-caption">
              Showing {visibleRows.length.toLocaleString()} of {totalRows.toLocaleString()} rows
              {expanded && availableRows < totalRows
                ? ` (preview capped at ${TABLE_CAP}; download contains all ${totalRows.toLocaleString()})`
                : expanded
                  ? ` (preview capped at ${TABLE_CAP}; download contains all ${totalRows.toLocaleString()})`
                  : ` · download contains all rows`}
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
