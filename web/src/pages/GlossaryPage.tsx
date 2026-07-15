import { useArchiveData } from '../data/archiveClient'

export function GlossaryPage() {
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
    <section className="panel about-page">
      <header className="about-hero">
        <h2>Glossary</h2>
      </header>
      <p className="about-lead">Commonly agreed-upon definitions for shared interpretation.</p>
      <div className="about-sections">
        {terms.map((entry) => (
          <article key={entry.term} className="about-section">
            <p>
              <strong>{entry.term}</strong>
              <br />
              {entry.definition}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}