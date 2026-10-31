<template>
  <a class="styled-a" v-bind:href="url" target="_blank" v-bind:aria-label="alt">
    <div class="logo-card">
        <img class="logo" v-bind:src="src" v-bind:alt="alt" v-bind:width="width" v-bind:height="height"/>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    src: String,
    url: String,
    alt: String,
    // The mark's intrinsic proportions, bound onto the img so
    // its box is reserved before the file loads.
    width: [Number, String],
    height: [Number, String]
  }
}
</script>

<style scoped>
.styled-a {
  margin: 2rem 1rem;
}
@media screen and (max-width: 980px) {
  .styled-a {
    margin: 1rem 0.5rem;
  }
  /* The card's interior steps down with its margin (the
     spacing system, 2026-10-30): the desktop 2.66rem side
     padding was the widest on the site at phone size and
     never stepped. The identical 600px restatement that
     used to sit below this block is gone. */
  .logo-card {
    padding: 2rem var(--gutter);
  }
}

.logo-card {
  height: 2rem;
  flex: 1;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background: var(--card-background);
  /* background: radial-gradient(118.99% 670.46% at -7.06% -9.5%, #FFFFFF 0%, #F1F1F1 100%); */
  box-shadow: var(--card-box-shadow);
  border-radius: var(--radius-card);
  padding: 2rem 2.66rem;
  position: relative;
  /* Can't transition radial gradients */
  /* transition: 0.3s background; */

  /* Disabled for performance issues */
  /* backdrop-filter: blur(10px); */

  display: block;
  transform: translateY(0px);
  transition: 0.3s transform ease-out, 0.3s filter ease-out;
  filter: saturate(0);
}
.logo-card:hover {
  transform: translateY(-4px);
  transition: 0.2s transform ease-out, 0.3s filter ease-out;
  filter: saturate(0);
}

.logo {
  height: 100%;
  mix-blend-mode: exclusion;
  filter: invert(1);
  opacity: 0.8;
}
</style>
