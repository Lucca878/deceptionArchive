import { Link } from 'react-router-dom'
import cpcmLogo from '../assets/cpcmlogo.png'
import deceptionArchiveLogo from '../assets/deception-archive-logo.png'

export function AboutPage() {
  return (
    <section className="panel about-page">
      <header className="about-hero">
        <p className="eyebrow"></p>
        <h2>About the Deception Archive</h2>
      </header>

      <div className="about-intro-row">
        <p className="about-lead">
          Human judges can barely tell truth from deception, typically just above chance level. As communication increasingly happens in text, language has become one of the richest sources of evidence for detecting deception, and computational methods now offer the means to work with these data at a large scale.
          <br />
          <br />
          The catch: the datasets needed to build and test these methods have been scattered across decades of research, hundreds of publications, and dozens of incompatible formats.
          <br />
          <br />
          The Deception Archive exists to fix that.
        </p>
        <div className="about-intro-logos">
          <img className="about-intro-logo" src={deceptionArchiveLogo} alt="Deception Archive logo" />
          <img className="about-intro-logo" src={cpcmLogo} alt="CPCM Lab logo" />
        </div>
      </div>

      <div className="about-rich-text">
        <section className="about-text-block">
          <h3>Dataset Curation</h3>
          <p>
            The Deception Archive currently includes <strong>42 publicly available verbal deception datasets</strong>, identified through a systematic review of the literature and supplemented by direct contact with authors when datasets were not openly accessible. Each dataset was retrieved, curated, standardized into a common format, and enriched with harmonized metadata to facilitate reuse and cross-dataset analyses.
          </p>
        </section>

        <section className="about-text-block">
          <h3>What it is</h3>
          <p>
            A curated, standardized, openly accessible repository of verbal deception datasets, built from a large-scale systematic review of the computational deception literature. It currently holds 42 publicly available datasets with nearly 389,000 truthful and deceptive statements, spanning consumer reviews, personal narratives, legal and forensic interviews, digital scams, and lab experiments.
            <br />
            <br />
            Every dataset has been manually inspected and mapped onto a shared structure with consistent identifiers, consistent labeling, and a common truthful/deceptive classification, while keeping the original text and annotations intact. That lets researchers compare and combine datasets that were never before used together.
          </p>
        </section>

        <section className="about-text-block">
          <h3>How we built it</h3>
          <p>
            The archive grew out of a systematic review that screened over 29,000 publications down to a final set of relevant studies. From there, we identified candidate datasets, retrieved them - through public repositories or by contacting authors directly - and standardised each into a common format.
          </p>
          <p>
            Not every dataset survives the years: links break, formats age, documentation gets lost. Our aim is to centralise datasets and maintain them here to keeps them usable.
          </p>
          <p>Data archive paper preprint (once available).</p>
          <p>Systematic review / meta-analysis preprint (once available).</p>
        </section>

        <section className="about-text-block">
          <h3>Research Team</h3>
          <p>
            The Deception Archive is developed by a research team consisting of:
          </p>
          <ul>
            <li>Riccardo Loconte — Postdoctoral Researcher (Tilburg University, The Netherlands)</li>
            <li>Caterina Borgese — PhD Researcher (Magna Græcia University of Catanzaro, Italy)</li>
            <li>Lucca Pfründer — PhD Researcher (Tilburg University, The Netherlands)</li>
            <li>Bennett Kleinberg — Professor (Tilburg University, The Netherlands)</li>
          </ul>
          <p>
            This project is based at the <strong>Computational Psychology + Computational Methods Lab</strong>{' '}
            (<a href="https://cpcm-lab.net/" target="_blank" rel="noreferrer">https://cpcm-lab.net/</a>).
          </p>
        </section>

        <section className="about-text-block">
          <h3>Get involved</h3>
          <p>
            Have a verbal deception dataset that isn't in the archive yet? Reach out to the team at the <Link to="/contribute">contribute page</Link>.
          </p>
        </section>
      </div>
    </section>
  )
}
