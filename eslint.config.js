import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'

// ESLint 10 flat config. Equivalent of the old package.json eslintConfig:
//   "extends": ["plugin:vue/essential", "eslint:recommended"]
// with the babel-eslint parser dropped (Babel was removed with Vue CLI;
// Vite/esbuild needs no parser plugin for this codebase).
export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'blender/**',
      // Plain-JS data/theme modules kept as .ts from the Vue CLI setup; they
      // were never type-checked or lint-parsed (no TS ESLint parser was ever
      // configured), so they stay out of the lint set.
      'src/data/**',
      'src/themes/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  ...pluginVue.configs['flat/essential'],
  {
    // The single-word component names (Card, Hero, Foot, ...) are the
    // codebase's long-standing convention. This rule was not part of
    // plugin:vue/essential in eslint-plugin-vue 6 (it moved into essential
    // in later majors), so it is turned off to keep the original lint intent.
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
]
