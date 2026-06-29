# Deception Archive Web

Frontend draft for the Deception Archive (Library of Lies), inspired by a Kaggle-like dataset browsing experience.

## Current scope

- React + TypeScript + Vite scaffold
- Route structure for:
  - Dataset listing page
  - Dataset detail page
  - Glossary page
- Initial metadata model and mock datasets
- Initial dataset metadata specification files

## Run locally

1. Install dependencies:

   npm install

2. Start development server:

   npm run dev

3. Build for production:

   npm run build

4. Lint project:

   npm run lint

## Project structure

- src/components: shared UI pieces
- src/pages: route pages
- src/types: TypeScript data contracts
- src/data: mock datasets used by the draft UI
- specs: metadata spec and JSON schema

## Specs integrated

- specs/dataset-metadata-spec.md: human-readable metadata standard
- specs/dataset.schema.json: machine-readable JSON schema for validation

The UI types in src/types/dataset.ts align with these spec files.
