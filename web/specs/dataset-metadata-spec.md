# Dataset Metadata Spec v0.1

This specification defines the minimum fields required for each dataset published in the Deception Archive.

## Goals

- Keep dataset cards comparable across studies.
- Make filtering and search behavior predictable.
- Ensure future ingestion pipelines can validate metadata automatically.

## Required Fields

- id: Stable slug identifier.
- name: Public dataset name.
- description: One to three sentence summary.
- yearRange: Coverage period, for example 2018-2024.
- tags: List of domain tags.
- metadata.language: Primary language(s).
- metadata.statementCount: Number of statements/examples.
- metadata.groundTruth: How labels were established.
- metadata.topic: Primary topic of deception.
- metadata.sourceAndResearchDesign: Data provenance and collection design.

## Optional Fields (LOL Appendix Alignment)

- metadata.withinOrBetweenDesign: Within/between-subject setup.
- metadata.reuse: Whether content is reused from prior datasets.
- metadata.openSource: Dataset open availability indicator.
- metadata.documentedInAcademicOutlet: Evidence of academic publication.
- metadata.truthfulDeceptiveProportion: Class balance summary.
- metadata.format: Data modality/format (for example typed, transcribed).
- metadata.typeOfDeception: Deception subtype (for example fabrication, embedded lies).
- metadata.sourceAndResearchDesign: Provenance and collection setup.
- metadata.datasetAvailable: Access status or link availability note.
- metadata.note: Free-form annotation for caveats.
- metadata.key: Internal dataset key used for traceability.

## LOL Row-Level Column Aliases

Dataset files in `src/data/LOL/Dataset_id` include naming variants that should be normalized during ingestion.

- participant_id aliases: `participant_id`, `partecipant_id`, `id_participant`
- original_label aliases: `original_label`, `label_original`
- standardized_label aliases: `standardized_label`, `label_standardized`
- text aliases: `text`, `text_clean`, `original_text`
- extra optional field: `modality`

## Enumerations (initial)

### Ground Truth Procedure

- Expert annotation
- Fact-checking organizations
- Court-verified outcomes
- Author admission
- Mixed procedure

### Source And Research Design

- Observational corpus
- Lab experiment
- Field experiment
- Interview protocol
- Mixed design

## Notes

- This is intentionally small and should evolve after team review.
- Once approved, backend ingestion should enforce the JSON schema in specs/dataset.schema.json.
