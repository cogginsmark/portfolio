<template>
  <div class="minor-card">
    <div class="contents">
      <h1 class="product-title">{{name}}</h1>
      <p class="text-paragraph">{{description}}</p>
    </div>
    <div>
      <a class="minor-button" v-bind:href="link.url" target="_blank" ><span class="text-button-text">{{link.name}}</span><i class="fas fa-arrow-right"></i></a>
    </div>
  </div>
</template>

<script>
// This file had its own local StyledButton (a plain text-link style,
// different from Card.vue's button) — it is now the .minor-button class.
export default {
  props: {
    name: String,
    description: String,
    link: {
      name: String,
      url: String
    }
  }
}
</script>

<style scoped>
.minor-card {
  /* width: 100px; */
  height: 200px;
  flex: 1;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background: var(--card-background);
  /* background: radial-gradient(118.99% 670.46% at -7.06% -9.5%, #FFFFFF 0%, #F1F1F1 100%); */
  box-shadow: var(--card-box-shadow);
  border-radius: 20px;
  margin: auto;
  position: relative;
  margin-bottom: 40px;
  padding: 32px 48px;
  /* Can't transition radial gradients */
  /* transition: 0.3s background; */
}
@media screen and (max-width: 980px) {
  .minor-card {
    padding: 32px 20px;
  }
}
@media screen and (max-width: 600px) {
  .minor-card {
    padding: 32px 20px;
  }
}
/* Disabled for performance issues */
/* backdrop-filter: blur(10px); */

.product-title {
  font-size: 24px;
  margin-top: 0px;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.contents > * {
  margin: 24px 0px;
}

.minor-button {
  display: block;
  width: fit-content;
  font-size: 0.7rem;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  padding: 0.25rem;
  padding-left: 0px;
  font-weight: bold;
  margin-right: 20px;
  line-height: 40px;
  color: var(--theme-text);
  transform: translateY(0px);
  transition: 0.3s all ease-out;
}
.minor-button:hover {
  transform: translateX(2px);
  transition: 0.2s all ease-out;
}
</style>
