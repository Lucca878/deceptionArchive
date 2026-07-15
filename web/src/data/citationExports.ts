export const CITATION_STYLE_OPTIONS = [
  { id: 'apa', label: 'APA' },
  { id: 'bibtex', label: 'BibTeX' },
  { id: 'biblatex', label: 'BibLaTeX' },
  { id: 'chicago-mla', label: 'Chicago / MLA' },
  { id: 'endnote-xml', label: 'EndNote XML' },
  { id: 'harvard', label: 'Harvard' },
  { id: 'nature', label: 'Nature' },
  { id: 'vancouver', label: 'Vancouver' },
] as const

export type CitationStyleId = (typeof CITATION_STYLE_OPTIONS)[number]['id']

export function formatCitationPreviewText(style: CitationStyleId, value: string) {
  const trimmed = value.trim()

  if (style === 'endnote-xml') {
    return trimmed
      .replace(/></g, '>\n<')
      .replace(/<record>/g, '\n<record>')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  if (style === 'nature' || style === 'vancouver') {
    return trimmed.replace(/\n(?=\d+\.\s)/g, '\n\n')
  }

  if (style === 'bibtex' || style === 'biblatex') {
    return trimmed.replace(/\n(?=@)/g, '\n\n')
  }

  if (style === 'apa') {
    return trimmed
      .replace(/\s+/g, ' ')
      .replace(/(https?:\/\/\S+)\s+(?=[A-Z][^,]+,\s)/g, '$1\n\n')
      .replace(/(\.)\s+(?=[A-Z][^,]+,\s[ A-Z\-\.]+\(\d{4}\))/g, '$1\n\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  return trimmed.replace(/\n{3,}/g, '\n\n')
}

export function buildCitationExportUrl(apiBaseUrl: string, datasetIds: string[], style: CitationStyleId) {
  const url = new URL(`${apiBaseUrl}/api/export-citations`, window.location.origin)
  url.searchParams.set('ids', datasetIds.join(','))
  url.searchParams.set('style', style)
  return url.toString()
}

async function fetchCitationExportResponse(
  apiBaseUrl: string,
  datasetIds: string[],
  style: CitationStyleId,
) {
  const response = await fetch(buildCitationExportUrl(apiBaseUrl, datasetIds, style))

  if (!response.ok) {
    let message = 'Unable to export citation.'

    try {
      const payload = (await response.json()) as { error?: string }
      if (payload.error) {
        message = payload.error
      }
    } catch {
      // Keep the generic error message when the response is not JSON.
    }

    throw new Error(message)
  }

  return response
}

export async function getCitationExportText(
  apiBaseUrl: string,
  datasetIds: string[],
  style: CitationStyleId,
) {
  const response = await fetchCitationExportResponse(apiBaseUrl, datasetIds, style)
  return response.text()
}

export async function downloadCitationExport(
  apiBaseUrl: string,
  datasetIds: string[],
  style: CitationStyleId,
) {
  const response = await fetchCitationExportResponse(apiBaseUrl, datasetIds, style)

  const blob = await response.blob()
  const contentDisposition = response.headers.get('content-disposition') ?? ''
  const filenameMatch = contentDisposition.match(/filename="([^"]+)"/)
  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = downloadUrl
  link.download = filenameMatch?.[1] ?? `lol-citations.${style}`
  link.click()
  URL.revokeObjectURL(downloadUrl)
}