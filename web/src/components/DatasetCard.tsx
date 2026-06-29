import { Link } from 'react-router-dom'
import type { DatasetRecord } from '../types/dataset'
import { toTitleCase } from '../utils/text'

interface DatasetCardProps {
  dataset: DatasetRecord
  selected?: boolean
  onToggleSelect?: (id: string) => void
}

export function DatasetCard({ dataset, selected = false, onToggleSelect }: DatasetCardProps) {
  const summary = dataset.metadata.topic
    ? `Deceptive and truthful ${dataset.metadata.topic.toLowerCase()}.`
    : 'Deceptive and truthful statements.'
  const sourceAndResearchDesign =
    dataset.metadata.sourceAndResearchDesign ??
    dataset.metadata.experimentalDesign ??
    'Not specified'

  const cardContent = (
    <>
      <div className="card-head">
        <p className="card-years">{dataset.yearRange}</p>
        <h3>{dataset.name}</h3>
      </div>
      <p>{summary}</p>
      <ul className="meta-list">
        <li>Language: {dataset.metadata.language}</li>
        <li>Statements: {dataset.metadata.statementCount.toLocaleString()}</li>
        <li>Ground Truth: {dataset.metadata.groundTruth}</li>
        <li>Source and Research Design: {sourceAndResearchDesign}</li>
      </ul>
      <div className="tags">
        {dataset.tags.map((tag) => (
          <span key={tag} className="tag">
            {toTitleCase(tag)}
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
          {selected ? '✔' : '□'}
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
