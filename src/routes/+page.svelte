<script lang="ts">
  import { PUBLIC_BASE_URL, PUBLIC_TAGLINE, PUBLIC_TITLE } from "$env/static/public";
  import newsBot from "$lib/assets/newsbot.png";
</script>

<svelte:head>
  <link rel="canonical" href={PUBLIC_BASE_URL} />
  <meta name="description" content={PUBLIC_TAGLINE} />
  <meta property="og:description" content={PUBLIC_TAGLINE} />
  <meta property="og:url" content={PUBLIC_BASE_URL} />
  <meta property="og:title" content={PUBLIC_TITLE} />
  <title>{PUBLIC_TITLE}</title>
</svelte:head>

<h2 aria-label="news bots">
  <abbr id="news" title="news">📰</abbr>
  <abbr id="bots" title="bots">🤖</abbr>
  = <img id="newsbot" src={newsBot} alt="News-Bots" />
</h2>
