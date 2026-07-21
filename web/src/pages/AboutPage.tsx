export function AboutPage() {
  return (
    <section className="panel about-page">
      <header className="about-hero">
        <p className="eyebrow"></p>
        <h2>About Us</h2>
      </header>

      <p className="about-lead">
        The Deception Archive is part of a research project that systematically mapped out the evidence base in automated verbal deception detection research. In a systematic literature review (Loconte et al., 2026), we identified 291 papers that used text classification methods to detect deception. The Deception Archive brings together the datasets underlying these papers.
      </p>

      <div className="about-rich-text">
        <section className="about-text-block">
          <h3>Dataset Curation</h3>
          <p>
            The Deception Archive currently includes <strong>42 publicly available verbal deception datasets</strong>, identified through a systematic review of the literature and supplemented by direct contact with authors when datasets were not openly accessible. Each dataset was retrieved, curated, standardized into a common format, and enriched with harmonized metadata to facilitate reuse and cross-dataset analyses.
          </p>
        </section>

        <section className="about-text-block">
          <h3>Using The Archive</h3>
          <p>
            The Deception Archive is an open-science repository of standardized datasets for verbal deception, designed to support <em>more accessible, transparent, and reproducible research</em>. Researchers can search and download curated datasets for their studies, as well as contribute with new datasets to continuously expand the collection and support future computational, psychological, and linguistic investigations of verbal deception.
          </p>
        </section>

        <section className="about-text-block">
          <h3>Resources</h3>
          <p>Data archive paper preprint (once available).</p>
          <p>Systematic review / meta-analysis preprint (once available).</p>
        </section>

        <section className="about-text-block">
          <h3>Research Team</h3>
          <p>
            Riccardo Loconte, Lucca Pfünder, Bennett Kleinberg (Tilburg University, The Netherlands), Caterina Borgese (Magna Græcia University of Catanzaro, Italy)
          </p>
        </section>
      </div>
    </section>
  )
}
