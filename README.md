# Public Ledger > Data API

Homepage for Public Ledger Data API project, built with SvelteKit.

## Development

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

## Building

To create a production build:

```sh
npm run build
```

The static site will be generated in the `build` directory.

## Linting and Formatting

Run ESLint:

```sh
npm run lint
```

Format code with Prettier:

```sh
npm run format
```

## Deployment

This site is automatically deployed to GitHub Pages at `data.publicledger.news` when changes are pushed to the `main` branch.

### Setup

To enable automatic deployment, ensure GitHub Pages is configured in your repository settings:

1. Go to **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to "GitHub Actions"

### Workflow

The deployment workflow (`.github/workflows/release.yml`):

1. **Creates a new GitHub Release** with auto-incremented patch version (e.g., v1.0.0 → v1.0.1)
2. **Builds the SvelteKit app** using `npm run build`
3. **Deploys to GitHub Pages**
   - Uploads the `build` directory
   - The CNAME file ensures the site is served at `data.publicledger.news`

Each push to `main` automatically creates a new release and deploys the updated site.
