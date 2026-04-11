# Capstone: Structured Data Extraction Pipeline

Build a production-grade extraction pipeline that handles messy, inconsistent insurance claim documents using Claude's tool use for structured output.

## Setup

```bash
cp .env.example .env
# Add your Anthropic API key to .env
npm install
```

## File Overview

| File | Status | Purpose |
|------|--------|---------|
| `documents.js` | Complete | 8 insurance claim documents with varying challenges |
| `schema.js` | You build | Tool schema defining the extraction structure |
| `extractor.js` | You build | Main pipeline: extraction, feedback loops, retry logic |
| `validator.js` | You build | Validation rules for extracted data |
| `review-router.js` | You build | Routes low-confidence extractions for human review |

## Running

```bash
# Extract a single document by ID
node extractor.js 1

# Extract all documents
node extractor.js --all

# Extract with retry logic
node extractor.js 1 --with-retry

# Run full pipeline (extract + validate + route)
node extractor.js 1 --full-pipeline

# Run full pipeline on all documents
node extractor.js --all --full-pipeline
```

## Validate Setup

```bash
npm run validate
```

This confirms documents and schema load correctly.
