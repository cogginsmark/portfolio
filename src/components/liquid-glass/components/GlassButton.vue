<!--
  Vue port of GlassButton from @zakisheriff/liquid-glass v0.3.13 (MIT,
  Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass).
  Direct translation: same DOM, classes, prop names and defaults as the
  React original; only the framework mechanics change (children → default
  slot, the ReactNode `icon` prop → the #icon slot, forwarded ref →
  template ref, hooks → composables).
  The per-component stylesheet (GlassButton.css) is NOT copied: the
  package's styles.css, imported once at the app root, covers it.
-->
<template>
  <button
    ref="rootRef"
    :type="type"
    :class="classes"
    data-liquid-glass=""
    :data-icon-only="iconOnly ? '' : undefined"
    :data-shimmer="shimmer ? '' : undefined"
    :data-destructive="red ? '' : undefined"
    :disabled="disabled"
    :style="tint ? { '--lg-tint': tint } : undefined"
    @pointerdown="onPointerDown"
  >
    <span v-if="hasIcon" class="lg-button__icon"><slot name="icon" /></span>
    <span v-if="!iconOnly && hasChildren" class="lg-button__label"><slot /></span>
  </button>
</template>

<script setup>
import { Comment, Fragment, Text, computed, ref, useSlots } from 'vue'
import { usePress } from '../engine/press.js'
import { useRefraction } from '../engine/refraction.js'
import { haptic } from '../engine/haptics.js'

const props = defineProps({
  /** Refraction strength from 1 (subtle) to 10 (heavy). Default 5. */
  intensity: { type: Number, default: 5 },
  /** Any CSS colour. Colours the label (`tinted`) or the fill (`filled`). Default accent blue. */
  tint: { type: String, default: undefined },
  /** Light bloom under the finger while pressed. Default true. */
  shimmer: { type: Boolean, default: true },
  /** Rim bevel scale (1–4). Wider bevels bend more of the backdrop. Default 1. */
  thickness: { type: Number, default: 1 },
  /** Height preset: 36 / 44 / 52 px. Default 'md'. */
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  /**
   * `glass` (alias `default`) regular glass · `clear` (alias `ghost`) see-through
   * glass · `tinted` glass with a coloured label · `tinted-filled` a soft wash
   * of the colour with a label in that colour · `filled` solid colour.
   * Combine with `tint` for any colour, or `destructive` for red.
   */
  variant: {
    type: String,
    default: 'glass',
    validator: (v) =>
      ['glass', 'default', 'clear', 'ghost', 'tinted', 'tinted-filled', 'filled', 'destructive'].includes(v),
  },
  /** Marks a delete / irreversible action: red label, or red fill with `filled`. */
  destructive: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
})

const slots = useSlots()
const rootRef = ref(null)

const level = computed(() => Math.max(1, Math.min(10, props.intensity)))
const height = computed(() => (props.size === 'sm' ? 36 : props.size === 'lg' ? 52 : 44))
usePress(rootRef, () => ({ disabled: props.disabled }))
useRefraction(rootRef, () => ({
  kind: 'surface',
  strength: level.value / 5,
  bezel: Math.min(height.value * 0.36, 22) * Math.max(0.5, props.thickness),
}))

// A slot counts as present only when it renders something other than
// whitespace/comments — the Vue reading of React's `icon != null` /
// `children == null || children === false` tests.
function slotHasContent(name) {
  const render = slots[name]
  if (typeof render !== 'function') return false
  const vnodes = render()
  if (!vnodes || !vnodes.length) return false
  const meaningful = (vnode) => {
    if (vnode.type === Comment) return false
    if (vnode.type === Text) return typeof vnode.children === 'string' && vnode.children.trim() !== ''
    if (vnode.type === Fragment) return Array.isArray(vnode.children) && vnode.children.some(meaningful)
    return true
  }
  return vnodes.some(meaningful)
}
const hasIcon = computed(() => slotHasContent('icon'))
const hasChildren = computed(() => slotHasContent('default'))
const iconOnly = computed(() => hasIcon.value && !hasChildren.value)
// `destructive` as a variant predates the flag; both mean a red tint.
const red = computed(() => props.destructive || props.variant === 'destructive')
const kind = computed(() =>
  props.variant === 'ghost' ? 'clear' : props.variant === 'default' || props.variant === 'destructive' ? 'glass' : props.variant,
)

const classes = computed(() => ['lg-glass', 'lg-button', `lg-button--${props.size}`, `lg-button--${kind.value}`].join(' '))

function onPointerDown() {
  if (!props.disabled) haptic()
  // The caller's own @pointerdown (a fallthrough listener on the root
  // button) fires after this handler, as in the React original.
}
</script>
