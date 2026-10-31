// Vue port of useGlassAnimation from @zakisheriff/liquid-glass v0.3.13
// (MIT, Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass).
// Same state fields and handler names as the React hook. The state fields
// are Vue refs (unwrap them in a template, read .value in script); the
// handlers are plain functions — bind them in a template with
// @pointerenter="handlers.onPointerEnter" and so on.
import { ref } from 'vue'

export function useGlassAnimation() {
  const isHovered = ref(false)
  const isPressed = ref(false)
  const isFocused = ref(false)

  const handlers = {
    onPointerEnter: () => {
      isHovered.value = true
    },
    onPointerLeave: () => {
      isHovered.value = false
      isPressed.value = false
    },
    onPointerDown: () => {
      isPressed.value = true
    },
    onPointerUp: () => {
      isPressed.value = false
    },
    onFocus: () => {
      isFocused.value = true
    },
    onBlur: () => {
      isFocused.value = false
    },
  }

  return { isHovered, isPressed, isFocused, handlers }
}
