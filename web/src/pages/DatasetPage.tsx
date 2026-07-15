import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useArchiveData } from '../data/archiveClient'
import {
  CITATION_STYLE_OPTIONS,
  downloadCitationExport,
  formatCitationPreviewText,
  getCitationExportText,
  type CitationStyleId,
} from '../data/citationExports'

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
  const [citationStyle, setCitationStyle] = useState<CitationStyleId>('apa')
  const [citationPreview, setCitationPreview] = useState('')
  const [citationPreviewError, setCitationPreviewError] = useState('')
  const [citationPreviewLoading, setCitationPreviewLoading] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const citationPreviewRows = Math.min(10, Math.max(3, citationPreview.split('\n').length))
  const metadataRows = dataset
    ? [
        { label: 'Year Range', value: dataset.yearRange },
        { label: 'Language', value: dataset.metadata.language },
        { label: 'Statements', value: dataset.metadata.statementCount.toLocaleString() },
        { label: 'Ground Truth', value: dataset.metadata.groundTruth },
        { label: 'Topic', value: dataset.metadata.topic },
        { label: 'Type of Deception', value: dataset.metadata.typeOfDeception },
        {
          label: 'Truthful/Deceptive Proportion',
          value: dataset.metadata.truthfulDeceptiveProportion
            ? formatProportion(dataset.metadata.truthfulDeceptiveProportion)
            : '',
        },
        { label: 'Source & Research Design', value: sourceAndResearchDesign },
        { label: 'Within/Between Design', value: dataset.metadata.withinOrBetweenDesign },
        { label: 'Format', value: dataset.metadata.format },
        { label: 'Open-source', value: dataset.metadata.openSource },
        { label: 'Reuse', value: dataset.metadata.reuse },
        { label: 'Dataset Available', value: dataset.metadata.datasetAvailable },
        {
          label: 'Documented in Academic Outlet',
          value: dataset.metadata.documentedInAcademicOutlet,
        },
      ]
    : []
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

  const exportCitation = () => {
    if (!dataset) return
    void downloadCitationExport(apiBaseUrl, [dataset.id], citationStyle).catch((error: unknown) => {
      window.alert(error instanceof Error ? error.message : 'Unable to export citation.')
    })
  }

  const viewCitation = () => {
    if (!dataset) return

    if (citationPreview || citationPreviewError) {
      setCitationPreview('')
      setCitationPreviewError('')
      setCitationPreviewLoading(false)
      setCopyStatus('')
      return
    }

    setCitationPreviewLoading(true)
    setCitationPreviewError('')
    setCopyStatus('')

    void getCitationExportText(apiBaseUrl, [dataset.id], citationStyle)
      .then((text) => {
        setCitationPreview(formatCitationPreviewText(citationStyle, text))
      })
      .catch((error: unknown) => {
        setCitationPreview('')
        setCitationPreviewError(error instanceof Error ? error.message : 'Unable to load citation.')
      })
      .finally(() => {
        setCitationPreviewLoading(false)
      })
  }

  const copyCitation = () => {
    if (!citationPreview) return

    void navigator.clipboard
      .writeText(citationPreview)
      .then(() => {
        setCopyStatus('Copied')
      })
      .catch(() => {
        setCopyStatus('Copy failed')
      })
  }

  useEffect(() => {
    setCitationPreview('')
    setCitationPreviewError('')
    setCitationPreviewLoading(false)
    setCopyStatus('')
  }, [dataset?.id, citationStyle])

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

      <div className="citation-export-card" aria-label="Dataset citation export">
        <div>
          <h3>Export citation</h3>
          <p className="citation-export-copy">
            Download the source reference for this dataset in the citation style you need.
          </p>
        </div>
        <div className="citation-export-controls">
          <label className="citation-export-label" htmlFor="dataset-citation-style">
            Style
          </label>
          <select
            id="dataset-citation-style"
            className="citation-export-select"
            value={citationStyle}
            onChange={(event) => setCitationStyle(event.target.value as CitationStyleId)}
          >
            {CITATION_STYLE_OPTIONS.map((style) => (
              <option key={style.id} value={style.id}>
                {style.label}
              </option>
            ))}
          </select>
          <button type="button" className="csv-toggle-btn" onClick={exportCitation}>
            Export citation
          </button>
          <button type="button" className="nav-link" onClick={viewCitation}>
            {citationPreviewLoading
              ? 'Loading…'
              : citationPreview || citationPreviewError
                ? 'Unview citation'
                : 'View citation'}
          </button>
        </div>
        {citationPreview || citationPreviewError ? (
          <div className="citation-preview-block" aria-live="polite">
            {citationPreviewError ? (
              <p className="citation-preview-error">{citationPreviewError}</p>
            ) : (
              <>
                <textarea
                  className="citation-preview-text citation-preview-text-single"
                  value={citationPreview}
                  readOnly
                  rows={citationPreviewRows}
                />
                <div className="citation-preview-actions">
                  <button type="button" className="csv-toggle-btn" onClick={copyCitation}>
                    Copy citation
                  </button>
                  {copyStatus ? <span className="citation-preview-status">{copyStatus}</span> : null}
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>

      <h3>Metadata</h3>
      <div className="bulk-table-wrap">
        <table className="bulk-table">
          <thead>
            <tr>
              <th className="bulk-table-field-col">Field</th>
              <th>{dataset.name}</th>
            </tr>
          </thead>
          <tbody>
            {metadataRows.map(({ label, value }) => (
              <tr key={label}>
                <td className="bulk-table-field-col">{label}</td>
                <td>
                  {value != null && value !== ''
                    ? String(value)
                    : <span className="bulk-table-empty">—</span>}
                </td>
              </tr>
            ))}
            <tr>
              <td className="bulk-table-field-col">Original Source</td>
              <td>
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
              </td>
            </tr>
          </tbody>
        </table>
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
