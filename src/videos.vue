<template>
  <div id="videos" ref="root">
    <ThemeRoot>
      <div class="videos-wrap">
        <header class="videos-intro" data-reveal>
          <h1 class="videos-heading">{{ author }}</h1>
          <p class="videos-lede">{{ intro }}</p>
        </header>

        <section
          class="videos-section"
          data-reveal
          v-for="section in sections"
          :key="section.heading"
          :aria-label="section.heading"
        >
          <h2 class="videos-section-title">{{ section.heading }}</h2>
          <p class="videos-section-note">{{ section.note }}</p>

          <article
            class="video-feature"
            v-for="entry in section.entries.filter((e) => e.feature)"
            :key="entry.videoId"
          >
            <div class="video-embed">
              <iframe
                :src="`https://www.youtube-nocookie.com/embed/${entry.videoId}`"
                :title="entry.title"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
            <h3 class="video-title">{{ entry.title }}</h3>
            <p class="video-meta">
              <span class="video-role">{{ entry.role }}</span>
              <span v-if="entry.date" class="video-date"> · {{ entry.date }}</span>
            </p>
            <p class="video-note">{{ entry.note }}</p>
            <p class="video-links">
              <a :href="entry.youtube" target="_blank" rel="noopener">Watch on YouTube</a>
              <template v-if="entry.article">
                · <a :href="entry.article" target="_blank" rel="noopener">Read the article</a>
              </template>
            </p>
          </article>

          <div
            class="video-grid"
            :class="{
              'video-grid--single':
                section.entries.filter((e) => !e.feature).length === 1
            }"
          >
            <article
              class="video-card"
              v-for="entry in section.entries.filter((e) => !e.feature)"
              :key="entry.videoId || entry.title"
            >
              <div v-if="entry.src" class="video-player">
                <video
                  ref="nativeVideo"
                  class="video-native"
                  :src="entry.src"
                  :poster="entry.thumb"
                  :title="entry.title"
                  loop
                  muted
                  playsinline
                  preload="none"
                  @click="toggleSound"
                  @timeupdate="onTimeUpdate"
                ></video>
                <button
                  type="button"
                  class="video-sound"
                  :aria-pressed="soundOn"
                  @click="toggleSound"
                >
                  <i
                    :class="soundOn ? 'fas fa-volume-up' : 'fas fa-volume-off'"
                    aria-hidden="true"
                  ></i>
                  {{ soundOn ? 'Sound on' : 'Tap for sound' }}
                </button>
              </div>
              <a v-else class="video-thumb" :href="entry.youtube || entry.instagram" target="_blank" rel="noopener" :aria-label="`Watch: ${entry.title}`">
                <img
                  :src="entry.thumb || `https://i.ytimg.com/vi/${entry.videoId}/hqdefault.jpg`"
                  :alt="entry.title"
                  loading="lazy"
                />
                <span class="video-play" aria-hidden="true"><i class="fas fa-play"></i></span>
              </a>
              <h3 class="video-title">{{ entry.title }}</h3>
              <p class="video-meta">
                <span class="video-role">{{ entry.role }}</span>
                <span v-if="entry.date" class="video-date"> · {{ entry.date }}</span>
              </p>
              <p class="video-note">{{ entry.note }}</p>
              <p v-if="entry.src && entry.instagram" class="video-cta-row">
                <a class="video-cta" :href="entry.instagram" target="_blank" rel="noopener">View on Instagram<i class="fas fa-play" aria-hidden="true"></i></a>
              </p>
              <p v-else class="video-links">
                <a v-if="entry.youtube" :href="entry.youtube" target="_blank" rel="noopener">Watch on YouTube</a>
                <a v-else-if="entry.instagram" :href="entry.instagram" target="_blank" rel="noopener">View on Instagram</a>
                <template v-if="entry.article">
                  · <a :href="entry.article" target="_blank" rel="noopener">Read the article</a>
                </template>
              </p>
            </article>
          </div>
        </section>
      </div>
      <foot v-bind:author="author" v-bind:footer="footer" />
    </ThemeRoot>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Foot from './components/Foot.vue'
import ThemeRoot from './components/ThemeRoot.vue'
import { useReveal } from './composables/useReveal.js'

import baseData from './data/4fixtures.ts'

// The Videos page (Mark's direction after the Flory interview,
// 2026-10-29): one shareable link for the video work Danny Thomas
// asked about. Hybrid presentation, his pick: the first piece is an
// embedded player, everything else is a thumbnail card linking out —
// the same card the Instagram pieces will use when the ASI section
// lands, since IG embeds are unreliable.
//
// Self-hosted entries (a `src` field in the data) play directly on
// the page instead: Mark's direction for the Early Bird reel
// (2026-10-30) is on-page, unmuted, looping. Browsers refuse
// autoplay with sound, so the player starts muted and the first
// tap — on the video or its sound pill — unmutes it; it loops
// throughout. The player is lazy (also his call): nothing of the
// video file loads with the page — playback starts when the
// player nears the viewport, so the page itself loads fast and
// only the poster frame shows until then. Reduced-motion
// visitors get an unloaded player they can start with a tap.
// When sound is on, it fades back to mute into the loop point
// (see onTimeUpdate below).
const { author, intro, sections, footer } = baseData

const root = ref(null)
useReveal(root)

const nativeVideo = ref(null)
const soundOn = ref(false)
let playerObserver = null

function playerEl() {
  const v = nativeVideo.value
  return Array.isArray(v) ? v[0] : v
}

function toggleSound() {
  const v = playerEl()
  if (!v) return
  v.muted = !v.muted
  soundOn.value = !v.muted
  if (!v.muted) {
    v.volume = 1
    v.play().catch(() => {})
  }
}

