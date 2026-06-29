import type { DatasetRecord } from '../types/dataset'

interface BulkInspectPanelProps {
  datasets: DatasetRecord[]
  onClose: () => void
}

export function BulkInspectPanel({ datasets, onClose }: BulkInspectPanelProps) {
  const fields: { label: string; key: keyof import('../types/dataset').DatasetCardMetadata }[] = [
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

  return (
    <div className="bulk-panel">
      <div className="bulk-panel-titlebar">
        <span>Bulk Inspect — {datasets.length} dataset{datasets.length !== 1 ? 's' : ''}</span>
        <button type="button" className="bulk-panel-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
      <div className="bulk-panel-body">
        <div className="bulk-table-wrap">
          <table className="bulk-table">
            <thead>
              <tr>
                <th className="bulk-table-field-col">Field</th>
                {datasets.map((d) => (
                  <th key={d.id}>{d.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="bulk-table-field-col">Year Range</td>
                {datasets.map((d) => <td key={d.id}>{d.yearRange}</td>)}
              </tr>
              {fields.map(({ label, key }) => (
                <tr key={key}>
                  <td className="bulk-table-field-col">{label}</td>
                  {datasets.map((d) => (
                    <td key={d.id}>
                      {d.metadata[key] != null
                        ? String(d.metadata[key])
                        : <span className="bulk-table-empty">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
