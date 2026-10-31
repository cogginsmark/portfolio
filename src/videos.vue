<template>
  <div id="videos" ref="root">
    <ThemeRoot>
      <div class="videos-wrap">
        <header class="videos-intro" data-reveal>
          <p class="videos-lede"><i class="fas fa-play videos-lede-icon" aria-hidden="true"></i>{{ intro }}</p>
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
                section.entries.filter((e) => !e.feature).length === 1,
              'video-grid--side':
                section.entries.filter((e) => !e.feature).length === 1 &&
                section.entries.some((e) => e.src)
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
                <!-- The sound pill is rendered by the library's own
                     GlassButton (patch 003): a real button, the
                     volume glyph leading in its icon box, the
                     press spring and refraction included. The
                     class keeps this page's placement CSS on it;
                     aria-pressed and the click fall through to
                     the component's button. -->
                <GlassButton
                  class="video-sound"
                  :aria-pressed="soundOn"
                  @click="toggleSound"
                >
                  <template #icon>
                    <i
                      :class="soundOn ? 'fas fa-volume-up' : 'fas fa-volume-off'"
                      aria-hidden="true"
                    ></i>
                  </template>
                  {{ soundOn ? 'Sound on' : 'Tap for sound' }}
                </GlassButton>
              </div>
              <a v-else class="video-thumb" :href="entry.youtube || entry.instagram" target="_blank" rel="noopener" :aria-label="`Watch: ${entry.title}`">
                <img
                  :src="entry.thumb || `https://i.ytimg.com/vi/${entry.videoId}/hqdefault.jpg`"
                  :alt="entry.title"
                  loading="lazy"
                />
                <span class="video-play" aria-hidden="true"><i class="fas fa-play"></i></span>
              </a>
              <div class="video-card-text">
              <h3 class="video-title">{{ entry.title }}</h3>
              <p class="video-meta">
                <span class="video-role">{{ entry.role }}</span>
                <span v-if="entry.date" class="video-date"> · {{ entry.date }}</span>
              </p>
              <p v-if="entry.software" class="video-software">{{ entry.software }}</p>
              <p class="video-note">{{ entry.note }}</p>
              <p v-if="entry.credit" class="video-credit">{{ entry.credit }}</p>
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
import GlassButton from './components/liquid-glass/components/GlassButton.vue'
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
    // No fade and no autoplay for reduced motion: the poster is
    // simply there, and a tap starts the piece.
    v.classList.add('is-on')
    return
  }
  v.muted = true
  if (!('IntersectionObserver' in window)) {
    v.classList.add('is-on')
    v.play().catch(() => {})
    return
  }
  playerObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // The fade onto the placeholder starts as the piece
          // starts (Mark's call, 2026-10-30).
          v.classList.add('is-on')
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
  padding: 3rem var(--gutter) 1rem;
}

.videos-intro {
  margin-bottom: 3rem;
}

/* No page title (Mark's call, 2026-10-30): the lede leads the
   page on its own, carrying the Videos button's play icon inline
   and set on one line — no wrap, no measure cap — at any width
   that can hold it; small phones wrap it rather than clip it. */
.videos-lede {
  margin: 0;
  font-size: 1rem;
  line-height: var(--leading-text);
  opacity: 0.75;
  white-space: nowrap;
}

.videos-lede-icon {
  margin-right: 0.6rem;
  font-size: 0.85em;
}

