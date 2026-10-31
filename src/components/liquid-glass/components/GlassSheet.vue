<!--
  Vue port of GlassSheet from @zakisheriff/liquid-glass v0.3.13 (MIT,
  Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass).
  Direct translation, bit-for-bit in DOM, classes, props and behaviour:
  React's createPortal (always, to `container ?? document.body`) becomes
  Vue's <Teleport> to the same target, `open`/`mounted` state and the
  spring/drag/detent logic are ported with the original's constants, and
  `onClose` becomes the `close` emit.
  The component's own stylesheet is NOT copied: the package's styles.css
  (imported once at the app root) carries every .lg-sheet rule.
-->
<template>
  <Teleport v-if="mounted" :to="container ?? 'body'">
    <div class="lg-sheet-layer" data-liquid-glass="" :style="container ? { position: 'absolute' } : undefined">
      <div ref="scrimRef" class="lg-sheet__scrim" aria-hidden="true" @click="emit('close')" />
      <div
        ref="sheetRef"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
        tabindex="-1"
        :class="['lg-glass', 'lg-glass--host', 'lg-sheet', detents?.length ? 'lg-sheet--detents' : '']"
        :style="tint ? { '--lg-host-tint': tint } : undefined"
      >
        <div class="lg-sheet__grabber-zone" aria-hidden="true">
          <span class="lg-sheet__grabber" />
        </div>
        <div class="lg-sheet__content"><slot /></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { clamp, createSpring, rubberband, springFrom } from '../engine/spring.js'
import { useRefraction } from '../engine/refraction.js'

const props = defineProps({
  /** Whether the sheet is open. */
  open: { type: Boolean, required: true },
  /** Refraction strength from 1 (subtle) to 10 (heavy). Default 5. */
  intensity: { type: Number, default: 5 },
  /** CSS colour washed over the glass. */
  tint: { type: String, default: undefined },
  /** Optional portal host for a sheet contained within an app preview. */
  container: { type: Object, default: null },
  /**
   * Resting heights, like iOS `.presentationDetents`. `['medium', 'large']`
   * opens at half height; drag or flick up for full screen, down to settle or
   * dismiss. Leave unset for a sheet that fits its content.
   */
  detents: { type: Array, default: undefined },
  /** Accessible name for the dialog. */
  ariaLabel: { type: String, default: undefined }
})

const emit = defineEmits(['close'])

const OPEN = springFrom(0.42, 0.86)
const CLOSE = springFrom(0.34, 1)
/** Settling onto a detent after a drag. */
const SNAP = springFrom(0.4, 0.84)

const mounted = ref(props.open)
const sheetRef = ref(null)
const scrimRef = ref(null)
const api = ref(null)
const stopsKey = computed(() => props.detents?.join(',') ?? '')
// The original keeps onClose in a ref so its long-lived effect closures
// always call the latest callback; the `close` emit is stable and reads
// the parent's current listener, so it serves the same role here.

// iOS 26 floating sheet. Rises on a spring, can be flicked or dragged down to
// dismiss, and rubber-bands when pulled up. With `detents` it rests at half
// height and expands to full screen.
watch(() => props.open, (open) => {
  if (open) mounted.value = true
  else api.value?.close()
})

// (The sheet layer only exists while mounted, so its refraction follows the
// element's presence — the original passes `mounted` as the hook's
// `enabled` argument.)
useRefraction(sheetRef, () => ({
  kind: 'surface', strength: Math.max(1, Math.min(10, props.intensity)) / 5, bezel: 20, thickness: 28
}), true)

