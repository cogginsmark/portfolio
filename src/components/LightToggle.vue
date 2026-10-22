<template>
  <button type="button" class="light-toggle" @click="toggleTheme">
    <slot />
  </button>
</template>

<script>
import { toggleTheme } from '../theme.js'

// The light/dark toggle button. Was a `styled.button` from
// vue-styled-components, copy-pasted identically into Home.vue, about.vue
// and contact.vue; now one shared component with the same styles scoped.
export default {
  name: 'LightToggle',
  methods: {
    toggleTheme
  }
}
</script>

<style scoped>
.light-toggle {
  border: none;
  background: transparent;
  position: sticky;
  float: right;
  bottom: 20px;
  right: 20px;
  margin-top: -40px;
  padding: 5px;
  font-size: 24px;
  text-decoration: none;
  transform: translateY(0px);
  transition: 0.3s transform ease-out;
  cursor: pointer;
}
.light-toggle:hover {
  transform: translateY(-5px);
  transition: 0.2s transform ease-out;
}
</style>
