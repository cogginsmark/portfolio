<template>
  <!--
    Renders shared SVG filter definitions used by all liquid glass components.
    Wrap your app (or the section using glass components) with this provider.
    If not used, glass components will auto-inject a local filter.
  -->
  <svg width="0" height="0" style="position: absolute; pointer-events: none" aria-hidden="true">
    <defs>
      <!-- Light refraction filter with increasing intensity -->
      <filter
        v-for="level in 10"
        :key="level"
        :id="`liquid-glass-refract-${level}`"
        x="-10%"
        y="-10%"
        width="120%"
        height="120%"
        color-interpolation-filters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          :baseFrequency="`${0.012 + level * 0.001} ${0.01 + level * 0.0008}`"
          numOctaves="3"
          seed="42"
          result="noise"
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" :scale="level * 2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
  <slot />
</template>

<script setup>
// Vue port of LiquidGlassFilter from @zakisheriff/liquid-glass v0.3.13
// (MIT, Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass).
// The React original wraps its children in a GlassFilterContext.Provider
// (read back through its useGlassFilterMounted hook); Vue has no context
// here, so the component simply renders the shared SVG defs followed by its
// default slot, in the original's order. The SVG itself is identical to the
// React output: the same 10 filters, ids liquid-glass-refract-1…10,
// feTurbulence baseFrequency 0.012 + level·0.001 / 0.01 + level·0.0008,
// numOctaves 3, seed 42, and feDisplacementMap scale level·2 — the defs the
// library's glass surfaces reference through the --lg-filter variable, which
// is only set when the browser can refract a backdrop (the library's own
// canRefractBackdrop test is Chromium-only), so Safari keeps the plain
// frosted glass instead of losing its blur to an unsupported filter
// reference.
</script>