// Mark's fade (2026-10-30): once a visitor has tapped for sound,
// the audio doesn't run into the loop point at full volume — it
// fades out over the last stretch of the 30-second piece and the
// player lands back on mute as the loop restarts, with the
// Tap for sound pill back in place. FADE_SECONDS is that stretch.
const FADE_SECONDS = 2.5
let lastTime = 0

function onTimeUpdate() {
  const v = playerEl()
  if (!v || !soundOn.value || !Number.isFinite(v.duration)) return
  const remaining = v.duration - v.currentTime
  if (v.currentTime < lastTime - 1) {
    // The loop just wrapped: settle back into mute at full volume
    // under the mute, ready for the next tap.
    v.muted = true
    v.volume = 1
    soundOn.value = false
  } else if (remaining <= FADE_SECONDS) {
    v.volume = Math.max(remaining / FADE_SECONDS, 0)
  } else if (v.volume !== 1) {
    v.volume = 1
  }
  lastTime = v.currentTime
}

onMounted(() => {
  const v = playerEl()
  if (!v) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }
  v.muted = true
  if (!('IntersectionObserver' in window)) {
    v.play().catch(() => {})
    return
  }
  playerObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          v.play().catch(() => {})
          playerObserver.disconnect()
          playerObserver = null
        }
      }
    },
    { rootMargin: '200px' }
  )
  playerObserver.observe(v)
})

onUnmounted(() => {
  if (playerObserver) {
    playerObserver.disconnect()
    playerObserver = null
  }
})
</script>

<style scoped>
/* Unit rules: rem for font sizes and spacing, em for letter
   tracking, px reserved for hairline borders. */
.videos-wrap {
  /* Widened to 1180 and reverted the same day on Mark's word
     (2026-10-30): the page keeps its 980 measure; the byline fix
     (unbreakable date, smaller size) carries the desktop layout. */
  max-width: 980px;
  margin: 0 auto;
  padding: 3rem 1.25rem 1rem;
}

.videos-intro {
  margin-bottom: 3rem;
}

.videos-heading {
  font-size: clamp(2.2rem, 6vw, 3.2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem;
}

.videos-lede {
  margin: 0;
  font-size: 1.05rem;
  line-height: var(--leading-text);
  opacity: 0.75;
  max-width: 38rem;
}

.videos-section {
  margin-bottom: 3rem;
}

.videos-section-title {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 0.35rem;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid color-mix(in srgb, var(--main-color) 14%, transparent);
}

.videos-section-note {
  margin: 0 0 1.5rem;
  font-size: 0.95rem;
  opacity: 0.7;
}

.video-feature {
  margin-bottom: 2.5rem;
}

.video-embed {
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  background: #000;
}

.video-embed iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 2rem 1.5rem;
}

/* Cards are columns so the links row can pin to the foot (below):
   notes vary in length, links should not. */
.video-card {
  display: flex;
  flex-direction: column;
}

/* A section with a single card centres it (Mark's call for Client
   Work while it holds one piece, 2026-10-30); the moment a second
   entry joins the section, the normal grid flow takes over again. */
.video-grid--single {
  grid-template-columns: 1fr;
  justify-items: center;
}

.video-grid--single .video-card {
  max-width: 340px;
}

.video-grid--single .video-player {
  margin-inline: auto;
}

.video-player {
  position: relative;
  max-width: 340px;
  margin-bottom: 0.85rem;
}

.video-native {
  display: block;
  width: 100%;
  aspect-ratio: 9 / 16;
  border-radius: 12px;
  background: #000;
  object-fit: cover;
  cursor: pointer;
}

.video-sound {
  position: absolute;
  right: 0.6rem;
  bottom: 0.6rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.8rem;
  border: 0;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.55);
  color: #fff;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s ease;
}

.video-sound:hover {
  background: rgb(0 0 0 / 0.78);
}

.video-thumb {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0.85rem;
}

.video-thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.video-thumb:hover img {
  transform: scale(1.03);
}

.video-play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1rem;
}

.video-play i {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: rgb(0 0 0 / 0.55);
  padding-left: 0.2rem;
  box-sizing: border-box;
  transition: background 0.25s ease;
}

.video-thumb:hover .video-play i {
  background: rgb(0 0 0 / 0.75);
}

.video-title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: var(--leading-title);
  letter-spacing: -0.01em;
  margin: 0 0 0.3rem;
}

.video-meta {
  margin: 0 0 0.45rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.video-role {
  font-weight: 700;
}

.video-date {
  opacity: 0.65;
  /* A date wraps as one piece or not at all (2026-10-30): no more
     DECEMBER / 9, 2022 split across lines by the wide tracking. */
  white-space: nowrap;
}

.video-note {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  line-height: var(--leading-text);
  opacity: 0.8;
}

.video-links {
  /* Pinned to the card's foot: cards in a row share one link
     baseline regardless of how long their notes run. */
  margin: 0;
  margin-top: auto;
  font-size: 0.9rem;
  font-weight: 600;
}

/* A self-hosted entry's preview is the player itself, not a link —
   so its way out to the original post is a real CTA button rather
   than a text link (Mark's call, 2026-10-30). Card entries whose
   thumbnails link out keep the plain text links: the preview image
   is the button there. */
.video-cta-row {
  margin: 0;
  margin-top: auto;
}

.video-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.1rem;
  border: 1px solid color-mix(in srgb, var(--main-color) 25%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--main-color) 10%, transparent);
  color: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.25s ease;
}

.video-cta:hover {
  background: color-mix(in srgb, var(--main-color) 18%, transparent);
}

.video-cta i {
  font-size: 0.8em;
}

@media (prefers-reduced-motion: reduce) {
  .video-thumb img,
  .video-play i,
  .video-sound,
  .video-cta {
    transition: none;
  }
}
</style>
