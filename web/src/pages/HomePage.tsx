import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DatasetCard } from '../components/DatasetCard'
import { MultiDropdown } from '../components/MultiDropdown'
import { useArchiveData } from '../data/archiveClient'
import { toTitleCase } from '../utils/text'

export function HomePage() {
  const [query, setQuery] = useState('')
  const [languages_sel, setLanguagesSel] = useState<string[]>([])
  const [deceptionTypes_sel, setDeceptionTypesSel] = useState<string[]>([])
  const [groundTruth_sel, setGroundTruthSel] = useState<string[]>([])
  const [topics_sel, setTopicsSel] = useState<string[]>([])
  const [sourceDesign_sel, setSourceDesignSel] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const navigate = useNavigate()
  const { data } = useArchiveData()
  const datasets = data?.datasets ?? []
  const apiBaseUrl = import.meta.env.DEV
    ? (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000')
    : ''

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
    const ids = selected.map((d) => d.id).join(',')
    const url = `${apiBaseUrl}/api/download-bulk-csv?ids=${encodeURIComponent(ids)}`
    const a = document.createElement('a')
    a.href = url
    a.download = `lol-bulk-${selected.map((d) => d.id).join('_').slice(0, 60)}.csv`
    a.click()
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

  const groundTruthOptions = useMemo(() => {
    const seen = new Map<string, string>()
    for (const d of datasets) {
      const v = d.metadata.groundTruth?.trim()
      if (v) seen.set(norm(v), toTitleCase(v))
    }
    return Array.from(seen.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, display]) => display)
  }, [datasets])

  const topicOptions = useMemo(() => {
    const seen = new Map<string, string>()
    for (const d of datasets) {
      const v = d.metadata.topic?.trim()
      if (v) seen.set(norm(v), toTitleCase(v))
    }
    return Array.from(seen.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, display]) => display)
  }, [datasets])

  const sourceDesignOptions = useMemo(() => {
    const seen = new Map<string, string>()
    for (const d of datasets) {
      const v = (d.metadata.sourceAndResearchDesign ?? d.metadata.experimentalDesign ?? '').trim()
      if (v) seen.set(norm(v), toTitleCase(v))
    }
    return Array.from(seen.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, display]) => display)
  }, [datasets])

  const filtered = useMemo(() => {
    const q = norm(query)
    const langNorms = languages_sel.map(norm)
    const typeNorms = deceptionTypes_sel.map(norm)
    const groundTruthNorms = groundTruth_sel.map(norm)
    const topicNorms = topics_sel.map(norm)
    const sourceDesignNorms = sourceDesign_sel.map(norm)
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
      if (groundTruthNorms.length > 0 && !groundTruthNorms.includes(norm(d.metadata.groundTruth ?? '')))
        return false
      if (topicNorms.length > 0 && !topicNorms.includes(norm(d.metadata.topic ?? '')))
        return false
      if (sourceDesignNorms.length > 0) {
        const sourceDesign = norm(d.metadata.sourceAndResearchDesign ?? d.metadata.experimentalDesign ?? '')
        if (!sourceDesignNorms.includes(sourceDesign)) return false
      }
      return true
    })
  }, [
    datasets,
    query,
    languages_sel,
    deceptionTypes_sel,
    groundTruth_sel,
    topics_sel,
    sourceDesign_sel,
  ])

  const hasFilters =
    query ||
    languages_sel.length > 0 ||
    deceptionTypes_sel.length > 0 ||
    groundTruth_sel.length > 0 ||
    topics_sel.length > 0 ||
    sourceDesign_sel.length > 0
  const allVisibleSelected = filtered.length > 0 && filtered.every((d) => selectedIds.has(d.id))

  if (!data) {
    return (
      <section className="panel">
        <p className="eyebrow">Loading</p>
        <h2>Archive data is loading</h2>
      </section>
    )
  }

  return (
    <>
      <section className="hero-block">
        <div>
          <p className="eyebrow">Share Dataset</p>
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
        <MultiDropdown
          id="filter-ground-truth"
          label="Ground Truth"
          options={groundTruthOptions}
          selected={groundTruth_sel}
          onChange={setGroundTruthSel}
        />
        <MultiDropdown
          id="filter-topic"
          label="Topic"
          options={topicOptions}
          selected={topics_sel}
          onChange={setTopicsSel}
        />
        <MultiDropdown
          id="filter-source-design"
          label="Source & Research Design"
          options={sourceDesignOptions}
          selected={sourceDesign_sel}
          onChange={setSourceDesignSel}
        />
        {hasFilters && (
          <button
            type="button"
            className="filter-clear"
            onClick={() => {
              setQuery('')
              setLanguagesSel([])
              setDeceptionTypesSel([])
              setGroundTruthSel([])
              setTopicsSel([])
              setSourceDesignSel([])
            }}
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
