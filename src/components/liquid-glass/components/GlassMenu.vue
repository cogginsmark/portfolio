<!--
  Vue port of GlassMenu from @zakisheriff/liquid-glass v0.3.13 (MIT,
  Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass).
  Direct translation, bit-for-bit in DOM, classes, props and behaviour:
  the trigger is the ported GlassButton (its #icon slot receives this
  component's #icon slot), the grow-from-the-button spring, the items'
  blur reveal and the slide-to-select scrub are ported with the
  original's constants, and item `onSelect` callbacks pass through as
  data exactly as in React.
  The component's own stylesheet is NOT copied: the package's styles.css
  (imported once at the app root) carries every .lg-menu rule.
-->
<template>
  <span ref="anchorRef" :class="['lg-menu-anchor', attrs.class]" :data-align="align">
    <GlassButton
      ref="triggerRef"
      :size="size"
      :aria-label="ariaLabel"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="open = !open"
    >
      <template v-if="$slots.icon" #icon><slot name="icon" /></template>
    </GlassButton>
    <div v-if="mounted" ref="surfaceRef" class="lg-menu-surface">
      <div ref="panelRef" class="lg-glass lg-menu" data-liquid-glass="" aria-hidden="true" />
      <div ref="contentRef" class="lg-menu__content" role="menu" :aria-label="ariaLabel">
        <button
          v-for="(item, index) in items"
          :key="index"
          type="button"
          role="menuitem"
          class="lg-menu__item"
          :data-destructive="item.destructive ? '' : undefined"
          :data-index="index"
          :disabled="item.disabled"
          @click="onItemClick($event, item)"
        >
          <span v-if="item.icon != null" class="lg-menu__icon">
            <component :is="item.icon" v-if="isNode(item.icon)" />
            <template v-else>{{ item.icon }}</template>
          </span>
          <span class="lg-menu__label">
            <component :is="item.label" v-if="isNode(item.label)" />
            <template v-else>{{ item.label }}</template>
          </span>
          <span v-if="item.checked" class="lg-menu__check">
            <slot v-if="$slots.check" name="check" />
            <!-- The original's Tick: the default trailing checkmark. -->
            <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </span>
</template>

<script setup>
import { onUnmounted, ref, useAttrs, watch } from 'vue'
import { createSpring, clamp, springFrom } from '../engine/spring.js'
import { haptic } from '../engine/haptics.js'
import { usePress } from '../engine/press.js'
import GlassButton from './GlassButton.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Menu rows (the trigger icon is the #icon slot). */
  items: { type: Array, required: true },
  /** Accessible name for the trigger. */
  ariaLabel: { type: String, required: true },
  /** Which edge of the trigger the menu grows from. Default 'end' (right). */
  align: { type: String, default: 'end' },
  /** Trigger size, as for GlassButton. Default 'md'. */
  size: { type: String, default: 'md' },
  /** Menu width in px. Default 230. */
  width: { type: Number, default: 230 }
  // (`check` is the #check slot; `className` arrives as `class` and is
  // bound to the anchor span from attrs, as React applies it there.)
})

const attrs = useAttrs()

const OPEN = springFrom(0.36, 0.74)
/** Underdamped, so the droplet lands in the button with a slight jiggle. */
const CLOSE = springFrom(0.42, 0.66)
const FADE = springFrom(0.24, 1)
const FADE_OUT = springFrom(0.2, 1)

// Item icons/labels are ReactNodes in the original; here they may be Vue
// components (rendered with <component :is>) or plain strings (rendered
// as text).
const isNode = (value) => (typeof value === 'object' && value !== null) || typeof value === 'function'

const open = ref(false)
const mounted = ref(false)
const anchorRef = ref(null)
const triggerRef = ref(null)
const surfaceRef = ref(null)
const panelRef = ref(null)
const contentRef = ref(null)
const spring = ref(null)
// The React original forwards its ref through GlassButton to the <button>;
// a Vue component ref lands on the instance, whose $el is that button.
const triggerEl = () => triggerRef.value?.$el ?? triggerRef.value

