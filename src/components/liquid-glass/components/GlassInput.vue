<!--
  Vue port of GlassInput from @zakisheriff/liquid-glass v0.3.13 (MIT,
  Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass).
  Direct translation: same DOM, classes, prop names and defaults as the
  React original (the ReactNode `icon`/`trailing` props → the #icon /
  #trailing slots; the forwarded ref reached the <input> — here the
  caller uses a template ref the same way).
  Change semantics are the original's: the React `onChange(event)` becomes
  the Vue `change` emit carrying the native input event (fired per
  keystroke, from the input's `input` event, exactly as React's onChange
  is). Additive: `update:modelValue` is also emitted with the string
  value, and a `modelValue` prop is accepted, so Vue callers can use
  plain v-model; `value` keeps the original's precedence.
  The React original spreads its remaining props onto the <input> while
  className/style land on the root <label>, so this port disables
  automatic attribute inheritance and routes the fallthrough attributes
  to the <input> explicitly, keeping class/style on the label.
  The per-component stylesheet (GlassInput.css) is NOT copied: the
  package's styles.css, imported once at the app root, covers it.
-->
<template>
  <label :class="['lg-input', attrs.class]" data-liquid-glass="" :style="labelStyle">
    <span v-if="label" class="lg-input__label">{{ label }}</span>
    <div ref="fieldRef" class="lg-glass lg-input__field" :data-focused="focused ? '' : undefined">
      <span v-if="hasIcon" class="lg-input__icon"><slot name="icon" /></span>
      <span v-else-if="type === 'search'" class="lg-input__icon"><Symbol :source="searchSymbol" :size="20" /></span>
      <input
        ref="inputRef"
        v-bind="inputAttrs"
        :type="type"
        :value="current"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onInput"
        @focus="focused = true"
        @blur="focused = false"
      />
      <button
        v-if="current && !disabled"
        type="button"
        class="lg-input__clear"
        aria-label="Clear"
        @pointerdown.prevent
        @click="clear"
      >
        <Symbol :source="clearSymbol" :size="20" />
      </button>
      <span v-else-if="hasTrailing" class="lg-input__icon lg-input__trailing"><slot name="trailing" /></span>
    </div>
  </label>
</template>

<script setup>
import { computed, getCurrentInstance, ref, useAttrs, useSlots } from 'vue'
import { usePress } from '../engine/press.js'
import { useRefraction } from '../engine/refraction.js'
import Symbol from './internal/Symbol.vue'
import { searchSymbol, clearSymbol } from './internal/inputSymbols.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Refraction strength from 1 (subtle) to 10 (heavy). Default 5. */
  intensity: { type: Number, default: 5 },
  /** Colour for the caret and focus glow. */
  tint: { type: String, default: undefined },
  placeholder: { type: String, default: undefined },
  value: { type: String, default: undefined },
  /** Additive Vue v-model value; `value` above takes precedence, as in the original's controlled API. */
  modelValue: { type: String, default: undefined },
  /** Small label above the field. */
  label: { type: String, default: undefined },
  type: { type: String, default: 'text' },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['change', 'clear', 'update:modelValue'])

const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()

const fieldRef = ref(null)
const inputRef = ref(null)
const focused = ref(false)
const inner = ref('')
const current = computed(() => props.value ?? props.modelValue ?? inner.value)

useRefraction(fieldRef, () => ({ kind: 'surface', strength: Math.max(1, Math.min(10, props.intensity)) / 5 }))
usePress(fieldRef, () => ({ grow: 0.03, lean: 3, stretch: 0.03, disabled: props.disabled }))

const hasIcon = computed(() => typeof slots.icon === 'function')
const hasTrailing = computed(() => typeof slots.trailing === 'function')

// class/style belong to the root label (the original's className/style);
// every other fallthrough attribute goes to the <input> (the original's
// ...rest spread), including the caller's focus/blur listeners, which Vue
// attaches to the input alongside the focused-state handlers above.
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const labelStyle = computed(() => [props.tint ? { '--lg-input-tint': props.tint } : null, attrs.style])

function onInput(event) {
  if (props.value === undefined && props.modelValue === undefined) inner.value = event.target.value
  emit('change', event)
  emit('update:modelValue', event.target.value)
}

function clear() {
  // The original calls onClear when one was given; with no `clear`
  // listener attached, it falls back to clearing through the native
  // value setter + a dispatched input event (which lands in onInput
  // above and emits the empty change, as React's did).
  if (typeof instance?.vnode?.props?.onClear === 'function') {
    emit('clear')
  } else {
    const input = inputRef.value
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
    setter?.call(input, '')
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }
  inputRef.value?.focus()
}
</script>
