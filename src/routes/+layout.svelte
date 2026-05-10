<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import faviconIco from "$lib/assets/favicon.ico";
  import humanMade from "$lib/assets/human-made-badge.webp";
  import pitagon from "@fontsource/pitagon-sans-mono/files/pitagon-sans-mono-latin-400-normal.woff2?url";

  import "../app.scss";

  import { resolve } from "$app/paths";
  import Link from "$lib/Link.svelte";
  import NorefLink from "$lib/NorefLink.svelte";
  import { generateSchemaJSContent } from "$lib/utils";

  /* routes and links */
  const root = resolve(`/`);
  const year = new Date().getFullYear();
  const ldJson = generateSchemaJSContent();
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noarchive, max-image-preview:small" />
  <meta name="referrer" content="no-referrer-when-downgrade" />
  <meta name="author" content="Public Ledger devs" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={favicon} />
  <meta property="og:image:width" content="512" />
  <meta property="og:image:height" content="512" />
  <link rel="preload" as="font" type="font/woff2" href={pitagon} crossorigin="anonymous" />
  <!-- favicons -->
  <link rel="icon" href={favicon} type="image/svg+xml" />
  <link rel="icon" href={faviconIco} sizes="any" />
</svelte:head>

<main id="data-app">
  <header aria-label="Site masthead">
    <h1 aria-label="header">
      <a href={root}>Data API</a>
    </h1>
  </header>
  <article aria-label="Main content">
    <slot />
  </article>
  <footer aria-label="Site footer">
    <h2 aria-label="Copyright">
      <a href={root}>Data API</a>
      &copy;&nbsp;{year}
      <NorefLink to="https://thehumanmade.org">human-made</NorefLink> by
      <Link to="https://gasworksdata.com/">Gasworks Data</Link>
      <img class="human-made" src={humanMade} alt="TheHumanMade badge" width="50" height="50" />
      <br />
      All rights reserved
    </h2>
  </footer>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html ldJson}
  <script
    src="https://darkvisitors.com/tracker.js?project_key=e7b36ef2-e9c5-4c6e-b788-b0694015d64a"
    async
  ></script>
</main>