// Held, the open menu behaves like any glass button: it swells and is drawn
// out toward the finger, then wobbles back.
usePress(surfaceRef, () => ({ grow: 0.035, lean: 6, stretch: 0.1, disabled: !mounted.value }))

watch(open, (value) => {
  if (value) {
    mounted.value = true
    // Reopened mid-close: grow back out from wherever the droplet is.
    if (spring.value) {
      spring.value.tune(OPEN)
      spring.value.set(1)
    }
  } else if (spring.value) {
    spring.value.tune(CLOSE)
    spring.value.set(0)
  }
}, { flush: 'post' })

// The layout effect: runs when the surface mounts (useLayoutEffect in the
// original), measures trigger/content, and drives the morph.
watch(mounted, (isMounted, _was, onCleanup) => {
  if (!isMounted) return
  const surface = surfaceRef.value
  const panel = panelRef.value
  const content = contentRef.value
  const trigger = triggerEl()
  if (!surface || !panel || !content || !trigger) return
  const w = trigger.offsetWidth
  const h = trigger.offsetHeight
  const W = Math.max(w, Math.min(props.width, window.innerWidth - 24))
  content.style.width = `${W}px`
  const H = Math.max(h, content.offsetHeight)
  // The glass keeps its final size and morphs with a transform from the
  // trigger's corner. Resizing a backdrop-filtered layer every frame makes
  // Safari paint stray colours along its edges.
  surface.style.width = `${W}px`
  surface.style.height = `${H}px`
  const end = props.align === 'end'
  // The live droplet outline, shared by the glass and the items above it.
  const box = { cw: w, ch: h, r: h / 2 }
  let scaleNow = 1
  let closing = false
  const clipContent = () => {
    // Items are scaled about the trigger's corner; clip in their own units.
    const k = scaleNow
    const right = Math.max(0, W - box.cw / k)
    const bottom = Math.max(0, H - box.ch / k)
    content.style.clipPath = box.cw >= W - 0.5 && box.ch >= H - 0.5 && k === 1
      ? ''
      : `inset(0 ${end ? 0 : right}px ${bottom}px ${end ? right : 0}px round ${box.r / k}px)`
  }
  const shape = (p) => {
    const cw = Math.max(1, w + (W - w) * p)
    const ch = Math.max(1, h + (H - h) * p)
    const sx = cw / W
    const sy = ch / H
    panel.style.transform = `scale(${sx}, ${sy})`
    // In flight it's a round droplet (fully rounded on its short side) and
    // only squares off into the menu's corners as it lands. The radius is
    // given in the panel's own, unscaled units.
    const land = clamp((p - 0.5) / 0.5, 0, 1)
    const r = (Math.min(cw, ch) / 2) * (1 - land) + 24 * land
    panel.style.borderRadius = `${r / sx}px / ${r / sy}px`
    box.cw = cw
    box.ch = ch
    box.r = r
    clipContent()
    // Near the button's size the two shapes coincide, so the button and the
    // menu cross-fade there: the button melts into the menu on open and
    // reappears inside the shrinking droplet on close.
    // Closing, the button starts showing through early so the droplet
    // never sits as a blank pill between the items and the label.
    const k = clamp(p / (closing ? 0.7 : 0.35), 0, 1)
    panel.style.opacity = String(closing ? Math.min(1, k * 1.4) : k)
    trigger.style.opacity = String(1 - k)
    // Past the button's size the close overshoots: the button squashes
    // and springs back as part of the same motion.
    trigger.style.scale = closing && p < -0.0005 ? `${1 - p * 0.6} ${1 + p * 1.2}` : ''
  }
  // The items ride above the glass on their own layer: they grow out of a
  // blur as the droplet lands, on a critically damped curve so they sharpen
  // once and stay sharp.
  const reveal = (q) => {
    const t = clamp(q, 0, 1)
    const blur = 9 * (1 - t) ** 2.5
    content.style.opacity = String(t)
    scaleNow = t < 0.999 ? 0.82 + 0.18 * t : 1
    content.style.scale = scaleNow === 1 ? '' : String(scaleNow)
    clipContent()
    content.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none'
  }
  shape(0)
  reveal(0)
  const s = createSpring(0, OPEN, (p, v) => {
    shape(p)
    // Unmount only once the landing jiggle has fully settled.
    if (s.target === 0 && p === 0 && v === 0) {
      trigger.style.opacity = ''
      trigger.style.scale = ''
      mounted.value = false
    }
  })
  const fade = createSpring(0, FADE, reveal)
  spring.value = {
    ...s,
    tune: s.tune,
    set(target, instant) {
      closing = target === 0
      // A closing menu lets clicks through to the button beneath it.
      surface.style.pointerEvents = closing ? 'none' : ''
      fade.tune(target ? FADE : FADE_OUT)
      fade.set(target, instant)
      s.set(target, instant)
    }
  }
  spring.value.set(1)
  content.querySelector('[role="menuitem"]:not([disabled])')?.focus({ preventScroll: true })
  onCleanup(() => {
    s.stop()
    fade.stop()
    spring.value = null
    trigger.style.opacity = ''
    trigger.style.scale = ''
  })
}, { flush: 'post' })

