<!--
  Vue port of GlassSlider from @zakisheriff/liquid-glass v0.3.13 (MIT,
  Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass).
  Direct translation, bit-for-bit in DOM, classes, props and behaviour:
  React state/effects become refs/watchers, the forwarded ref to the native
  range input is the template ref below, and `onChange(value)` becomes the
  `change` emit carrying the same full-precision number, fired while
  dragging exactly as the original fires it.
  The component's own stylesheet is NOT copied: the package's styles.css
  (imported once at the app root) carries every .lg-slider rule.
-->
<template>
  <!-- Block mode: Control Center block (showThumb = false) -->
  <div
    v-if="!showThumb"
    ref="rootRef"
    :class="['lg-slider', 'lg-slider--block', attrs.class]"
    data-liquid-glass=""
    :style="[vars, attrs.style]"
  >
    <div ref="blockRef" class="lg-glass lg-slider__block">
      <span class="lg-slider__block-content" aria-hidden="true">
        <span v-if="$slots.icon" class="lg-slider__icon"><slot name="icon" /></span>
        <span v-if="label" class="lg-slider__label">{{ label }}</span>
        <span class="lg-slider__value">{{ Math.round(Number(value)) }}</span>
      </span>
      <!-- The lit part, with its own dark glyphs so they read on white. -->
      <span class="lg-slider__block-fill" aria-hidden="true">
        <span class="lg-slider__block-content lg-slider__block-content--lit">
          <span v-if="$slots.icon" class="lg-slider__icon"><slot name="icon" /></span>
          <span v-if="label" class="lg-slider__label">{{ label }}</span>
          <span class="lg-slider__value">{{ Math.round(Number(value)) }}</span>
        </span>
      </span>
    </div>
    <input
      ref="inputRef"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="value"
      :disabled="disabled"
      :aria-label="attrs['aria-label'] ?? label"
      class="lg-slider__input"
      v-bind="inputAttrs"
      @input="onNativeInput"
      @keydown="rootRef?.setAttribute('data-keyboard', '')"
      @pointerdown="rootRef?.removeAttribute('data-keyboard')"
    />
  </div>

  <!-- Thin slider: iOS track with a glass thumb that lifts into a lens -->
  <div
    v-else
    ref="rootRef"
    :class="['lg-slider', attrs.class]"
    data-liquid-glass=""
    :data-mirror="mirrored ? '' : undefined"
    :style="[vars, attrs.style]"
  >
    <span class="lg-slider__rail" aria-hidden="true">
      <span class="lg-slider__fill" />
    </span>
    <span class="lg-slider__thumb-slot" aria-hidden="true">
      <span ref="thumbRef" class="lg-glass lg-slider__thumb" data-lg-mirror-bare="">
        <span ref="faceRef" class="lg-slider__face" />
      </span>
    </span>
    <input
      ref="inputRef"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="value"
      :disabled="disabled"
      :aria-label="attrs['aria-label'] ?? label"
      class="lg-slider__input"
      v-bind="inputAttrs"
      @input="onNativeInput"
      @keydown="rootRef?.setAttribute('data-keyboard', '')"
      @pointerdown="rootRef?.removeAttribute('data-keyboard')"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, useAttrs, watch } from 'vue'
import { SPRINGS, clamp, createSpring, rubberband } from '../engine/spring.js'
import { canRefractBackdrop, useRefraction } from '../engine/refraction.js'
import { haptic } from '../engine/haptics.js'
import { guardSelection } from '../engine/selection.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  value: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  /** Continuous dragging by default (`"any"`). Set a numeric step to snap. */
  step: { type: [Number, String], default: 'any' },
  /** Refraction strength from 1 (subtle) to 10 (heavy). Default 5. */
  intensity: { type: Number, default: 5 },
  /** Fill colour. Defaults to the accent blue (white in block mode). */
  tint: { type: String, default: undefined },
  /** Kept for API compatibility. */
  shimmer: { type: Boolean, default: undefined },
  /** Kept for API compatibility. */
  thickness: { type: Number, default: undefined },
  /**
   * `true` (default): thin iOS track with a glass thumb that lifts into a lens.
   * `false`: Control Center block that fills and stretches under the finger.
   */
  showThumb: { type: Boolean, default: true },
  /** Label shown inside the block slider (the icon is the #icon slot). */
  label: { type: String, default: undefined },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['change'])

const attrs = useAttrs()
// React spreads `...rest` onto the native <input>; class/style were
// destructured out of it and applied to the root instead, so they are
// stripped here and bound to the root explicitly.
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const rootRef = ref(null)
const inputRef = ref(null)
const thumbRef = ref(null)
const faceRef = ref(null)
const blockRef = ref(null)
/** How far (px) the finger has dragged past either end; drives overscroll. */
const pastRef = ref(0)

// The original's onChange rides the native input event: the drag logic
// below sets the value through the native setter and dispatches a real
// `input` event, and this handler (like React's synthetic onChange)
// turns it into the value-carrying callback — consumers' own input
// listeners on the element keep working too.
const onNativeInput = (event) => {
  emit('change', Number(event.currentTarget.value))
}

