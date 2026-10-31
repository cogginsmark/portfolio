<template>
  <LensTrack
    variant="tabbar"
    :class="['lg-nav', hasIcons ? '' : 'lg-track--labels-only', iconsOnly ? 'lg-track--icons-only' : '']"
    :aria-label="ariaLabel"
    :intensity="intensity"
    :index="activeIndex"
    :labels="items.map((item) => item.label)"
    :items="items"
    @change="emit('change', $event)"
  >
    <template #item="{ index }">
      <span v-if="items[index].icon != null" class="lg-nav__icon"><component :is="items[index].icon" /></span>
      <span v-if="!iconsOnly" class="lg-nav__label">{{ items[index].label }}</span>
    </template>
  </LensTrack>
</template>

<script setup>
// Vue port of GlassNav from @zakisheriff/liquid-glass v0.3.13
// (MIT, Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass).
//
// The iOS 26 floating tab bar. Press a tab and the selection inflates into a
// liquid lens you can drag across the bar; let go and it drops into place.
//
// Same props and 'change' payload (the selected index) as the React
// original. Two framework translations: an item's `icon`, a ReactNode in
// React, is a Vue component here and renders through <component :is> inside
// the same .lg-nav__icon span; and the original's className/style props are
// not re-declared — class/style set on this component fall through
// LensTrack to the track's root element, merged with the classes computed
// here, which is where the React props landed too.
import { computed } from 'vue'
import LensTrack from './internal/LensTrack.vue'

const props = defineProps({
  /** Tabs to render. Icons sit above labels, like the iOS 26 tab bar. */
  items: { type: Array, required: true },
  /** Zero-based index of the selected tab. Default 0. */
  activeIndex: { type: Number, default: 0 },
  /** Refraction strength from 1 (subtle) to 10 (heavy). Default 5. */
  intensity: { type: Number, default: 5 },
  /** Show the label under each icon. With `false` the bar is icons only and
   *  the labels become the tabs' accessible names. Default true. */
  showLabels: { type: Boolean, default: true },
  ariaLabel: { type: String, default: 'Tabs' },
})

const emit = defineEmits(['change'])

const hasIcons = computed(() => props.items.some((item) => item.icon != null))
const iconsOnly = computed(() => hasIcons.value && !props.showLabels)
</script>
