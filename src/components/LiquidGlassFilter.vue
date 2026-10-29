<template>
  <svg width="0" height="0" style="position: absolute; pointer-events: none" aria-hidden="true">
    <defs>
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
</template>

<script>
// Port of LiquidGlassFilter from @zakisheriff/liquid-glass (MIT,
// Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass): the
// static SVG refraction defs the library's glass surfaces reference
// through the --lg-filter variable. The variable itself is only set
// (in App.vue) when the browser can refract a backdrop — the
// library's own canRefractBackdrop test is Chromium-only — so Safari
// keeps the plain frosted glass instead of losing its blur to an
// unsupported filter reference.
export default {
  name: 'LiquidGlassFilter'
}
</script>
