<script lang="ts">
  /** regular href property */
  export let to: string;
  /** add rel="me" */
  export let me: boolean = false;

  $: rel = ["noreferrer", me ? "me" : null].filter(Boolean).join(" ");
  $: href = to;
</script>

<!-- eslint-disable -->
<a {href} {rel} {...$$restProps}>
  <slot />
</a>
