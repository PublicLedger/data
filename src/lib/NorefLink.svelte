<script lang="ts">
  /** regular href property */
  export let to: string;

  $: href = to;
</script>

<!-- eslint-disable -->
<a {href} rel="nofollow noreferrer noopener" {...$$restProps}>
  <slot />
</a>