// Runs an effect body on mount and whenever its dependencies change,
// React useEffect style: previous cleanup first, cleanup again on unmount.
const effectWithDeps = (setup, deps) => {
  let cleanup = null
  const run = () => {
    cleanup = setup() || null
  }
  onMounted(run)
  watch(deps, () => {
    cleanup?.()
    run()
  }, { flush: 'post' })
  onUnmounted(() => cleanup?.())
}

// Sliding is relative, like iOS: touching the track never jumps the value,
// only moving the finger changes it. A numeric step remains an explicit
// opt-in, and the native range still owns keyboard/accessibility.
effectWithDeps(() => {
  const min = props.min
  const max = props.max
  const step = props.step
  const showThumb = props.showThumb
  const input = inputRef.value
  const root = rootRef.value
  if (!input || !root) return undefined
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  let drag = null
  const update = (clientX) => {
    if (!drag || max <= min) return
    const raw = drag.from + (clientX - drag.x) / drag.travel
    const fraction = clamp(raw, 0, 1)
    pastRef.value = (raw - fraction) * drag.travel
    let next = min + fraction * (max - min)
    const increment = Number(step)
    if (step !== 'any' && Number.isFinite(increment) && increment > 0) {
      next = clamp(min + Math.round((next - min) / increment) * increment, min, max)
      next = Number(next.toFixed(10))
    }
    root.style.setProperty('--lg-progress', String((next - min) / (max - min)))
    if (next === input.valueAsNumber) return
    // Use the native setter so the component receives a real input update
    // exactly once; consumers' onInput handlers keep working too.
    setValue.call(input, String(next))
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }
  const down = (event) => {
    if (input.disabled || !event.isPrimary || event.button !== 0 || drag) return
    event.preventDefault()
    delete root.dataset.keyboard
    // Focusing the hidden native range during a touch can immediately
    // blur it on iOS. Pointer capture, not input focus, owns the gesture.
    if (event.pointerType !== 'touch') input.focus({ preventScroll: true })
    const box = root.getBoundingClientRect()
    const inset = showThumb ? 19 * box.width / root.offsetWidth : 0
    const from = max > min ? clamp((input.valueAsNumber - min) / (max - min), 0, 1) : 0
    drag = { id: event.pointerId, x: event.clientX, from, travel: Math.max(1, box.width - inset * 2) }
    pastRef.value = 0
    root.dataset.dragging = ''
    root.setPointerCapture(event.pointerId)
  }
  const move = (event) => {
    if (event.pointerId !== drag?.id) return
    event.preventDefault()
    update(event.clientX)
  }
  const release = () => {
    if (!drag) return
    const id = drag.id
    drag = null
    pastRef.value = 0
    delete root.dataset.dragging
    if (root.hasPointerCapture(id)) root.releasePointerCapture(id)
  }
  const up = (event) => {
    if (event.pointerId !== drag?.id) return
    update(event.clientX)
    release()
  }
  // Hit-test the custom surface, not WebKit's native range control.
  // On iOS the native thumb can cancel pointer events as it takes over
  // the drag, dropping the glass lift while values continue changing.
  const unguard = guardSelection(root)
  root.addEventListener('pointerdown', down)
  root.addEventListener('pointermove', move)
  root.addEventListener('pointerup', up)
  root.addEventListener('pointercancel', release)
  root.addEventListener('lostpointercapture', release)
  window.addEventListener('blur', release)
  return () => {
    release()
    unguard()
    root.removeEventListener('pointerdown', down)
    root.removeEventListener('pointermove', move)
    root.removeEventListener('pointerup', up)
    root.removeEventListener('pointercancel', release)
    root.removeEventListener('lostpointercapture', release)
    window.removeEventListener('blur', release)
  }
}, () => [props.min, props.max, props.step, props.showThumb])

const strength = computed(() => Math.max(1, Math.min(10, props.intensity)) / 5)
// Safari/Firefox draw the magnified rail as a copy inside the thumb.
const mirrored = ref(false)
onMounted(() => {
  mirrored.value = !canRefractBackdrop()
})
const progress = computed(() =>
  props.max > props.min ? clamp((Number(props.value) - props.min) / (props.max - props.min), 0, 1) : 0
)

// iOS magnifies the rail ~2× inside the lifted thumb.
// Only the band around the rail bends; above and below it the lens stays
// clear, so its rim doesn't drag a sliver of the fill to the top edge.
// (The thumb element only exists in thin mode, and the block only in block
// mode, so each refraction follows its element's presence — the original
// passes the same conditions as the hooks' `enabled` argument.)
useRefraction(thumbRef, () => ({
  kind: 'lens', zoom: 1.95, bezel: 7, thickness: 16, strength: strength.value, dispersion: 0.6, inset: 11
}), true, rootRef, () =>
  parseFloat(rootRef.value?.style.getPropertyValue('--lg-lift') || '0') > 0.01
)
useRefraction(blockRef, () => ({ kind: 'surface', strength: strength.value }), true)

