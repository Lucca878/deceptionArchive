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
  const [dataVersion, setDataVersion] = useState<'standardized' | 'original'>('standardized')
  const [originalDownloadNotice, setOriginalDownloadNotice] = useState('')
  const [citationStyle, setCitationStyle] = useState<CitationStyleId>('apa')
  const [citationPreview, setCitationPreview] = useState('')
  const [citationPreviewError, setCitationPreviewError] = useState('')
  const [citationPreviewLoading, setCitationPreviewLoading] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const citationPreviewRows = Math.min(10, Math.max(3, citationPreview.split('\n').length))
  const issueRecipients = 'l.j.pfruender@tilburguniversity.edu,Bennett.Kleinberg@tilburguniversity.edu,R.Loconte@tilburguniversity.edu,caterina.borgese@studenti.unicz.it'
  const metadataRows = dataset
    ? [
        { label: 'Year Range', value: dataset.yearRange },
        { label: 'Language', value: dataset.metadata.language },
        { label: 'Statements', value: dataset.metadata.statementCount.toLocaleString() },
        { label: 'Ground Truth', value: dataset.metadata.groundTruth },
        {
          label: 'Macro topic',
          value: dataset.metadata.topicStandardized ?? dataset.metadata.topic,
        },
        { label: 'Sub-topic', value: dataset.metadata.topic },
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

  const downloadOriginalCsv = () => {
    setOriginalDownloadNotice('Original dataset is not yet available.')
  }

  const downloadSelectedCsv = () => {
    if (dataVersion === 'standardized') {
      downloadCsv()
      return
    }
    downloadOriginalCsv()
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

  const issueSubject = encodeURIComponent(`Deception Archive issue: ${dataset.name}`)
  const issueBody = encodeURIComponent(
    [
      'Dear Deception Archive Team,',
      '',
      'I would like to report a mistake or issue I encountered.',
      '',
      `Dataset: ${dataset.name}`,
      `Dataset ID: ${dataset.id}`,
      '',
      'Issue details:',
      '',
      '',
    ].join('\n'),
  )
  const issueMailto = `mailto:${issueRecipients}?subject=${issueSubject}&body=${issueBody}`

  return (
    <section className="panel about-page">
      <header className="about-hero bulk-inspect-header">
        <div>
          <p className="eyebrow"></p>
          <h2>{dataset.name}</h2>
        </div>
        <div className="bulk-inspect-actions">
          <Link to="/" className="csv-toggle-btn">
            Back to datasets
          </Link>
        </div>
      </header>

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
          </tbody>
        </table>
      </div>

      <div className="csv-preview-block">
        <div className="csv-preview-header-row">
          <h3>CSV Preview</h3>
          <select
            id="dataset-data-version"
            className="citation-export-select"
            aria-label="Choose dataset format"
            value={dataVersion}
            onChange={(event) => {
              setDataVersion(event.target.value as 'standardized' | 'original')
              setOriginalDownloadNotice('')
            }}
          >
            <option value="standardized">Standardized</option>
            <option value="original">Original</option>
          </select>
          {csvPreview && (
            <button type="button" className="csv-toggle-btn" onClick={downloadSelectedCsv}>
              {dataVersion === 'standardized'
                ? `Download standardized CSV (${totalRows.toLocaleString()} rows)`
                : 'Download original CSV'}
            </button>
          )}
          {dataVersion === 'standardized' && csvPreview && availableRows > INITIAL_ROWS && (
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
        {originalDownloadNotice ? (
          <p className="download-placeholder-note" role="status">{originalDownloadNotice}</p>
        ) : null}
        {dataVersion === 'original' ? (
          <p className="csv-preview-caption">Original dataset preview is not yet available.</p>
        ) : csvPreview ? (
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

      <div className="report-issue-box" aria-label="Report dataset issue">
        <p>If you encounter any mistakes or issues, please email us here.</p>
        <a href={issueMailto} className="text-link">Click to email</a>
      </div>

      <Link to="/" className="text-link">
        Back to dataset list
      </Link>
    </section>
  )
}
