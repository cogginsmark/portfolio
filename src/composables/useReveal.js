import { onMounted, onBeforeUnmount } from 'vue'

// Reveal-on-scroll for page sections: elements carrying [data-reveal]
// start offset and transparent, and ease in the first time they enter
// the viewport. Falls back to fully visible when IntersectionObserver
// is unavailable, and honours prefers-reduced-motion by showing
// everything immediately. Used by the About page sections.
export function useReveal(rootRef) {
  let observer = null

  onMounted(() => {
    const root = rootRef.value
    if (!root) {
      return
    }
    const targets = root.querySelectorAll('[data-reveal]')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'))
      return
    }
    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    targets.forEach(el => observer.observe(el))
  })

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
    }
  })
}