// Slide a finger across the items: the one beneath it lights up, and
// letting go there picks it, as on iOS.
watch(mounted, (isMounted, _was, onCleanup) => {
  if (!isMounted) return
  const panel = surfaceRef.value
  if (!panel) return
  let held = null
  let hot = null
  const itemAt = (x, y) =>
    document.elementFromPoint(x, y)?.closest('.lg-menu__item:not(:disabled)') ?? null
  const light = (next) => {
    if (next === hot) return
    hot?.removeAttribute('data-active')
    hot = next
    if (hot) {
      hot.setAttribute('data-active', '')
      haptic()
    }
  }
  const down = (event) => {
    if (!event.isPrimary || event.button !== 0) return
    held = event.pointerId
    hot = null
    light(itemAt(event.clientX, event.clientY))
  }
  const move = (event) => {
    if (event.pointerId === held) light(itemAt(event.clientX, event.clientY))
  }
  const up = (event) => {
    if (event.pointerId !== held) return
    held = null
    const target = hot
    light(null)
    const index = target ? Number(target.dataset.index) : -1
    const item = props.items[index]
    if (item && !item.disabled) {
      event.preventDefault()
      haptic()
      item.onSelect?.()
      open.value = false
    }
  }
  const cancel = (event) => {
    if (event.pointerId !== held) return
    held = null
    light(null)
  }
  // Touch drags must not scroll the page while scrubbing the menu.
  const hold = (event) => {
    if (held !== null && event.cancelable) event.preventDefault()
  }
  panel.addEventListener('pointerdown', down)
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', cancel)
  panel.addEventListener('touchmove', hold, { passive: false })
  onCleanup(() => {
    panel.removeEventListener('pointerdown', down)
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', cancel)
    panel.removeEventListener('touchmove', hold)
  })
}, { flush: 'post' })

watch(open, (value, _was, onCleanup) => {
  if (!value) return
  const outside = (event) => {
    if (!anchorRef.value?.contains(event.target)) open.value = false
  }
  const key = (event) => {
    if (event.key === 'Escape') {
      open.value = false
      triggerEl()?.focus({ preventScroll: true })
    }
  }
  document.addEventListener('pointerdown', outside, true)
  window.addEventListener('keydown', key)
  onCleanup(() => {
    document.removeEventListener('pointerdown', outside, true)
    window.removeEventListener('keydown', key)
  })
}, { flush: 'post' })

const select = (item) => {
  haptic()
  item.onSelect?.()
  open.value = false
}

const onItemClick = (event, item) => {
  // Pointer picks are handled on release; this is keyboard.
  if (event.detail === 0) select(item)
}

onUnmounted(() => {
  spring.value = null
})
</script>
