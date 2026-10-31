<template>
  <div
    ref="bar"
    role="tablist"
    :aria-label="ariaLabel"
    class="lg-track"
    :class="`lg-track--${variant}`"
    data-liquid-glass=""
    :style="{ '--lg-count': items.length, '--lg-index': index }"
  >
    <span ref="glass" class="lg-glass lg-track__glass" aria-hidden="true" />
    <span ref="select" class="lg-track__select" aria-hidden="true" />
    <button
      v-for="(item, i) in items"
      :key="i"
      type="button"
      role="tab"
      :data-lg-item="i"
      :aria-selected="i === index"
      :aria-label="labels[i]"
      :tabindex="i === index ? 0 : -1"
      class="lg-track__item"
    >
      <slot name="item" :index="i" :item="item" />
    </button>
    <span ref="lens" class="lg-glass lg-track__lens" data-lg-mirror-bare="" aria-hidden="true" />
  </div>
</template>

<script setup>
// Vue port of LensTrack (internal) from @zakisheriff/liquid-glass v0.3.13
// (MIT, Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass).
// The React original takes `items` as an array of ReactNodes and renders one
// inside each tab button; here the buttons' content comes from the scoped
// slot named "item" (:index, :item), while the `items` prop itself is still
// passed — the track needs its length, and each item's data travels with the
// slot scope. The original's className/style props are not re-declared:
// class/style set on this component fall through to the root element and
// merge with its own, which is where the React props landed too.
// The original's per-component CSS import ('./LensTrack.css') is NOT copied —
// that CSS ships in '@zakisheriff/liquid-glass/styles.css', imported once by
// the app.
import { computed, ref } from 'vue'
import { useLensTrack } from '../../engine/lensTrack.js'
import { useRefraction } from '../../engine/refraction.js'

const props = defineProps({
  items: { type: Array, required: true },
  labels: { type: Array, required: true },
  index: { type: Number, required: true },
  variant: {
    type: String,
    required: true,
    validator: (value) => value === 'tabbar' || value === 'segmented',
  },
  intensity: { type: Number, default: 5 },
  ariaLabel: { type: String, default: undefined },
})

const emit = defineEmits(['change'])

const bar = ref(null)
const glass = ref(null)
const lens = ref(null)
const select = ref(null)
const strength = computed(() => Math.max(1, Math.min(10, props.intensity)) / 5)
const tabbar = computed(() => props.variant === 'tabbar')
const zoom = computed(() => (tabbar.value ? 1.04 : 1.1))

useRefraction(glass, () => ({ kind: 'surface', strength: strength.value }))
// iOS: a magnified centre and a thick rounded rim that bends whatever sits
// under its edge (icons, labels, the bar's own border) with a faint
// rainbow fringe.
// Where the backdrop can't be filtered (Safari, Firefox) the lens refracts a
// live copy of the bar instead, so the icons still magnify inside it.
const overhang = computed(() => (tabbar.value ? 14 : 12))
// Only the part of the lens over the bar bends; where it rises past the bar
// it stays clear glass.
// The lens shows a magnified, fully tinted copy of the bar, bent at its rim
// where the browser can filter it: whatever the rim draws in is tinted too,
// as on iOS, instead of the real glyphs showing white through it.
useRefraction(
  lens,
  () => ({ kind: 'lens', strength: 1, stretch: 1, bezel: tabbar.value ? 24 : 16, zoom: zoom.value, dispersion: 1, copy: 'refract' }),
  true,
  bar,
  () => bar.value?.hasAttribute('data-lifted') ?? false,
)

useLensTrack({ bar, glass, lens, select }, () => ({
  count: props.items.length,
  index: props.index,
  onSelect: (next) => emit('change', next),
  overhang: overhang.value,
  spread: tabbar.value ? 0.3 : 0.16,
  contentZoom: zoom.value,
  copied: true,
  swell: tabbar.value ? 8 : 14,
}))
</script>
