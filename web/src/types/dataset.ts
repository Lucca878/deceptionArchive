export type GroundTruthProcedure =
  | 'Expert annotation'
  | 'Fact-checking organizations'
  | 'Court-verified outcomes'
  | 'Author admission'
  | 'Mixed procedure'
  | (string & {})

export type ExperimentalDesign =
  | 'Observational corpus'
  | 'Lab experiment'
  | 'Field experiment'
  | 'Interview protocol'
  | 'Mixed design'
  | (string & {})

export interface DatasetCardMetadata {
  language: string
  statementCount: number
  groundTruth: GroundTruthProcedure
  topic: string
  sourceAndResearchDesign?: string
  experimentalDesign?: ExperimentalDesign
  withinOrBetweenDesign?: string
  reuse?: string
  openSource?: string
  documentedInAcademicOutlet?: string
  truthfulDeceptiveProportion?: string
  format?: string
  typeOfDeception?: string
  datasetAvailable?: string
  note?: string
  key?: string
}

export interface DatasetSource {
  label: string
  url: string
}

export interface DatasetRecord {
  id: string
  name: string
  description: string
  yearRange: string
  tags: string[]
  metadata: DatasetCardMetadata
  originalSource: DatasetSource
}

export interface TermEntry {
  term: string
  definition: string
}

export interface RawLolDatasetRow {
  dataset_id: string
  participant_id?: string
  partecipant_id?: string
  id_participant?: string
  text?: string
  text_clean?: string
  original_text?: string
  original_label?: string
  label_original?: string
  standardized_label?: string
  label_standardized?: string
  language?: string
  modality?: string
}

export interface NormalizedLolDatasetRow {
  datasetId: string
  participantId?: string
  text: string
  originalLabel: string
  standardizedLabel: string
  language: string
  modality?: string
}

export interface LolDatasetInfoRecord {
  datasetId: string
  datasetName: string
  key?: string
  withinOrBetweenDesign?: string
  reuse?: string
  openSource?: string
  groundTruth?: string
  documentedInAcademicOutlet?: string
  statementOrUtteranceCount?: string
  truthfulDeceptiveProportion?: string
  format?: string
  language?: string
  topic?: string
  typeOfDeception?: string
  sourceAndResearchDesign?: string
  datasetAvailable?: string
  note?: string
}
