import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AboutPage } from './pages/AboutPage'
import { BulkInspectPage } from './pages/BulkInspectPage'
import { ContributePage } from './pages/ContributePage'
import { DatasetPage } from './pages/DatasetPage'
import { TermsPage } from './pages/TermsPage'
import { HomePage } from './pages/HomePage'

function App() {
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