// Thumb lift (thin slider)
effectWithDeps(() => {
  if (!props.showThumb) return undefined
  const input = inputRef.value
  const thumb = thumbRef.value
  const face = faceRef.value
  const root = rootRef.value
  if (!input || !thumb || !face || !root) return undefined
  const v = { lift: 0, stretch: 0, over: 0 }
  const paint = () => {
    const s = 0.655 + 0.345 * v.lift
    // Pulled past an end, the lens slides a little further and stretches
    // toward the finger, then springs back on release.
    const pull = (Math.abs(v.over) / 58) * 0.6
    thumb.style.scale = `${s * (1 + v.stretch + pull)} ${s * (1 - v.stretch * 0.5 - pull * 0.4)}`
    face.style.opacity = String(1 - clamp(v.lift, 0, 1) * 0.92)
    root.style.setProperty('--lg-lift', String(clamp(v.lift, 0, 1)))
    root.style.setProperty('--lg-over', `${v.over.toFixed(2)}px`)
    if (v.lift < 0.01 && lift.target === 0) delete root.dataset.lifted
  }
  const lift = createSpring(0, SPRINGS.lift, (x) => {
    v.lift = x
    paint()
  })
  const stretch = createSpring(0, SPRINGS.release, (x) => {
    v.stretch = x
    paint()
  })
  const over = createSpring(0, SPRINGS.release, (x) => {
    v.over = x
    paint()
  })
  paint()
  let lastX = 0
  let lastT = 0
  const down = (event) => {
    if (input.disabled || !event.isPrimary || event.button !== 0) return
    lastX = event.clientX
    lastT = event.timeStamp
    root.dataset.lifted = ''
    lift.tune(SPRINGS.lift)
    lift.set(1)
    haptic()
  }
  const move = (event) => {
    if (lift.target !== 1) return
    const dt = Math.max(1, event.timeStamp - lastT)
    const speed = Math.abs(event.clientX - lastX) / dt
    lastX = event.clientX
    lastT = event.timeStamp
    stretch.tune(SPRINGS.drag)
    stretch.set(clamp(speed * 0.015, 0, 0.035))
    over.tune(SPRINGS.drag)
    over.set(rubberband(pastRef.value, 12, 0.5))
  }
  const up = () => {
    if (lift.target === 0) return
    lift.tune(SPRINGS.settle)
    lift.set(0)
    stretch.tune(SPRINGS.release)
    stretch.set(0)
    over.tune(SPRINGS.release)
    over.set(0)
  }
  root.addEventListener('pointerdown', down)
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)
  root.addEventListener('lostpointercapture', up)
  window.addEventListener('blur', up)
  return () => {
    lift.stop()
    stretch.stop()
    over.stop()
    root.removeEventListener('pointerdown', down)
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
    root.removeEventListener('lostpointercapture', up)
    window.removeEventListener('blur', up)
    delete root.dataset.lifted
  }
}, () => [props.showThumb])

// Block stretch (Control Center style): swells on touch, rubber-bands past the ends.
effectWithDeps(() => {
  if (props.showThumb) return undefined
  const input = inputRef.value
  const block = blockRef.value
  const root = rootRef.value
  if (!input || !block || !root) return undefined
  const v = { swell: 0, over: 0 }
  const paint = () => {
    const w = block.offsetWidth || 1
    const grow = 1 + (10 / Math.max(w, 1)) * v.swell
    const stretchX = 1 + Math.abs(v.over) / w
    block.style.scale = `${grow * stretchX} ${grow * (1 - Math.abs(v.over) / w / 2)}`
    block.style.translate = `${v.over / 2}px 0`
  }
  const swell = createSpring(0, SPRINGS.press, (x) => {
    v.swell = x
    paint()
  })
  const over = createSpring(0, SPRINGS.release, (x) => {
    v.over = x
    paint()
  })
  let active = null
  const down = (event) => {
    if (input.disabled || !event.isPrimary || event.button !== 0) return
    active = { id: event.pointerId }
    swell.tune(SPRINGS.press)
    swell.set(1)
    haptic()
  }
  const move = (event) => {
    if (event.pointerId !== active?.id) return
    over.tune(SPRINGS.drag)
    // A short, firm overscroll: the block only gives a few px past its end.
    over.set(rubberband(pastRef.value, 26, 0.6))
  }
  const reset = () => {
    if (!active) return
    active = null
    swell.tune(SPRINGS.release)
    swell.set(0)
    over.tune(SPRINGS.release)
    over.set(0)
  }
  const up = (event) => {
    if (event.pointerId === active?.id) reset()
  }
  root.addEventListener('pointerdown', down)
  root.addEventListener('lostpointercapture', reset)
  window.addEventListener('blur', reset)
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)
  return () => {
    swell.stop()
    over.stop()
    root.removeEventListener('pointerdown', down)
    root.removeEventListener('lostpointercapture', reset)
    window.removeEventListener('blur', reset)
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
  }
}, () => [props.showThumb])

const vars = computed(() => ({
  '--lg-progress': progress.value,
  ...(props.tint ? { '--lg-slider-fill': props.tint } : {})
}))
</script>
