import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { DatasetRecord, TermEntry } from '../types/dataset'
import type { CsvPreview } from './csvPreviews'

export interface ArchivePayload {
  datasets: DatasetRecord[]
  terms: TermEntry[]
  csvPreviewsByDatasetId: Record<string, CsvPreview>
}

interface ArchiveDataState {
  data: ArchivePayload | null
  loading: boolean
  error: string | null
}

const ArchiveDataContext = createContext<ArchiveDataState | undefined>(undefined)

async function loadArchivePayload(): Promise<ArchivePayload> {
  if (import.meta.env.DEV) {
    const [{ archiveData }, { csvPreviewsByDatasetId }] = await Promise.all([
      import('./archiveData'),
      import('./csvPreviews'),
    ])

    return {
      ...archiveData,
      csvPreviewsByDatasetId,
    }
  }

  const response = await fetch('/api/archive-payload', {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to load archive data (${response.status})`)
  }

  return (await response.json()) as ArchivePayload
}

export function ArchiveDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ArchiveDataState>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    loadArchivePayload()
      .then((data) => {
        if (!cancelled) {
          setState({ data, loading: false, error: null })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Unable to load archive data',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => state, [state])

  return <ArchiveDataContext.Provider value={value}>{children}</ArchiveDataContext.Provider>
}

export function useArchiveData() {
  const context = useContext(ArchiveDataContext)

  if (!context) {
    throw new Error('useArchiveData must be used within ArchiveDataProvider')
  }

  return context
}