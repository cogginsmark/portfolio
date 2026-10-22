<template>
  <div class="app-footer">
    <div>
      <p class="author">{{footer.tagline}}</p>
    </div>
    <div class="icon-container">
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
    }
  }
}
</script>

<style scoped>
.app-footer {
  width: 884px;
  margin: 64px auto;
  padding: 0px 48px;
  display: flex;
  font-weight: bold;
  flex-direction: column;
}
@media screen and (max-width: 980px) {
  .app-footer {
    padding: 0px 20px;
    width: 560px;
  }
}
@media screen and (max-width: 600px) {
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
</style>
