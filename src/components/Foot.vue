<template>
  <div class="app-footer">
    <div>
      <p class="author">{{footer.tagline}}</p>
    </div>
    <div v-if="!hideLinks" class="icon-container">
      <a class="icons" v-for="(link, index) in footer.links" :key="`product-desctiption-${index}`" v-bind:href="link.url" target="_blank"><i v-bind:class="link.fa"></i></a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    footer: {
      tagline: String,
      links: Array
    },
    // The Contact page carries its links as buttons in the main
    // stack, so its footer is the byline alone (Mark, 2026-10-30).
    hideLinks: Boolean
  }
}
</script>

<style scoped>
.app-footer {
  /* The footer takes the shell's measure (Mark's alignment pass,
     2026-10-30): full fluid width up to the header's 1180px, with
     the header's own side padding, so its edges agree with the bar
     above on every page. The old fixed steps (884/560/320px)
     matched nothing on the site and are gone.
     margin-top: auto is the sticky-footer half of the shell in
     App.vue: on short pages it pushes the footer to the bottom of
     the viewport; the padding keeps its breathing room on tall ones. */
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  margin-top: auto;
  padding: 4rem 1.25rem;
  display: flex;
  font-weight: bold;
  flex-direction: column;
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

</style>
