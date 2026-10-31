// Vue port of useGlassEffect from @zakisheriff/liquid-glass v0.3.13
// (MIT, Zaki Sheriff — https://github.com/zakisheriff/Liquid-Glass).
// Same options and result shape as the React hook: { style, filterId }.
// Where React memoized with useMemo, the values here are Vue computed refs —
// bind them in a template with :style="style" (setup refs unwrap there), or
// read style.value / filterId.value from script. `options` may be a plain
// object, a reactive object, or a getter returning one, so prop-driven
// callers stay live.
import { computed } from 'vue'

function parseTintColor(tint) {
  // Default values
  const defaults = { h: 0, s: 0, l: 100, a: 0.1 }

  if (!tint) return defaults

  // Handle rgba
  const rgbaMatch = tint.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/)
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]) / 255
    const g = parseInt(rgbaMatch[2]) / 255
    const b = parseInt(rgbaMatch[3]) / 255
    const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const l = (max + min) / 2

    if (max === min) return { h: 0, s: 0, l: l * 100, a }

    const d = max - min
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    let h = 0
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6

    return { h: h * 360, s: s * 100, l: l * 100, a }
  }

  // Handle hex
  const hexMatch = tint.match(/^#([\da-f]{3,8})$/i)
  if (hexMatch) {
    let hex = hexMatch[1]
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
    const r = parseInt(hex.slice(0, 2), 16) / 255
    const g = parseInt(hex.slice(2, 4), 16) / 255
    const b = parseInt(hex.slice(4, 6), 16) / 255
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const l = (max + min) / 2

    if (max === min) return { h: 0, s: 0, l: l * 100, a }

    const d = max - min
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    let h = 0
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6

    return { h: h * 360, s: s * 100, l: l * 100, a }
  }

  return defaults
}

export function useGlassEffect(options = {}) {
  const result = computed(() => {
    const {
      intensity = 5,
      tint,
      shimmer = true,
      thickness,
      blur,
    } = typeof options === 'function' ? options() : options

    const clampedIntensity = Math.max(1, Math.min(10, Math.round(intensity)))
    const filterId = `liquid-glass-refract-${clampedIntensity}`

    const style = {
      '--glass-intensity': clampedIntensity,
      '--glass-shimmer': shimmer ? 1 : 0,
    }

    if (tint) {
      const parsed = parseTintColor(tint)
      style['--glass-tint-h'] = parsed.h
      style['--glass-tint-s'] = `${parsed.s}%`
      style['--glass-tint-l'] = `${parsed.l}%`
      style['--glass-tint-a'] = parsed.a
    }

    if (thickness !== undefined) {
      style['--glass-border-width'] = `${thickness}px`
    }

    if (blur !== undefined) {
      style['--glass-blur'] = `${blur}px`
    }

    return { style, filterId }
  })

  const style = computed(() => result.value.style)
  const filterId = computed(() => result.value.filterId)

  return { style, filterId }
}
