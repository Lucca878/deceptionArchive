import type { NormalizedLolDatasetRow, RawLolDatasetRow, TermEntry } from '../types/dataset'

const pickFirst = (row: RawLolDatasetRow, keys: (keyof RawLolDatasetRow)[]) => {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }
  return ''
}

// Dataset files use slightly different column names; this normalizer makes ingestion robust.
export function normalizeLolRow(row: RawLolDatasetRow): NormalizedLolDatasetRow {
  return {
    datasetId: row.dataset_id,
    participantId: pickFirst(row, ['participant_id', 'partecipant_id', 'id_participant']) || undefined,
    text: pickFirst(row, ['text', 'text_clean', 'original_text']),
    originalLabel: pickFirst(row, ['original_label', 'label_original']),
    standardizedLabel: pickFirst(row, ['standardized_label', 'label_standardized']),
    language: pickFirst(row, ['language']) || 'Unknown',
    modality: pickFirst(row, ['modality']) || undefined,
  }
}

export const LOL_TERMS: TermEntry[] = [
  {
    term: 'Dataset',
    definition: 'Dataset name in the New Downloaded metadata table.',
  },
  {
    term: 'Dataset_id',
    definition: 'Dataset identifier used to map metadata and row files.',
  },
  {
    term: 'Key',
    definition: 'Internal key attached to the dataset entry.',
  },
  {
    term: 'Within or Between Design',
    definition:
      'Whether truthful and deceptive conditions are compared within the same participant or between different participant groups.',
  },
  {
    term: 'Reuse',
    definition:
      'Indicates if the dataset reuses or extends material from previous datasets.',
  },
  {
    term: 'Open-source',
    definition:
      'Whether the dataset files are publicly accessible and whether the trained model of the original paper is openly available.',
  },
  {
    term: 'Dataset Documented In Academic Outlet',
    definition:
      'Notes if there is a paper, proceedings entry, or similar academic source that documents the dataset.',
  },
  {
    term: 'No of statements or utterances',
    definition:
      'Total number of statements or utterances reported for the dataset.',
  },
  {
    term: 'Truthful / Deceptive Proportion',
    definition:
      'Class balance between truthful and deceptive statements, typically expressed as a ratio or percentage.',
  },
  {
    term: 'Format',
    definition: 'Data format or modality, for example typed or transcribed.',
  },
  {
    term: 'Language',
    definition: 'Language used in the dataset content.',
  },
  {
    term: 'Topic',
    definition: 'Primary topical area represented in the dataset.',
  },
  {
    term: 'Type of Deception',
    definition:
      'Primary deception type of the corpus, such as fabrication, embedded lies, or minimization.',
  },
  {
    term: 'Source and research design',
    definition:
      'Where the data comes from and how collection was designed.',
  },
  {
    term: 'Dataset available',
    definition:
      'Availability status or access link information for the dataset.',
  },
  {
    term: 'Note',
    definition:
      'Additional notes, caveats, or download instructions from the source table.',
  },
]
