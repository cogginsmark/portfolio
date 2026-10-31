<!--
  Vue port of GlassSwitch from @zakisheriff/liquid-glass v0.3.13 (MIT,
  Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass).
  Direct translation: same DOM, classes, prop names and defaults as the
  React original; the React `onChange(checked)` callback becomes the Vue
  `change` emit carrying the same bare boolean. The pointer/spring
  gesture logic below is the original's, moved from useEffect into
  onMounted with its cleanup in onUnmounted; where the original read a
  mutable `latest` ref (updated on every render), the handlers here read
  the live reactive values directly — the same "always current" effect.
  The per-component stylesheet (GlassSwitch.css) is NOT copied: the
  package's styles.css, imported once at the app root, covers it.
-->
<template>
  <button
    ref="rootRef"
    type="button"
    role="switch"
    :aria-checked="checked"
    :disabled="disabled"
    class="lg-switch"
    data-liquid-glass=""
    :style="tint ? { '--lg-switch-on': tint } : undefined"
    @keydown="onKeyDown"
  >
    <span class="lg-switch__track" aria-hidden="true" />
    <span ref="fillRef" class="lg-switch__fill" aria-hidden="true" />
    <span ref="thumbRef" class="lg-glass lg-switch__thumb" aria-hidden="true">
      <span ref="faceRef" class="lg-switch__face" />
    </span>
  </button>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { SPRINGS, clamp, createJelly, createSpring, rubberband, springFrom } from '../engine/spring.js'
import { useRefraction } from '../engine/refraction.js'
import { haptic } from '../engine/haptics.js'
import { guardSelection } from '../engine/selection.js'

/** The knob drops back with a short, gentle settle rather than a jelly bounce. */
const SETTLE = springFrom(0.36, 0.68)

