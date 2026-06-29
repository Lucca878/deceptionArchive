import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DatasetCard } from '../components/DatasetCard'
import { MultiDropdown } from '../components/MultiDropdown'
import { archiveData } from '../data/archiveData'
import { csvPreviewsByDatasetId } from '../data/csvPreviews'
import { toTitleCase } from '../utils/text'

export function HomePage() {
  const { datasets } = archiveData

  const [query, setQuery] = useState('')
  const [languages_sel, setLanguagesSel] = useState<string[]>([])
  const [deceptionTypes_sel, setDeceptionTypesSel] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const navigate = useNavigate()

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const clearSelection = () => setSelectedIds(new Set())

  const selectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const d of filtered) next.add(d.id)
      return next
    })
  }

  const bulkDownload = () => {
    const selected = datasets.filter((d) => selectedIds.has(d.id))
    if (!selected.length) return
    // Collect all unique headers across selected datasets, prepend dataset_id
    const allHeaders = Array.from(
      new Set(selected.flatMap((d) => csvPreviewsByDatasetId[d.id]?.headers ?? []))
    )
    const headers = ['dataset_id', ...allHeaders]
    const escape = (v: string) =>
      v.includes(',') || v.includes('"') || v.includes('\n')
        ? `"${v.replace(/"/g, '""')}"`
        : v
    const lines = [headers.map(escape).join(',')]
    for (const d of selected) {
      const preview = csvPreviewsByDatasetId[d.id]
      if (!preview) continue
      for (const row of preview.fullRows) {
        const mapped = allHeaders.map((h) => {
          const idx = preview.headers.indexOf(h)
          return idx >= 0 ? row[idx] ?? '' : ''
        })
        lines.push([d.id, ...mapped].map(escape).join(','))
      }
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lol-bulk-${selected.map((d) => d.id).join('_').slice(0, 60)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Normalize a string to lowercase-trimmed for case-insensitive comparison
  const norm = (s: string) => s.trim().toLowerCase()

  const languages = useMemo(() => {
    const seen = new Map<string, string>()
    for (const d of datasets) {
      const v = d.metadata.language?.trim()
      if (v) seen.set(norm(v), toTitleCase(v))
    }
    return Array.from(seen.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, display]) => display)
  }, [datasets])

  const deceptionTypes = useMemo(() => {
    const seen = new Map<string, string>()
    for (const d of datasets) {
      for (const raw of (d.metadata.typeOfDeception ?? '').split(/[,/;]/)) {
        const v = raw.trim()
        if (v) seen.set(norm(v), toTitleCase(v))
      }
    }
    return Array.from(seen.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, display]) => display)
  }, [datasets])

  const filtered = useMemo(() => {
    const q = norm(query)
    const langNorms = languages_sel.map(norm)
    const typeNorms = deceptionTypes_sel.map(norm)
    return datasets.filter((d) => {
      if (
        q &&
        !norm(d.name).includes(q) &&
        !norm(d.metadata.topic).includes(q) &&
        !d.tags.some((t) => norm(t).includes(q))
      )
        return false
      if (langNorms.length > 0 && !langNorms.includes(norm(d.metadata.language)))
        return false
      if (typeNorms.length > 0) {
        const datasetTypes = (d.metadata.typeOfDeception ?? '')
          .split(/[,/;]/)
          .map((s) => norm(s))
        if (!typeNorms.some((tn) => datasetTypes.includes(tn))) return false
      }
      return true
    })
  }, [datasets, query, languages_sel, deceptionTypes_sel])

  const hasFilters = query || languages_sel.length > 0 || deceptionTypes_sel.length > 0
  const allVisibleSelected = filtered.length > 0 && filtered.every((d) => selectedIds.has(d.id))

  return (
    <>
      <section className="hero-block">
        <div>
          <p className="eyebrow">Upload Wizard</p>
          <h2>You have a deception dataset you would like to share?</h2>
          <p className="hero-subtitle">
            Contribute standardized deception datasets here!
          </p>
        </div>
        <Link to="/contribute" className="primary-btn">
          Contribute new dataset
        </Link>
      </section>

      <section className="filter-bar" aria-label="Filter datasets">
        <div className="filter-field">
          <label htmlFor="filter-query" className="filter-label">Search</label>
          <input
            id="filter-query"
            className="filter-input"
            type="text"
            placeholder="name, topic, tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <MultiDropdown
          id="filter-language"
          label="Language"
          options={languages}
          selected={languages_sel}
          onChange={setLanguagesSel}
        />
        <MultiDropdown
          id="filter-type"
          label="Type of Deception"
          options={deceptionTypes}
          selected={deceptionTypes_sel}
          onChange={setDeceptionTypesSel}
        />
        {hasFilters && (
          <button
            type="button"
            className="filter-clear"
            onClick={() => { setQuery(''); setLanguagesSel([]); setDeceptionTypesSel([]) }}
          >
            Clear
          </button>
        )}
      </section>

      <section className="section-title-row">
        <h2>Current datasets</h2>
        <div className="section-title-actions">
          <p>
            {filtered.length === datasets.length
              ? `${datasets.length} entries available`
              : `${filtered.length} of ${datasets.length} entries`}
          </p>
          <button
            type="button"
            className="csv-toggle-btn section-title-select-all"
            onClick={selectAllVisible}
            disabled={filtered.length === 0 || allVisibleSelected}
            title={
              filtered.length === 0
                ? 'No visible datasets to select'
                : allVisibleSelected
                  ? 'All visible datasets are already selected'
                  : 'Select all visible datasets'
            }
          >
            Select all shown
          </button>
        </div>
      </section>

      {selectedIds.size > 0 && (
        <div className="selection-toolbar">
          <span>{selectedIds.size} selected</span>
          <button type="button" className="csv-toggle-btn" onClick={() => navigate(`/bulk-inspect?ids=${Array.from(selectedIds).join(',')}`)}>
            Inspect selected
          </button>
          <button type="button" className="csv-toggle-btn" onClick={bulkDownload}>
            Download CSV ({selectedIds.size})
          </button>
          <button type="button" className="filter-clear" onClick={clearSelection}>
            Clear selection
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="filter-empty">No datasets match the current filters.</p>
      ) : (
        <section className="card-grid" aria-label="Dataset cards">
          {filtered.map((dataset) => (
            <DatasetCard
              key={dataset.id}
              dataset={dataset}
              selected={selectedIds.has(dataset.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </section>
      )}
    </>
  )
}
