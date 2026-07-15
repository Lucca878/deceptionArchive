export function AboutPage() {
  return (
    <section className="panel about-page">
      <header className="about-hero">
        <p className="eyebrow"></p>
        <h2>About Us</h2>
      </header>

      <p className="about-lead">
        The Library of Lies is part of a research project that systematically mapped out the evidence base in automated verbal deception detection research. In a systematic literature review (Loconte et al., 2026), we identified 291 papers that used text classification methods to detect deception. The Library of Lies brings together the datasets underlying these papers.
      </p>

      <div className="about-sections">
        <article className="about-section">
          <p>
            <strong>Dataset curation</strong>.
            <br />
            The Library of Lies currently includes 42 publicly available verbal deception datasets, identified through a systematic review of the literature and supplemented by direct contact with authors when datasets were not openly accessible. Each dataset was retrieved, curated, standardized into a common format, and enriched with harmonized metadata to facilitate reuse and cross-dataset analyses.
          </p>
        </article>

        <article className="about-section">
          <p>
            <strong>Using the archive</strong>. 
            <br />
            The Library of Lies is an open-science repository of standardized datasets for verbal deception, designed to support more accessible, transparent and reproducible research. Researchers can search and download curated datasets for their studies, as well as contribute with new datasets to continuously expand the collection and support future computational, psychological, and linguistic investigations of verbal deception.
          </p>
        </article>

        <article className="about-section">
          <p>
            <strong>Resources</strong>. 
            <br />
            REF to the data archive paper preprint (once available)
            <br />
            REF to systematic review/meta analysis preprint (once available)
          </p>
        </article>

        <article className="about-section">
          <p>
            <strong>Research team</strong>. 
            <br />
            Riccardo Loconte, Lucca Pfünder, Bennett Kleinberg (Tilburg University, The Netherlands), Caterina Borgese (Magna Græcia University of Catanzaro, Italy)
          </p>
        </article>
      </div>
    </section>
  )
}
