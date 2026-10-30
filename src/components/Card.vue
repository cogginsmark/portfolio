<template>
  <div class="card">
    <div class="contents">
      <div class="left-container">
        <div>
          <h1 class="text-main-title">{{name}}</h1>
          <div class="medium">{{medium}}</div>
          <div class="carousel-container" v-if="windowWidth <= 980">
            <Carousel v-if="images" class="styled-carousel" :items-to-show="1" :autoplay="autoplay" :wrap-around="true" :pause-autoplay-on-hover="true">
              <Slide v-for="(image, index) in images" :key="index">
                <img class="carousel-image" loading="lazy" v-bind:src="image"/>
              </Slide>
              <template #addons>
                <Pagination />
              </template>
            </Carousel>
          </div>
          <p class="text-paragraph text-subtitle">{{summary}}</p>
          <p class="text-paragraph" v-for="(text, index) in copy" :key="index">{{text}}</p>
        </div>
        <div class="button-container" :class="{ empty: !copy }">
          <StyledButton
            v-if="links.primary"
            primary
            :color="links.color"
            v-bind:href="links.primary.url"
            target="_blank"
          ><span class="text-button-text">{{links.primary.name}}</span><i class="fas fa-arrow-right"></i></StyledButton>
          <StyledButton
            v-if="links.secondary"
            secondary
            :color="links.color"
            v-bind:href="links.secondary.url"
            target="_blank"
          ><span class="text-button-text">{{links.secondary.name}}</span><i class="fas fa-arrow-right"></i></StyledButton>
        </div>
      </div>
      <div class="carousel-container" v-if="windowWidth > 980">
        <Carousel v-if="images" class="styled-carousel" :items-to-show="1" :autoplay="autoplay" :wrap-around="true" :pause-autoplay-on-hover="true">
          <Slide v-for="(image, index) in images" :key="index">
            <img class="carousel-image" loading="lazy" v-bind:src="image"/>
          </Slide>
          <template #addons>
            <Pagination />
          </template>
        </Carousel>
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide, Pagination } from 'vue3-carousel'
import 'vue3-carousel/carousel.css'
import StyledButton from './StyledButton.vue'

// All vue-styled-components wrappers in this file became plain elements with
// the scoped classes below; theme interpolations became the CSS variables
// ThemeRoot sets (screen widths/paddings are theme constants — 980/600/360
// and 48/20/20 in both themes — inlined in the media queries).
export default {
  components: {
    Carousel,
    Slide,
    Pagination,
    StyledButton
  },
  props: {
    name: String,
    medium: String,
    summary: String,
    copy: Array,
    links: {
      color: String,
      primary: {
        name: String,
        url: String
      },
      secondary: {
        name: String,
        url: String
      }
    },
    images: Array
  },
  data() {
    // Timed slides are back (Mark's call, 2026-10-30: the ASI and
    // Flux carousels used to advance on their own). 4.5 seconds a
    // slide, wrapping at the end and pausing while a pointer hovers;
    // visitors who ask for reduced motion get the manual carousel
    // back, so autoplay resolves to 0 for them.
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return {
        windowWidth: window.innerWidth,
        autoplay: reduceMotion ? 0 : 4500
    }
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  // Vue 3 rename of beforeDestroy; also now actually removes the listener
  // (the original passed a fresh anonymous function, so removal was a no-op).
  beforeUnmount() {
      window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style scoped>
.card {
  /* Fluid under the authored sizes (2026-10-30): the old fixed
     steps (980/600/360) stranded wide phones on the 360 step while
     the rest of the page went fluid. One cap per range now, and
     the card takes whatever the viewport actually offers. */
  width: 100%;
  max-width: 980px;
  background: var(--card-background);
  box-shadow: var(--card-box-shadow);
  border-radius: 20px;
  margin: auto;
  margin-bottom: 80px;
  /* Can't transition radial gradients */
  /* transition: 0.3s background; */
}
@media screen and (max-width: 980px) {
  .card {
    max-width: 600px;
    margin-bottom: 40px;
  }
}
@media screen and (max-width: 600px) {
  .card {
    max-width: 600px;
    margin-bottom: 40px;
  }
}
/* Disabled for performance issues */
/* backdrop-filter: blur(10px); */

.contents {
  display: flex;
  padding: 64px 48px;
}
@media screen and (max-width: 980px) {
  .contents {
    padding: 40px 20px;
    /* Border-box at the card's full width: content lands at the
       card's width less the padding, the old 560 content-box step
       plus its padding having been the same total by accident. */
    box-sizing: border-box;
    width: 100%;
    margin: 0;
  }
}
@media screen and (max-width: 600px) {
  .contents {
    padding: 40px 20px;
    width: 100%;
  }
}

.left-container {
  width: 320px;
  margin-right: 10px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
@media screen and (max-width: 980px) {
  .left-container {
    width: 100%;
    max-width: 560px;
    /* The carousel lives inside this container at these widths
       (see the template's windowWidth switch), so the desktop
       margin-right — room for a carousel beside it that is not
       there — goes, or the row overflows its own card. */
    margin-right: 0;
  }
}
@media screen and (max-width: 600px) {
  .left-container {
    width: 100%;
  }
}

.medium {
  font-weight: 300;
  font-size: 0.75rem;
  letter-spacing: 1.8px;
  margin-bottom: 1.5em;
}

/* Order preserved from the styled-components template (media query first,
   then the prop-driven margin) so the cascade resolves the same way. */
@media screen and (max-width: 980px) {
  .button-container {
    margin-top: 32px;
  }
}
.button-container {
  margin-top: 0px;
}
.button-container.empty {
  margin-top: 32px;
}

.carousel-image {
  width: 100%;
  float: right;
  object-fit: cover;
  object-position: top;
  opacity: var(--card-carousel-opacity);
}
.carousel-image:hover {
  cursor: grab;
}
.carousel-image:active {
  cursor: grabbing;
}

.carousel-container {
  margin: auto;
}

/* vue3-carousel replacement for the styled(vue-carousel) block below it in
   the original file: root keeps the same size/shadow/radius; the
   .VueCarousel-* selectors map to vue3-carousel's .carousel__* classes. */
.styled-carousel {
  box-shadow: var(--card-carousel-box-shadow);
  border-radius: 10px;
  overflow: hidden;
  height: 275px;
  width: 500px;
}
.styled-carousel :deep(.carousel__viewport),
.styled-carousel :deep(.carousel__track),
.styled-carousel :deep(.carousel__slide) {
  height: 100%;
}
.styled-carousel :deep(.carousel__pagination) {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin-top: 0px;
}
.styled-carousel :deep(.carousel__pagination-button::after) {
  background-color: rgb(127 127 127 / 25%);
  transition: 0.3s background-color ease-in-out;
}
.styled-carousel :deep(.carousel__pagination-button--active::after) {
  background-color: rgb(127 127 127);
  transition: 0.3s background-color ease-in-out;
}
@media screen and (max-width: 980px) {
  .styled-carousel {
    width: 100%;
    max-width: 560px;
    /* Height follows width at the authored ratio instead of a
       second fixed step. */
    aspect-ratio: 560 / 308;
    height: auto;
    margin: 20px 0px;
  }
}
@media screen and (max-width: 600px) {
  .styled-carousel {
    width: 100%;
    height: auto;
  }
}
</style>
