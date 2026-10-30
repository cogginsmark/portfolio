<template>
  <div class="app-footer">
    <div>
      <p class="author">{{footer.tagline}}</p>
    </div>
    <div v-if="linkButtons" class="foot-buttons">
      <StyledButton glass secondary v-for="(link, index) in footer.links" :key="`foot-button-${index}`" v-bind:href="link.url" v-bind:target="link.url.startsWith('http') ? '_blank' : undefined" v-bind:rel="link.url.startsWith('http') ? 'noopener' : undefined"><span class="text-button-text">{{ link.name }}</span><i v-bind:class="link.fa"></i></StyledButton>
    </div>
    <div v-else class="icon-container">
      <a class="icons" v-for="(link, index) in footer.links" :key="`product-desctiption-${index}`" v-bind:href="link.url" target="_blank"><i v-bind:class="link.fa"></i></a>
    </div>
  </div>
</template>

<script>
import StyledButton from './StyledButton.vue'

export default {
  components: {
    StyledButton
  },
  props: {
    footer: {
      tagline: String,
      links: Array
    },
    // On the Contact page the footer links render as buttons in the
    // same Linktree stack treatment as the page's actions, instead of
    // the icon row every other page uses (Mark, 2026-10-30).
    linkButtons: Boolean
  }
}
</script>

<style scoped>
.app-footer {
  width: 884px;
  /* margin-top: auto is the sticky-footer half of the shell in
     App.vue: on short pages it pushes the footer to the bottom of
     the viewport; the padding keeps its breathing room on tall ones. */
  margin: 0 auto;
  margin-top: auto;
  padding: 4rem 3rem;
  display: flex;
  font-weight: bold;
  flex-direction: column;
}
@media screen and (max-width: 61.25rem) {
  .app-footer {
    padding: 4rem 1.25rem;
    width: 560px;
  }
}
@media screen and (max-width: 37.5rem) {
  .app-footer {
    width: 320px;
  }
}

.author {
  margin-right: 36px;
}

.icons {
  padding: 8px;
  margin-right: 16px;
  color: var(--theme-text);
  opacity: 0.5;
  transform: translateY(0px);
  transition: 0.3s all ease-out;
}
.icons:hover {
  transform: translateY(-2px);
  transition: 0.2s all ease-out;
  opacity: 1;
}

.icon-container {
  display: flex;
}

/* Button variant (Contact): the same stacked, full-width column as
   the page's own actions — one centred measure, even gaps. */
.foot-buttons {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  width: min(24rem, 100%);
  margin-top: 2rem;
}

.foot-buttons :deep(.styled-button) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-right: 0;
  box-sizing: border-box;
  text-align: center;
}
</style>
