# Articles Folder

This folder contains PDF files for articles, press coverage, interviews, and other publications related to SooNee's artistic career.

## File Structure

Place your PDF files in this folder with descriptive names. The files referenced in the Data.js file should match the filenames here.

## Current Articles (from Data.js):

1. `soonee-artist-profile-2024.pdf` - SooNee: The Journey of a Korean Artist
2. `soonee-interview-coffee-ink-2024.pdf` - Interview: Coffee and Ink - SooNee's Artistic Process
3. `grand-palais-review-2025.pdf` - Exhibition Review: Grand Palais Indépendants 2025
4. `soonee-artist-statement-2024.pdf` - Artist Statement: The Fusion of Tradition and Modernity
5. `brussels-aiam-catalog-2022.pdf` - Exhibition Catalog: Brussels AIAM Gallery 2022
6. `aiam-award-coverage-2019.pdf` - Press Coverage: AIAM Public Choice Award 2019
7. `seoul-to-world-interview-2024.pdf` - Interview: From Seoul to the World Stage
8. `gallery-ruben-catalog-2024.pdf` - Exhibition Catalog: Gallery Ruben Solo Show 2024

## Adding New Articles

1. Upload your PDF file to this folder
2. Update the `Articles` array in `src/Data.js` with the new article information
3. Make sure the `pdfUrl` matches the filename in this folder

## File Naming Convention

Use descriptive, lowercase names with hyphens:
- `exhibition-name-year.pdf`
- `interview-title-year.pdf`
- `press-article-title-year.pdf`

## Supported Categories

- `press` - Press coverage and media articles
- `interview` - Artist interviews
- `review` - Exhibition and artwork reviews
- `catalog` - Exhibition catalogs and brochures
- `statement` - Artist statements and philosophy

## Import Usage

PDFs in this folder will be imported using dynamic imports in the PDFViewer component, making them part of the build process and ensuring they're properly bundled with your application. 