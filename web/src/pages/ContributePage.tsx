import { type FormEvent, useState } from 'react'

export function ContributePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [institution, setInstitution] = useState('')
  const [datasetName, setDatasetName] = useState('')
  const [datasetUrl, setDatasetUrl] = useState('')
  const [publicationUrl, setPublicationUrl] = useState('')
  const [description, setDescription] = useState('')
  const [hasConsent, setHasConsent] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const lines = [
      'Dear Deception Archive Team,',
      '',
      'Below you can find the details of the deception dataset I want to share with you. I am looking forward to hearing back from you.',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Institution: ${institution || 'N/A'}`,
      `Dataset: ${datasetName}`,
      `Dataset URL: ${datasetUrl || 'N/A'}`,
      `Publication link: ${publicationUrl || 'N/A'}`,
      '',
      'Description:',
      description,
      '',
      `Consent to share metadata: ${hasConsent ? 'Yes' : 'No'}`,
    ]

    const subject = encodeURIComponent(`Dataset contribution: ${datasetName}`)
    const body = encodeURIComponent(lines.join('\n'))
    window.location.href = `mailto:l.j.pfruender@tilburguniversity.edu?subject=${subject}&body=${body}`
  }

  return (
    <section className="panel">
      <p className="eyebrow">Contribution Portal</p>
      <h2>Contribute New Dataset</h2>
      <p>
        Share a deception dataset with the archive team. Fill in the details below
        and submit to send us an email with your pre-filled contribution draft. Following, we will review your submission and get back to you for further steps.
      </p>

      <form className="contribute-form" onSubmit={handleSubmit}>
        <label className="filter-label" htmlFor="contrib-name">Your name</label>
        <input
          id="contrib-name"
          className="filter-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="filter-label" htmlFor="contrib-email">Email</label>
        <input
          id="contrib-email"
          className="filter-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="filter-label" htmlFor="contrib-institution">Institution</label>
        <input
          id="contrib-institution"
          className="filter-input"
          type="text"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
        />

        <label className="filter-label" htmlFor="contrib-dataset-name">Dataset name</label>
        <input
          id="contrib-dataset-name"
          className="filter-input"
          type="text"
          value={datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
          required
        />

        <div className="contribute-label-row">
          <label className="filter-label" htmlFor="contrib-dataset-url">Dataset URL</label>
          <span className="contribute-help" tabIndex={0} aria-label="Dataset URL help">
            ?
            <span className="contribute-help-box">i.e., link to OSF or GitHub repository</span>
          </span>
        </div>
        <input
          id="contrib-dataset-url"
          className="filter-input"
          type="url"
          value={datasetUrl}
          onChange={(e) => setDatasetUrl(e.target.value)}
          placeholder="https://..."
        />

        <div className="contribute-label-row">
          <label className="filter-label" htmlFor="contrib-publication-url">Link to publication</label>
          <span className="contribute-help" tabIndex={0} aria-label="Publication link help">
            ?
            <span className="contribute-help-box">i.e., doi to published work or preprint</span>
          </span>
        </div>
        <input
          id="contrib-publication-url"
          className="filter-input"
          type="url"
          value={publicationUrl}
          onChange={(e) => setPublicationUrl(e.target.value)}
          placeholder="https://..."
        />

        <label className="filter-label" htmlFor="contrib-description">Description</label>
        <textarea
          id="contrib-description"
          className="filter-input contribute-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label className="contribute-consent" htmlFor="contrib-consent">
          <input
            id="contrib-consent"
            type="checkbox"
            checked={hasConsent}
            onChange={(e) => setHasConsent(e.target.checked)}
            required
          />
          I hereby consent to sharing this dataset for archive publication.
        </label>

        <div className="contribute-actions">
          <button type="submit" className="primary-btn">Send Contribution</button>
        </div>
      </form>
    </section>
  )
}
