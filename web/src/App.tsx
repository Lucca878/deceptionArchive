import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AboutPage } from './pages/AboutPage'
import { BulkInspectPage } from './pages/BulkInspectPage'
import { ContributePage } from './pages/ContributePage'
import { DatasetPage } from './pages/DatasetPage'
import { useArchiveData } from './data/archiveClient'
import { TermsPage } from './pages/TermsPage'
import { HomePage } from './pages/HomePage'

function App() {
  const { loading, error } = useArchiveData()

  if (loading) {
    return (
      <div className="app-shell">
        <div className="app-window" role="application" aria-label="Library of Lies window">
          <div className="window-body">
            <main className="page-content">
              <section className="panel">
                <p className="eyebrow">Loading</p>
                <h2>Archive data is loading</h2>
                <p>Fetching datasets and CSV previews from the backend.</p>
              </section>
            </main>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-shell">
        <div className="app-window" role="application" aria-label="Library of Lies window">
          <div className="window-body">
            <main className="page-content">
              <section className="panel">
                <p className="eyebrow">Error</p>
                <h2>Could not load archive data</h2>
                <p>{error}</p>
              </section>
            </main>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/datasets/:datasetId" element={<DatasetPage />} />
        <Route path="/bulk-inspect" element={<BulkInspectPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contribute" element={<ContributePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
