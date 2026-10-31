<template>
  <div class="showcase">
    <h1 class="showcase-title">Liquid Glass — component bench</h1>
    <p class="showcase-note">
      Branch-only review surface for the Vue translation of
      @zakisheriff/liquid-glass v0.3.13. Not linked from the nav; not a
      designed page — every component below is live, with its own
      springs and refraction, over the site's background and a photo
      backdrop (glass needs something behind it to bend).
    </p>

    <section class="showcase-backdrop">
      <div class="showcase-row">
        <GlassButton variant="glass">Glass</GlassButton>
        <GlassButton variant="clear">Clear</GlassButton>
        <GlassButton variant="tinted" tint="#c2255c">Tinted</GlassButton>
        <GlassButton variant="filled" tint="#af52de">Filled</GlassButton>
        <GlassButton destructive>Delete</GlassButton>
        <GlassButton aria-label="Add"><template #icon><i class="fas fa-plus"></i></template></GlassButton>
      </div>

      <div class="showcase-row">
        <label class="showcase-setting"><span>Wi-Fi</span>
          <GlassSwitch :checked="wifi" @change="wifi = $event" aria-label="Wi-Fi" />
        </label>
        <label class="showcase-setting"><span>Focus</span>
          <GlassSwitch :checked="focus" @change="focus = $event" tint="#ff9f0a" aria-label="Focus" />
        </label>
        <GlassSwitch default-checked aria-label="Bluetooth" />
      </div>

      <div class="showcase-row showcase-row--wide">
        <GlassSlider :value="volume" @change="volume = $event" aria-label="Volume" />
        <GlassSlider :show-thumb="false" :value="brightness" @change="brightness = $event" label="Display">
          <template #icon><i class="fas fa-sun"></i></template>
        </GlassSlider>
      </div>

      <div class="showcase-row">
        <GlassSegmented :options="['Day', 'Week', 'Month']" :value="range" @change="range = $event" aria-label="Range" />
        <GlassMenu aria-label="More" :items="menuItems">
          <template #icon><i class="fas fa-ellipsis"></i></template>
        </GlassMenu>
        <GlassButton @click="sheetOpen = true">Open sheet</GlassButton>
      </div>

      <div class="showcase-row showcase-row--wide">
        <GlassInput type="search" placeholder="Search" :value="query" @change="(e) => (query = e.target.value)" aria-label="Search" />
      </div>

      <GlassCard padding="20px" radius="32px">
        <h3 class="showcase-card-title">GlassCard — frosted panel</h3>
        <p class="showcase-card-text">The slider, switch and buttons inside a card refract the card's own glass beneath them.</p>
        <GlassSlider :value="progress" @change="progress = $event" aria-label="Position" />
      </GlassCard>
      <GlassCard variant="clear" padding="20px" radius="32px">
        <h3 class="showcase-card-title">GlassCard — clear</h3>
        <p class="showcase-card-text">See-through variant over the photo backdrop.</p>
      </GlassCard>

      <div class="showcase-row">
        <GlassNav :active-index="tab" @change="tab = $event" aria-label="Sections" :items="navItems" />
      </div>
    </section>

    <GlassSheet :open="sheetOpen" @close="sheetOpen = false" aria-label="Details">
      <p class="showcase-sheet-text">A floating bottom sheet. Drag or flick it down, tap the scrim, or press Escape to dismiss.</p>
      <GlassButton @click="sheetOpen = false">Done</GlassButton>
    </GlassSheet>
  </div>
</template>

<script>
import { defineComponent, h } from 'vue'
import {
  GlassButton,
  GlassCard,
  GlassInput,
  GlassMenu,
  GlassNav,
  GlassSegmented,
  GlassSheet,
  GlassSlider,
  GlassSwitch
} from './components/liquid-glass/index.js'

// FontAwesome glyphs as tiny render-function components, the shape
// the track components take for their item icons.
const faIcon = (cls) =>
  defineComponent({
    name: 'ShowcaseIcon',
    render: () => h('i', { class: cls, 'aria-hidden': 'true' })
  })

// The bench page: one live instance of every translated component,
// wired the way the library's own README examples wire them. State
// is local; nothing here touches the site's stores or routes.
export default {
  name: 'LiquidGlassShowcase',
  components: {
    GlassButton,
    GlassCard,
    GlassInput,
    GlassMenu,
    GlassNav,
    GlassSegmented,
    GlassSheet,
    GlassSlider,
    GlassSwitch
  },
  data() {
    return {
      wifi: true,
      focus: false,
      volume: 40,
      brightness: 70,
      progress: 30,
      range: 0,
      tab: 0,
      query: '',
      sheetOpen: false,
      navItems: [
        { label: 'Home', icon: faIcon('fas fa-house') },
        { label: 'Saved', icon: faIcon('fas fa-bookmark') },
        { label: 'Library', icon: faIcon('fas fa-grip') },
        { label: 'Search', icon: faIcon('fas fa-magnifying-glass') }
      ],
      menuItems: [
        { label: 'Share', onSelect: () => {} },
        { label: 'Duplicate', onSelect: () => {} },
        { label: 'Delete', destructive: true, onSelect: () => {} }
      ]
    }
  }
}
</script>

<style scoped>
.showcase {
  max-width: 1180px;
  margin: 0 auto;
  padding: 2.5rem var(--gutter, 1.25rem) 6rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.showcase-title {
  font-size: 1.6rem;
  font-weight: 700;
}

.showcase-note {
  max-width: 62ch;
  line-height: 1.55;
  opacity: 0.85;
}

.showcase-backdrop {
  background-image: url('/photo.jpg');
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-card, 1.25rem);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.showcase-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.9rem;
}

.showcase-row--wide {
  max-width: 34rem;
}

.showcase-setting {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
}

.showcase-card-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.showcase-card-text {
  line-height: 1.5;
  margin-bottom: 1rem;
}

.showcase-sheet-text {
  line-height: 1.55;
  margin-bottom: 1rem;
}
</style>
