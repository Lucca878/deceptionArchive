import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { DatasetRecord, TermEntry } from '../types/dataset'

export interface CsvPreview {
  headers: string[]
  fullRows: string[][]
}

interface ArchiveSummaryPayload {
  datasets: DatasetRecord[]
  terms: TermEntry[]
}

interface ArchiveDataState {
  summaryData: ArchiveSummaryPayload | null
  loading: boolean
  error: string | null
}

const ArchiveDataContext = createContext<ArchiveDataState | undefined>(undefined)

function getApiBaseUrl() {
  return import.meta.env.DEV
    ? (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000')
    : ''
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (response.ok) {
    return (await response.json()) as T
  }

  throw new Error(`Failed to load archive data (${response.status})`)
}

async function loadArchiveSummary(): Promise<ArchiveSummaryPayload> {
  try {
    return await fetchJson<ArchiveSummaryPayload>(`${getApiBaseUrl()}/api/archive-summary`)
  } catch {
    throw new Error('Failed to load archive data')
  }
}

export async function loadDatasetPreview(datasetId: string): Promise<CsvPreview> {
  try {
    return await fetchJson<CsvPreview>(
      `${getApiBaseUrl()}/api/dataset-preview/${encodeURIComponent(datasetId)}`,
    )
  } catch {
    throw new Error('Failed to load dataset preview')
  }
}

export async function loadBulkDatasetPreviews(
  datasetIds: string[],
): Promise<Record<string, CsvPreview>> {
  try {
    const ids = datasetIds.map(encodeURIComponent).join(',')
    const payload = await fetchJson<{ csvPreviewsByDatasetId: Record<string, CsvPreview> }>(
      `${getApiBaseUrl()}/api/bulk-dataset-previews?ids=${ids}`,
    )

    return payload.csvPreviewsByDatasetId
  } catch {
    throw new Error('Failed to load dataset previews')
  }
}

export function ArchiveDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ArchiveDataState>({
    summaryData: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    loadArchiveSummary()
      .then((data) => {
        if (!cancelled) {
          setState({ summaryData: data, loading: false, error: null })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            summaryData: null,
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