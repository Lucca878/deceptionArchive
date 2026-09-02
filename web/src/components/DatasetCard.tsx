import { Link } from 'react-router-dom'
import type { DatasetRecord } from '../types/dataset'
import { toSentenceCase } from '../utils/text'

interface DatasetCardProps {
  dataset: DatasetRecord
  selected?: boolean
  onToggleSelect?: (id: string) => void
}

function formatProportion(value: string) {
  const n = Number(value)
  if (!Number.isFinite(n)) return value
  return n.toFixed(2)
}

export function DatasetCard({ dataset, selected = false, onToggleSelect }: DatasetCardProps) {
  const yearLabel = (dataset.yearRange ?? '').split('-')[0].trim()
  const macroTopic = dataset.metadata.topicStandardized ?? dataset.metadata.topic
  const subTopic = dataset.metadata.topic
  const filterChips = [
    { key: 'language', label: 'Language', value: dataset.metadata.language },
    { key: 'type', label: 'Type', value: dataset.metadata.typeOfDeception ?? '' },
    { key: 'ground-truth', label: 'Ground truth', value: dataset.metadata.groundTruth ?? '' },
    { key: 'macro-topic', label: 'Macro topic', value: macroTopic ?? '' },
    { key: 'sub-topic', label: 'Sub-topic', value: subTopic ?? '' },
  ].filter((chip) => chip.value.trim().length > 0)

  const cardContent = (
    <>
      <div className="card-head">
        <p className="card-years">{yearLabel || dataset.yearRange}</p>
        <h3>{dataset.name}</h3>
      </div>
      <ul className="meta-list">
        <li>Number of statements: {dataset.metadata.statementCount.toLocaleString()}</li>
        <li>
          Truthful/deceptive: {dataset.metadata.truthfulDeceptiveProportion
            ? formatProportion(dataset.metadata.truthfulDeceptiveProportion)
            : '—'}
        </li>
        <li>Format: {dataset.metadata.format || '—'}</li>
      </ul>
      <div className="tags">
        {filterChips.map((chip) => (
          <span key={chip.key} className="tag" title={`${chip.label}: ${chip.value}`}>
            {toSentenceCase(chip.value)}
          </span>
        ))}
      </div>
    </>
  )

  return (
    <div className={`dataset-card-wrapper${selected ? ' dataset-card-wrapper-selected' : ''}`}>
      {onToggleSelect && (
        <button
          type="button"
          className={`card-select-btn${selected ? ' card-select-btn-checked' : ''}`}
          aria-label={selected ? `Deselect ${dataset.name}` : `Select ${dataset.name}`}
          onClick={(e) => { e.stopPropagation(); onToggleSelect(dataset.id) }}
        >
          <span className="card-select-indicator" aria-hidden="true">{selected ? '✓' : ''}</span>
        </button>
      )}
      <Link
        to={`/datasets/${dataset.id}`}
        className="dataset-card"
        aria-label={`Open dataset ${dataset.name}`}
      >
        <div className="dataset-card-inner">
          <div className="dataset-card-face dataset-card-front">{cardContent}</div>
          <div className="dataset-card-face dataset-card-back" aria-hidden="true">
            {cardContent}
          </div>
        </div>
      </Link>
    </div>
  )
}
