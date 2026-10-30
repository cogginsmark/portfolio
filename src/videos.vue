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

          <div class="video-grid">
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
                  autoplay
                  loop
                  muted
                  playsinline
                  preload="auto"
                  @click="toggleSound"
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
              <p class="video-links">
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
import { onMounted, ref } from 'vue'
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
// throughout. Reduced-motion visitors get a paused player they
// can start themselves.
const { author, intro, sections, footer } = baseData

const root = ref(null)
useReveal(root)

const nativeVideo = ref(null)
const soundOn = ref(false)

function playerEl() {
  const v = nativeVideo.value
  return Array.isArray(v) ? v[0] : v
}

function toggleSound() {
  const v = playerEl()
  if (!v) return
  v.muted = !v.muted
  soundOn.value = !v.muted
  if (!v.muted) v.play().catch(() => {})
}

onMounted(() => {
  const v = playerEl()
  if (!v) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    v.removeAttribute('autoplay')
    v.pause()
    return
  }
  v.muted = true
  v.play().catch(() => {})
})
</script>

<style scoped>
/* Unit rules: rem for font sizes and spacing, em for letter
   tracking, px reserved for hairline borders. */
.videos-wrap {
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
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.video-role {
  font-weight: 700;
}

.video-date {
  opacity: 0.65;
}

.video-note {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  line-height: var(--leading-text);
  opacity: 0.8;
}

.video-links {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .video-thumb img,
  .video-play i,
  .video-sound {
    transition: none;
  }
}
</style>
