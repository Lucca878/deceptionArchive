import { archiveData } from '../data/archiveData'

export function TermsPage() {
  const { terms } = archiveData

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