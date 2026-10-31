<!--
  Vue port of GlassCard from @zakisheriff/liquid-glass v0.3.13 (MIT,
  Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass).
  Direct translation: same DOM, classes, prop names and defaults as the
  React original (children → default slot, hooks → composables).
  The per-component stylesheet (GlassCard.css) is NOT copied: the
  package's styles.css, imported once at the app root, covers it.
-->
<template>
  <div
    ref="rootRef"
    :class="classes"
    data-liquid-glass=""
    :style="cardStyle"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRefraction } from '../engine/refraction.js'

/** A refracting glass panel for grouping content. */
const props = defineProps({
  /** Refraction strength from 1 (subtle) to 10 (heavy). Default 5. */
  intensity: { type: Number, default: 5 },
  /** CSS colour washed over the glass. */
  tint: { type: String, default: undefined },
  /** Kept for API compatibility. */
  shimmer: { type: Boolean, default: undefined },
  /** Rim bevel scale (1–4). Default 1. */
  thickness: { type: Number, default: 1 },
  /** Inner padding. Default '24px'. */
  padding: { type: String, default: '24px' },
  /** Corner radius. Default '28px'. */
  radius: { type: String, default: '28px' },
  /** `regular` frosted panel (default) or `clear` see-through glass. */
  variant: {
    type: String,
    default: 'regular',
    validator: (v) => ['regular', 'clear'].includes(v),
  },
})

const rootRef = ref(null)
useRefraction(rootRef, () => ({
  kind: 'surface',
  strength: Math.max(1, Math.min(10, props.intensity)) / 5,
  bezel: 16 * Math.max(0.5, props.thickness),
  thickness: 22 * Math.max(0.5, props.thickness),
}))

const classes = computed(() => ['lg-glass', 'lg-glass--host', 'lg-card', `lg-card--${props.variant}`].join(' '))
// The caller's own style (a fallthrough attribute) merges over this
// object in Vue, as the React original's trailing `...style` spread did.
const cardStyle = computed(() => ({
  padding: props.padding,
  borderRadius: props.radius,
  ...(props.tint ? { '--lg-host-tint': props.tint } : {}),
}))
</script>
