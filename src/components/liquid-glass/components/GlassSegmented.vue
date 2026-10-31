<template>
  <LensTrack
    variant="segmented"
    :class="[size === 'sm' ? 'lg-track--sm' : '']"
    :aria-label="ariaLabel"
    :intensity="intensity"
    :index="value"
    :labels="normalized.map((option) => option.label)"
    :items="normalized"
    @change="emit('change', $event)"
  >
    <template #item="{ index }">
      <!-- Wrapped like tab bar icons, so the real icon hides under the lens
           (only its magnified copy shows) and takes the lens tint. -->
      <span v-if="normalized[index].icon != null" class="lg-nav__icon"><component :is="normalized[index].icon" /></span>
      <span class="lg-nav__label">{{ normalized[index].label }}</span>
    </template>
  </LensTrack>
</template>

<script setup>
// Vue port of GlassSegmented from @zakisheriff/liquid-glass v0.3.13
// (MIT, Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass).
//
// iOS 26 segmented control. The whole control swells under the finger and the
// selection lifts into a clear lens that can be dragged between segments.
//
// Same props and 'change' payload (the selected index) as the React
// original. Two framework translations: an option's `icon`, a ReactNode in
// React, is a Vue component here and renders through <component :is> inside
// the same .lg-nav__icon span; and the original's className/style props are
// not re-declared — class/style set on this component fall through
// LensTrack to the track's root element, which is where the React props
// landed too. Size 'sm' adds the lg-track--sm class to the track, as in the
// original.
import { computed } from 'vue'
import LensTrack from './internal/LensTrack.vue'

const props = defineProps({
  /** Segment labels, or `{ label, icon }` objects. */
  options: { type: Array, required: true },
  /** Zero-based index of the selected segment. */
  value: { type: Number, required: true },
  /** 36px (default) or compact 28px. */
  size: { type: String, default: 'md' },
  /** Refraction strength from 1 (subtle) to 10 (heavy). Default 5. */
  intensity: { type: Number, default: 5 },
  ariaLabel: { type: String, default: undefined },
})

const emit = defineEmits(['change'])

const normalized = computed(() => props.options.map((option) => (typeof option === 'string' ? { label: option } : option)))
</script>