const props = defineProps({
  checked: { type: Boolean, default: undefined },
  defaultChecked: { type: Boolean, default: false },
  /** On-state colour. Defaults to system green. */
  tint: { type: String, default: undefined },
  /** Refraction strength from 1 (subtle) to 10 (heavy). Default 5. */
  intensity: { type: Number, default: 5 },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['change'])

/** Thumb lens box at full lift; at rest it is scaled down to a 38×24 pill. */
const REST = 0.655
const TRAVEL = 22

const rootRef = ref(null)
const thumbRef = ref(null)
const fillRef = ref(null)
const faceRef = ref(null)

const inner = ref(props.defaultChecked)
const controlled = computed(() => props.checked !== undefined)
const checked = computed(() => (controlled.value ? props.checked : inner.value))

function setChecked(next) {
  if (!controlled.value) inner.value = next
  emit('change', next)
}

let syncFn = null

// iOS: the lifted knob is a lens that thins the track beneath it. The
// track runs on through the lens, thinner inside and flaring back to full
// height at the rim where it meets the track outside. It's drawn from a
// live copy of the switch so it can show past its own edge. No colour
// split: over a flat track it only reads as a pink smear at the rim.
useRefraction(
  thumbRef,
  () => ({
    kind: 'lens',
    zoom: 0.72,
    zoomX: 1,
    dispersion: 0,
    stretch: 1,
    copy: 'refract',
    strength: Math.max(1, Math.min(10, props.intensity)) / 5,
  }),
  true,
  rootRef,
  () => parseFloat(rootRef.value?.style.getPropertyValue('--lg-lift') || '0') > 0.01,
)

let teardown = null

onMounted(() => {
  const el = rootRef.value
  const thumb = thumbRef.value
  const fill = fillRef.value
  // `glass` is how far the knob reads as a lens. It follows the lift up,
  // but on the way down it only falls: the lift spring bounces past rest
  // to wobble the knob's size, and letting the lens look ride that bounce
  // flashed it back on before it snapped off.
  const v = { x: checked.value ? 1 : 0, lift: 0, glass: 0, stretch: 0 }

  const paint = () => {
    const s = REST + (1 - REST) * v.lift
    const sx = s * (1 + v.stretch)
    const sy = s * (1 - v.stretch * 0.5)
    thumb.style.transform = `translate(${v.x * TRAVEL}px, -50%) scale(${sx}, ${sy})`
    const l = clamp(v.glass, 0, 1)
    // Open a gap in the real track under the lifted lens; the lens shows
    // the track shrunk inside it, so drawing it here too would double it.
    el.style.setProperty('--lg-knob-x', `${(21 + v.x * TRAVEL).toFixed(2)}px`)
    el.style.setProperty('--lg-hole', `${(l > 0.01 ? 23 * sx : 0).toFixed(2)}px`)
    el.style.setProperty('--lg-lift', String(l))
    el.toggleAttribute('data-lifted', l > 0.01)
  }
  // The knob stretches with its speed and jiggles round when it stops.
  const jelly = createJelly((value) => {
    v.stretch = value
    paint()
  }, 0.14, 5)
  const position = createSpring(v.x, SPRINGS.snap, (value, velocity) => {
    v.x = value
    jelly.feed(velocity)
    paint()
  })
  const lift = createSpring(0, SPRINGS.lift, (value) => {
    v.lift = value
    v.glass = lift.target ? value : Math.min(v.glass, value)
    paint()
  })
  const color = createSpring(checked.value ? 1 : 0, SPRINGS.fade, (value) => {
    fill.style.opacity = String(clamp(value, 0, 1))
  })
  fill.style.opacity = checked.value ? '1' : '0'
  paint()

  syncFn = (value) => {
    position.tune(SPRINGS.snap)
    position.set(value ? 1 : 0)
    color.set(value ? 1 : 0)
  }

  // The knob has to travel most of the way before the switch flips, so a
  // drag that wanders past the middle doesn't toggle it by accident.
  const flips = (from, raw) => (from ? raw > 0.3 : raw > 0.7)

  let gesture = null
  let dropTimer = 0
  let ignoreClick = false

  const drop = (delay) => {
    clearTimeout(dropTimer)
    dropTimer = window.setTimeout(() => {
      lift.tune(SETTLE)
      lift.set(0)
    }, delay)
  }

  const down = (event) => {
    el.removeAttribute('data-keyboard')
    if (!event.isPrimary || event.button !== 0 || props.disabled) return
    clearTimeout(dropTimer)
    gesture = { id: event.pointerId, x: event.clientX, from: checked.value ? 1 : 0, moved: false, at: performance.now() }
    try {
      el.setPointerCapture(event.pointerId)
    } catch {
      /* noop */
    }
    lift.tune(SPRINGS.lift)
    lift.set(1)
    haptic()
  }
  const move = (event) => {
    if (event.pointerId !== gesture?.id) return
    const dx = event.clientX - gesture.x
    if (!gesture.moved && Math.abs(dx) < 3) return
    gesture.moved = true
    const raw = gesture.from + dx / TRAVEL
    const over = raw < 0 ? rubberband(raw * TRAVEL, TRAVEL, 0.6) / TRAVEL : raw > 1 ? 1 + rubberband((raw - 1) * TRAVEL, TRAVEL, 0.6) / TRAVEL : raw
    position.tune(SPRINGS.drag)
    position.set(over)
    const on = flips(gesture.from, raw)
    if ((color.target === 1) !== on) haptic()
    color.set(on ? 1 : 0)
  }
  const up = (event) => {
    if (event.pointerId !== gesture?.id) return
    const { from, x, moved, at } = gesture
    gesture = null
    ignoreClick = true
    const next = moved ? flips(from, from + (event.clientX - x) / TRAVEL) : !checked.value
    position.tune(SPRINGS.snap)
    position.set(next ? 1 : 0)
    color.set(next ? 1 : 0)
    if (next !== checked.value) setChecked(next)
    // A quick tap keeps the lens up long enough to be seen crossing.
    drop(moved ? 0 : Math.max(0, 200 - (performance.now() - at)))
  }
  const cancel = (event) => {
    if (event.pointerId !== gesture?.id) return
    gesture = null
    syncFn?.(checked.value)
    drop(0)
  }
  const click = (event) => {
    if (ignoreClick) {
      ignoreClick = false
      return
    }
    if (props.disabled) return
    // Keyboard / assistive activation
    event.preventDefault()
    const next = !checked.value
    lift.set(1)
    drop(220)
    setChecked(next)
    syncFn?.(next)
  }

  const unguard = guardSelection(el)
  el.addEventListener('pointerdown', down)
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerup', up)
  el.addEventListener('pointercancel', cancel)
  el.addEventListener('click', click)

  teardown = () => {
    clearTimeout(dropTimer)
    ;[position, lift, color, jelly].forEach((s) => s.stop())
    unguard()
    el.removeEventListener('pointerdown', down)
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerup', up)
    el.removeEventListener('pointercancel', cancel)
    el.removeEventListener('click', click)
  }

  // The original's second effect also runs once after mount.
  syncFn?.(checked.value)
})

onUnmounted(() => {
  teardown?.()
})

watch(checked, (value) => {
  syncFn?.(value)
})

function onKeyDown(event) {
  event.currentTarget.setAttribute('data-keyboard', '')
  // The caller's own @keydown (a fallthrough listener on the root
  // button) fires as well, as the React original's rest.onKeyDown did.
}
</script>
