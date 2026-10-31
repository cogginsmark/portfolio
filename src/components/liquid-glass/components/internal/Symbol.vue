<!--
  Vue port of the internal Symbol helper from @zakisheriff/liquid-glass
  v0.3.13 (MIT, Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass).
  Direct translation of Symbol.tsx: the React original takes a `source`
  prop (an inlined SVG data URI) plus `size` — there is no name/path
  lookup — and renders a mask span; this port keeps exactly that API.
  Styles come from the package's styles.css (.lg-symbol), imported once
  at the app root; the original has no per-component stylesheet.
-->
<template>
  <span aria-hidden="true" class="lg-symbol" :style="symbolStyle" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  source: { type: String, required: true },
  size: { type: Number, default: 24 },
})

/** A monochrome symbol mask: inherits the control's colour in either theme. */
const symbolStyle = computed(() => {
  const mask = `url("${props.source}")`
  return { '--lg-symbol-size': `${props.size}px`, WebkitMaskImage: mask, maskImage: mask }
})
</script>
