<template>
  <div class="minor-card">
    <div class="contents">
      <h1 class="product-title">{{name}}</h1>
      <p class="text-paragraph">{{description}}</p>
    </div>
    <div class="button-row">
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
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--card-background);
  box-shadow: var(--card-box-shadow);
  border-radius: 1.25rem;
  margin: auto;
  position: relative;
  margin-bottom: 2.5rem;
  padding: 2rem 3rem;
  /* Can't transition radial gradients */
  /* transition: 0.3s background; */
}

/* In the three-across row the cards are slightly portrait (4:5)
   instead of square, and the row stretches them to one height, so a
   card whose copy runs long grows the whole row instead of pushing
   its own View Project link out of line. Stacked layouts keep a
   natural height. The link row is pinned to the card's foot either
   way. */
@media screen and (min-width: 61.25rem) {
  .minor-card {
    aspect-ratio: 4 / 5;
  }
}

.button-row {
  margin-top: auto;
}

@media screen and (max-width: 61.25rem) {
  .minor-card {
    padding: 2rem 1.25rem;
  }
}
/* Disabled for performance issues */
/* backdrop-filter: blur(10px); */

.product-title {
  font-size: 1.5rem;
  margin-top: 0;
  letter-spacing: 0.02em;
  line-height: var(--leading-title);
  margin-bottom: 0.5rem;
}

.contents > * {
  margin: 1.5rem 0;
}

.minor-button {
  display: inline-flex;
  align-items: center;
  gap: var(--pill-icon-gap);
  width: fit-content;
  font-size: 0.7rem;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  padding: 0.25rem;
  padding-left: 0;
  font-weight: bold;
  margin-right: 1.25rem;
  line-height: 2.5rem;
  color: var(--theme-text);
  transform: translateY(0px);
  transition: 0.3s all ease-out;
}
.minor-button .text-button-text {
  margin-right: 0;
}
.minor-button:hover {
  transform: translateX(2px);
  transition: 0.2s all ease-out;
}
</style>
