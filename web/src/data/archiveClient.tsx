import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { DatasetRecord, TermEntry } from '../types/dataset'

interface CsvPreview {
  headers: string[]
  fullRows: string[][]
}

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
  const apiBaseUrl = import.meta.env.DEV
    ? (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000')
    : ''

  try {
    const response = await fetch(`${apiBaseUrl}/api/archive-payload`, {
      headers: {
        Accept: 'application/json',
      },
    })

    if (response.ok) {
      return (await response.json()) as ArchivePayload
    }

    if (!import.meta.env.DEV) {
      throw new Error(`Failed to load archive data (${response.status})`)
    }
  } catch {
    if (!import.meta.env.DEV) {
      throw new Error('Failed to load archive data')
    }
  }

  const [{ archiveData }] = await Promise.all([import('./archiveData')])

  return {
    ...archiveData,
    csvPreviewsByDatasetId: {},
  }
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