@media screen and (max-width: 40rem) {
  .videos-lede {
    white-space: normal;
  }
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
  /* Rule-to-entries totals match About (the spacing system,
     2026-10-30): 0.35rem to the note plus 0.75rem from it =
     the same 1.1rem About puts under its ruled titles. Was
     1.5rem, which made this page's total 33.3px to About's
     19.8px. */
  margin: 0 0 0.75rem;
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

/* While a section holds a single self-hosted player entry —
   Client Work's 916 Day piece, for now — the entry goes wide
   instead of centring as a lone card: player on the left, its
   content alongside it on the right (Mark's call, 2026-10-30).
   The card's text elements sit in a .video-card-text wrapper
   that is display: contents in every other layout, so the
   thumbnail cards are untouched; here it becomes the right-hand
   column, with the CTA pinned to its foot. On small screens the
   pair stacks again, player centred over its text. */
.video-card-text {
  display: contents;
}

.video-grid--side {
  justify-items: stretch;
}

.video-grid--side .video-card {
  flex-direction: row;
  gap: 1.5rem;
  max-width: none;
}

.video-grid--side .video-player {
  flex: none;
  width: min(300px, 40%);
  margin-bottom: 0;
}

.video-grid--side .video-card-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

/* The credit line gets its own paragraph under the note; in the
   side layout it also takes an auto top margin, so it and the
   CTA row split the column's spare height between them — the
   content makes up the player's vertical space instead of
   huddling at the top (Mark's call, 2026-10-30). */
.video-credit {
  margin: 0 0 0.85rem;
  font-size: 0.85rem;
  opacity: 0.75;
}

.video-grid--side .video-credit {
  margin-top: auto;
  margin-bottom: 0;
}

/* The credit sits at the column's foot, directly above the
   Instagram pill (Mark's call, 2026-10-30): the credit's auto
   margin does the pushing, the pill keeps only a small gap. */
.video-grid--side .video-cta-row {
  margin-top: 0.5rem;
}

/* The 916 description justifies to both margins (Mark's
   correction, 2026-10-30 — full justification, not a right
   alignment): in the side layout the note's left edge is set
   by the player beside it and its right edge is the
   container's own width, and the text fills that measure
   flush on both sides. Everything else in the column keeps
   its left alignment. */
.video-grid--side .video-note {
  text-align: justify;
}

@media screen and (max-width: 40rem) {
  .video-grid--side .video-card {
    flex-direction: column;
    gap: 0;
  }

  .video-grid--side .video-player {
    width: 100%;
    /* Full column when stacked (the spacing system,
       2026-10-30): the 340px cap left the player 2.5px
       inside both edges of the 345px column its text spans.
       The cap stays for the centred layouts above this
       width, where centring is the design. */
    max-width: none;
    margin-inline: auto;
    margin-bottom: 0.85rem;
  }

  .video-grid--side .video-card-text {
    display: contents;
  }
}

.video-player {
  position: relative;
  max-width: 340px;
  margin-bottom: 0.85rem;
  /* The placeholder space the piece fades onto (Mark's call,
     2026-10-30): white, at his word — before the video arrives,
     this is what fills its 9/16 frame. Overflow hidden is what
     the on-site crop below clips against. */
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.video-native {
  display: block;
  width: 100%;
  aspect-ratio: 9 / 16;
  border-radius: 12px;
  background: transparent;
  object-fit: cover;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.5s ease;
  /* Cropped in 1% on all sides, on-site (Mark's call,
     2026-10-30 — the file itself is untouched): scaling by
     1/(1 − 2%) pushes 1% of the frame past each edge, where
     the player's overflow clips it. */
  transform: scale(1.0204);
}

.video-native.is-on {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .video-native {
    transition: none;
  }
}

@media screen and (max-width: 40rem) {
  /* The page's pills take the same phone step-down as the
     site's other buttons (2026-10-30): a step smaller type
     and padding. */
  .video-cta {
    font-size: 0.82rem;
    /* The StyledButton phone metrics (the spacing system,
       2026-10-30), widened with them in the Apple-spec
       sweep: 0.55rem 1.25rem. */
    padding: 0.55rem 1.25rem;
  }

  /* The sound pill's phone step-down is gone (patch 003): as a
     GlassButton it keeps the library's metrics at every width,
     like the other glass buttons. */
}

/* Placement only (patch 003): the pill itself is the library's
   GlassButton now — its surface, metrics, type and states come
   from the component. What stays here is where it rides on the
   video; the opaque black ground and its hover state it used
   to carry are gone with the old button. */
.video-sound {
  position: absolute;
  right: 0.6rem;
  bottom: 0.6rem;
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

/* The tools line, in the homepage project cards' medium
   treatment: small, light, widely tracked, sitting between the
   byline and the note. */
.video-software {
  margin: 0 0 0.45rem;
  font-size: 0.75rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  opacity: 0.75;
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
  /* Wider sides in the Apple-spec sweep (Mark's call,
     2026-10-30): 1.5rem, in step with the site's buttons. */
  padding: 0.6rem 1.5rem;
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
