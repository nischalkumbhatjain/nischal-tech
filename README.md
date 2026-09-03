# Sabari Cable Rate Finder

Sabari Cable Rate Finder is an Angular progressive web app for looking up cable
rates from an Excel rate sheet. Users upload the sheet once, choose the cable
specification step by step, and get the matching rate. The imported data is
kept in the browser, so subsequent searches do not require another upload.

## Features

- Import `.xlsx` and `.xls` rate sheets in the browser.
- Filter rates by SQMM, core, metal, type, and colour.
- Copy a formatted rate result to the clipboard.
- Update the stored rate sheet from the wizard settings panel.
- Keep rate data in IndexedDB using Dexie.
- Run as an installable, service-worker-enabled PWA.
- Track visits with CountAPI and retry failed visit updates when the browser
	comes back online.

## Rate sheet format

The first worksheet is read. Its headers must use the following names:

| Column | Value |
| --- | --- |
| `sqmm` | Numeric cable cross-sectional area |
| `core` | Numeric core count |
| `metal` | Conductor metal, such as copper or aluminium |
| `type` | Cable type |
| `colour` | Cable colour |
| `rate` | Numeric rate |

Example:

```csv
sqmm,core,metal,type,colour,rate
1.5,2,Copper,PVC,Red,1250
2.5,3,Aluminium,XLPE,Black,2100
```

Although the example is shown as CSV for readability, upload the data as an
Excel workbook (`.xlsx` or `.xls`). Values are trimmed and numeric fields are
converted during import.

## User flow

1. Open the app and upload a rate sheet if no data is stored locally.
2. Select SQMM, core, metal, type, and colour in the wizard.
3. View the matching rate and copy the formatted result.
4. Use **Start Over** for another lookup, or use settings to replace the rate
	 sheet.

Rate records and the last update timestamp are stored locally in the browser.
Clearing site data or using another browser removes the stored rate sheet.

## Routes

Hash-based routing is enabled for static hosting:

| Path | Purpose |
| --- | --- |
| `/` | Upload a rate sheet or redirect to the wizard when data exists |
| `/wizard` | Select cable attributes and find a rate |
| `/result` | Result view |
| `/developer/count` | Visit-count view |

## Development

Install dependencies with Node.js and npm, then start the development server:

```bash
npm install
npm start
```

The app opens at `http://localhost:4200/`. The `start` script enables Angular's
development server and opens the browser automatically.

Useful commands:

```bash
npm run build                 # Production build in dist/nischal-tech
npm run watch                 # Rebuild continuously in development mode
npm test                      # Run unit tests with Karma and Jasmine
npm run build:ghpages         # Production build for GitHub Pages
npm run deploy                # Build and publish to the gh-pages branch
```

There is currently no end-to-end test runner configured in this project.

## Deployment

`npm run deploy` builds the production app with the base href
`/nischal-tech/` and publishes `dist/nischal-tech` to the `gh-pages` branch.
The application is configured for GitHub Pages and uses hash routes so page
refreshes work on static hosting.

## Technology

- Angular 15 and TypeScript
- Angular Router, Forms, Animations, and Service Worker
- Dexie for IndexedDB persistence
- SheetJS (`xlsx`) for Excel parsing
- Bootstrap Icons and `ngx-toastr`
- Karma, Jasmine, and Angular CLI for unit testing

## Visit counting

Visits use the public CountAPI namespace `khwaab-solution`. Failed requests
are queued in `localStorage` and retried when the browser is online. The count
is not shown in the main workflow; the developer view can read it from:

`https://countapi.mileshilliard.com/api/v1/get/khwaab-solution`

This client-side counter is public and is not suitable for private or
security-sensitive analytics. Use an authenticated server-side endpoint for
those requirements.
