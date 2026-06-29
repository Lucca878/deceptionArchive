import { useArchiveData } from '../data/archiveClient'

export function TermsPage() {
  const { data } = useArchiveData()

  if (!data) {
    return (
      <section className="panel">
        <p className="eyebrow">Loading</p>
        <h2>Archive data is loading</h2>
      </section>
    )
  }

  const { terms } = data

  return (
    <section className="panel">
      <h2>Terms</h2>
      <p>Commonly agreed-upon definitions for shared interpretation.</p>
      <div className="terms-grid">
        {terms.map((entry) => (
          <article key={entry.term} className="term-item">
            <h3>{entry.term}</h3>
            <p>{entry.definition}</p>
          </article>
        ))}
      </div>
    </section>
  )
}