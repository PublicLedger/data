# news-bots

Homepage for news-bots project built with SvelteKit.

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

This site is automatically deployed to GitHub Pages at `www.news-bots.com` when changes are pushed to the `main` branch.

The deployment workflow:

1. Builds the SvelteKit app using `npm run build`
2. Uploads the `build` directory to GitHub Pages
3. The CNAME file ensures the site is served at `www.news-bots.com`

### Manual Deployment

You can also trigger a manual deployment from the Actions tab in GitHub by running the "Deploy to GitHub Pages" workflow.