let effectCleanup = null
const runEffect = () => {
  if (!mounted.value) return
  const sheet = sheetRef.value
  const scrim = scrimRef.value
  if (!sheet || !scrim) return
  const container = props.container
  const wantedKey = stopsKey.value
  const layer = sheet.parentElement
  const wanted = wantedKey ? wantedKey.split(',') : []

  // Positions are the sheet's translateY in px: 0 is fully raised.
  let height = 0
  let hidden = 0
  let stops = [0]
  let rest = 0
  let medium = 0
  const measure = () => {
    height = sheet.offsetHeight || 400
    // Measured from the sheet's top edge: a detent sheet runs on past the
    // bottom of the screen, so its own height isn't what's on show.
    const top = sheet.offsetTop
    hidden = layer.clientHeight - top + 24
    // Medium shows the sheet's top half of the screen's height.
    medium = Math.max(0, layer.clientHeight * 0.5 - top)
    stops = wanted.length ? wanted.map((d) => (d === 'large' ? 0 : medium)).sort((x, y) => x - y) : [0]
    rest = wanted.includes('medium') ? medium : stops[0]
  }
  measure()

  const paint = (y) => {
    sheet.style.transform = `translateY(${y}px)`
    // iOS leaves the page undimmed at the medium detent and dims it as the
    // sheet rises to full height.
    const dim = wanted.includes('medium') && medium > 0
      ? clamp(1 - y / medium, 0, 1)
      : clamp(1 - y / Math.max(1, height), 0, 1)
    scrim.style.opacity = String(dim)
    const raised = y <= 1
    if (wanted.length && sheet.hasAttribute('data-raised') !== raised) sheet.toggleAttribute('data-raised', raised)
  }
  let closing = false
  const position = createSpring(hidden, OPEN, (y) => {
    paint(y)
    if (closing && y >= hidden - 1) mounted.value = false
  })
  const go = (y, feel) => {
    position.tune(feel)
    position.set(y)
  }
  api.value = {
    close() {
      closing = true
      go(hidden, CLOSE)
    }
  }
  paint(hidden)
  requestAnimationFrame(() => {
    measure()
    position.set(hidden, true)
    if (props.open) go(rest, OPEN)
  })

  let gesture = null
  const down = (event) => {
    if (event.defaultPrevented || closing) return
    const target = event.target
    // Fully raised, the content scrolls; drag from the grabber or the top.
    const raised = position.value <= 1
    if (raised && !target.closest('.lg-sheet__grabber-zone') && sheet.scrollTop > 0) return
    if (target.closest('input, textarea, button, a, [role="slider"], [role="switch"]')) return
    position.stop()
    gesture = { id: event.pointerId, y: event.clientY, from: position.value, t: event.timeStamp, v: 0, last: position.value }
    sheet.setPointerCapture(event.pointerId)
  }
  const move = (event) => {
    if (event.pointerId !== gesture?.id) return
    const raw = gesture.from + event.clientY - gesture.y
    // Past full height the sheet only gives a little.
    const y = raw < 0 ? rubberband(raw, height, 0.3) : raw
    const dt = Math.max(1, event.timeStamp - gesture.t)
    gesture.v = gesture.v * 0.2 + ((y - gesture.last) / dt) * 0.8
    gesture.t = event.timeStamp
    gesture.last = y
    position.set(y, true)
    paint(y)
  }
  const up = (event) => {
    if (event.pointerId !== gesture?.id) return
    const { v, last } = gesture
    gesture = null
    // Where the throw would carry it, then the nearest resting place.
    const projected = last + v * 180
    const lowest = stops[stops.length - 1]
    if (projected > lowest + (hidden - lowest) * 0.45 || (v > 0.9 && last >= lowest - 4)) {
      closing = true
      go(hidden, CLOSE)
      emit('close')
      return
    }
    const target = stops.reduce((best, stop) => (Math.abs(stop - projected) < Math.abs(best - projected) ? stop : best), stops[0])
    go(target, SNAP)
  }
  const key = (event) => {
    if (event.key === 'Escape') emit('close')
  }
  const resize = () => {
    const at = position.target
    const was = stops.indexOf(at)
    measure()
    if (!closing) go(was >= 0 ? stops[Math.min(was, stops.length - 1)] : rest, SNAP)
  }
  const observer = new ResizeObserver(resize)
  observer.observe(layer)
  sheet.addEventListener('pointerdown', down)
  sheet.addEventListener('pointermove', move)
  sheet.addEventListener('pointerup', up)
  sheet.addEventListener('pointercancel', up)
  window.addEventListener('keydown', key)
  const overflow = document.body.style.overflow
  if (!container) document.body.style.overflow = 'hidden'
  sheet.focus({ preventScroll: true })
  effectCleanup = () => {
    position.stop()
    api.value = null
    observer.disconnect()
    sheet.removeEventListener('pointerdown', down)
    sheet.removeEventListener('pointermove', move)
    sheet.removeEventListener('pointerup', up)
    sheet.removeEventListener('pointercancel', up)
    window.removeEventListener('keydown', key)
    if (!container) document.body.style.overflow = overflow
  }
}

onMounted(runEffect)
watch([() => mounted.value, () => props.container, stopsKey], () => {
  effectCleanup?.()
  effectCleanup = null
  runEffect()
}, { flush: 'post' })
onUnmounted(() => effectCleanup?.())
</script>
