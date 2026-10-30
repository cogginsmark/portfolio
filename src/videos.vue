<template>
  <div id="videos" ref="root">
    <ThemeRoot>
      <div class="videos-wrap">
        <header class="videos-intro" data-reveal>
          <h1 class="videos-heading">{{ author }}</h1>
          <p class="videos-lede">{{ intro }}</p>
        </header>

        <section
          class="timeline-group"
          data-reveal
          v-for="group in timeline"
          :key="group.label"
          :aria-label="group.label"
        >
          <h2 class="timeline-year">{{ group.label }}</h2>
          <div class="timeline-list">
            <article
              class="timeline-entry"
              v-for="item in group.entries"
              :key="item.entry.videoId || item.entry.title"
            >
              <p class="timeline-date">
                <template v-if="item.month">
                  <span class="timeline-month">{{ item.month }}</span>
                  <span class="timeline-day">{{ item.day }}</span>
                </template>
                <span v-else class="timeline-undated">Date not listed</span>
              </p>
              <div class="timeline-card">
                <div v-if="item.entry.src" class="video-player">
                  <video
                    ref="nativeVideo"
                    class="video-native"
                    :src="item.entry.src"
                    :poster="item.entry.thumb"
                    :title="item.entry.title"
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
                <div v-else-if="item.entry.feature" class="video-embed">
                  <iframe
                    :src="`https://www.youtube-nocookie.com/embed/${item.entry.videoId}`"
                    :title="item.entry.title"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                    referrerpolicy="strict-origin-when-cross-origin"
                  ></iframe>
                </div>
                <a v-else class="video-thumb" :href="item.entry.youtube || item.entry.instagram" target="_blank" rel="noopener" :aria-label="`Watch: ${item.entry.title}`">
                  <img
                    :src="item.entry.thumb || `https://i.ytimg.com/vi/${item.entry.videoId}/hqdefault.jpg`"
                    :alt="item.entry.title"
                    loading="lazy"
                  />
                  <span class="video-play" aria-hidden="true"><i class="fas fa-play"></i></span>
                </a>
                <p class="video-source">{{ item.section }}</p>
                <h3 class="video-title">{{ item.entry.title }}</h3>
                <p class="video-meta">
                  <span class="video-role">{{ item.entry.role }}</span>
                </p>
                <p class="video-note">{{ item.entry.note }}</p>
                <p v-if="item.entry.src && item.entry.instagram" class="video-cta-row">
                  <a class="video-cta" :href="item.entry.instagram" target="_blank" rel="noopener">View on Instagram<i class="fas fa-play" aria-hidden="true"></i></a>
                </p>
                <p v-else class="video-links">
                  <a v-if="item.entry.youtube" :href="item.entry.youtube" target="_blank" rel="noopener">Watch on YouTube</a>
                  <a v-else-if="item.entry.instagram" :href="item.entry.instagram" target="_blank" rel="noopener">View on Instagram</a>
                  <template v-if="item.entry.article">
                    <span v-if="item.entry.youtube || item.entry.instagram" aria-hidden="true"> · </span><a :href="item.entry.article" target="_blank" rel="noopener">Read the article</a>
                  </template>
                </p>
              </div>
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
// asked about. Presentation was his hybrid pick: the first piece
// is an embedded player, everything else is a thumbnail card
// linking out — the same card the Instagram pieces use, since IG
// embeds are unreliable.
//
// Since 2026-10-30 the page is organised as a timeline (also his
// call): every entry from every section runs in one reverse-
// chronological stream, grouped by year, with the date pulled
// out of the byline into its own rail. A date in a fixed column
// cannot wrap the way the tracked-out byline dates did, which
// settles the wrapping complaints; the outlet survives as each
// entry's source line, so the Signal / Bay Valley Tech / Client
// Work context is not lost. The featured Signal piece keeps its
// embedded player inside its timeline entry.
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

// Flatten the sections into the timeline: newest first, grouped
// by year. An entry without a date in the data is never given
// one — undated entries collect in their own group at the end.
const timeline = (() => {
  const flat = sections.flatMap((section) =>
    section.entries.map((entry) => {
      const time = Date.parse(entry.date || '')
      const parsed = Number.isNaN(time) ? null : new Date(time)
      return {
        entry,
        section: section.heading,
        time: parsed ? time : null,
        year: parsed ? String(parsed.getFullYear()) : 'Date not listed',
        month: parsed
          ? parsed.toLocaleDateString('en-US', { month: 'short' })
          : null,
        day: parsed ? String(parsed.getDate()) : null
      }
    })
  )
  flat.sort((a, b) => (b.time ?? -Infinity) - (a.time ?? -Infinity))
  const groups = []
  for (const item of flat) {
    const group = groups.find((g) => g.label === item.year)
    if (group) {
      group.entries.push(item)
    } else {
      groups.push({ label: item.year, entries: [item] })
    }
  }
  return groups
})()

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
     (2026-10-30): the page keeps its 980 measure. */
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

/* The timeline: one group per year under a ruled year marker,
   entries running down a spine. The date sits in its own fixed
   rail column — month over day, right-aligned to the spine — so
   a date never shares a line with the tracked-out role text and
   cannot wrap or split the way the old byline dates did. */
.timeline-group {
  margin-bottom: 3rem;
}

.timeline-year {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 1.5rem;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid color-mix(in srgb, var(--main-color) 14%, transparent);
}

.timeline-list {
  position: relative;
}

/* The spine runs through the middle of the gap between the date
   rail (5rem) and the entry column (2rem gap): 5 + 1 = 6rem. */
.timeline-list::before {
  content: "";
  position: absolute;
  top: 0.35rem;
  bottom: 0;
  left: calc(6rem - 0.5px);
  width: 1px;
  background: color-mix(in srgb, var(--main-color) 16%, transparent);
}

.timeline-entry {
  position: relative;
  display: grid;
  grid-template-columns: 5rem minmax(0, 1fr);
  gap: 2rem;
  padding-bottom: 2.5rem;
}

.timeline-entry:last-child {
  padding-bottom: 0.5rem;
}

.timeline-entry::before {
  content: "";
  position: absolute;
  left: 6rem;
  top: 0.45rem;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  transform: translateX(-50%);
  background: var(--main-color);
}

.timeline-date {
  margin: 0;
  padding-top: 0.3rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  text-align: right;
  white-space: nowrap;
}

.timeline-month {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.65;
}

.timeline-day {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.01em;
}

.timeline-undated {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.65;
}

.timeline-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.video-source {
  margin: 0 0 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  opacity: 0.6;
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
  gap: var(--pill-icon-gap);
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

/* A self-hosted entry's preview is the player itself, not a link —
   so its way out to the original post is a real CTA button rather
   than a text link (Mark's call, 2026-10-30). Card entries whose
   thumbnails link out keep the plain text links: the preview image
   is the button there. */
.video-cta-row {
  margin: 0;
}

.video-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--pill-icon-gap);
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

/* Small screens: the rail folds away and the date becomes one
   short line above its entry ("Sep 16") — still its own line,
   still incapable of wrapping into the byline. */
@media screen and (max-width: 40rem) {
  .timeline-entry {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }

  .timeline-list::before,
  .timeline-entry::before {
    display: none;
  }

  .timeline-date {
    flex-direction: row;
    align-items: baseline;
    gap: 0.4rem;
    text-align: left;
    padding-top: 0;
  }

  .timeline-month {
    font-size: 0.85rem;
  }

  .timeline-day {
    font-size: 1.05rem;
  }
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
