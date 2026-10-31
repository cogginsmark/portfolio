/**
 * Vue port of engine/press.ts from @zakisheriff/liquid-glass v0.3.13 (MIT).
 * Logic, constants and comments are verbatim; TypeScript type annotations
 * and the PressOptions interface were stripped (kept as a JSDoc typedef),
 * and the React `usePress` hook became a Vue composable with the same
 * signature.
 */
import { watchEffect, onWatcherCleanup } from 'vue';
import { SPRINGS, createSpring, rubberband, springFrom } from './spring.js';
import { guardSelection } from './selection.js';

/** Resolves a Vue Ref object (its `.value`) or a getter function to its current value. */
const resolveRef = (input) => (typeof input === 'function' ? input() : input?.value ?? input);

/**
 * The Liquid Glass touch response: the shape swells under the finger, leans
 * and stretches toward a drag like a droplet held by surface tension, lights
 * up where it's touched, then lets go with a soft jelly wobble.
 */

/** Finger-following feel: quick but never twitchy. */
const FOLLOW = springFrom(0.2, 0.82);

/**
 * @typedef {object} PressOptions
 * @property {number} [grow] Swell on touch as a fraction (0.14 = 14%). Defaults to iOS sizing: small
 *  circles swell ~20%, wide pills ~10%. Mouse presses swell a little less.
 * @property {number} [lean] How far (px) the shape may lean toward a drag.
 * @property {number} [stretch] Max anisotropic stretch while dragging (0.1 = 10%).
 * @property {boolean} [disabled]
 */

export function usePress(ref, optionsInput = {}) {
  watchEffect(() => {
    const options = resolveRef(optionsInput) ?? {};
    const { grow, lean = 10, stretch = 0.2, disabled = false } = options;
    const el = resolveRef(ref);
    if (!el || disabled) return;

    const v = { sx: 1, sy: 1, tx: 0, ty: 0 };
    const paint = () => {
      el.style.scale = `${v.sx} ${v.sy}`;
      el.style.translate = `${v.tx}px ${v.ty}px`;
    };
    const springs = ['sx', 'sy', 'tx', 'ty'].map((key) =>
      createSpring(key[0] === 's' ? 1 : 0, SPRINGS.release, (value) => {
        v[key] = value;
        paint();
      }),
    );
    const to = (targets, feel) =>
      springs.forEach((s, i) => {
        s.tune(feel);
        s.set(targets[i]);
      });

    let pointer = null;

    const light = (event, box) => {
      el.style.setProperty('--lg-x', `${((event.clientX - box.left) / box.width) * 100}%`);
      el.style.setProperty('--lg-y', `${((event.clientY - box.top) / box.height) * 100}%`);
    };

    const track = (event) => {
      if (!pointer) return;
      const { box, base, w, h } = pointer;
      light(event, box);
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      const dist = Math.hypot(dx, dy);
      // Surface tension: the drop stays held in its place and is drawn out
      // toward the finger, like taffy. The far edge barely moves; only the
      // near edge reaches, saturating so it never tears free. The stretch
      // blends with direction (cos²/sin²), so a sideways drag morphs into a
      // downward one instead of flipping.
      const cx = dist ? (dx / dist) ** 2 : 0;
      const cy = dist ? (dy / dist) ** 2 : 0;
      const span = Math.min(w * cx + h * cy, 64);
      const reach = rubberband(dist, span * stretch * 2, 0.55);
      const ex = (reach * cx) / w;
      const ey = (reach * cy) / h;
      // Half the added length shifts the centre, pinning the trailing edge;
      // a small lean on top lets the whole drop give a little.
      const tx = Math.sign(dx) * (reach * cx * base) / 2 + rubberband(dx, lean * 0.6, 0.4);
      const ty = Math.sign(dy) * (reach * cy * base) / 2 + rubberband(dy, lean * 0.6, 0.4);
      to([base * (1 + ex - ey * 0.35), base * (1 + ey - ex * 0.35), tx, ty], FOLLOW);
    };

    const move = (event) => {
      if (event.pointerId === pointer?.id) track(event);
    };

    const up = (event) => {
      if (event && event.pointerId !== pointer?.id) return;
      pointer = null;
      delete el.dataset.pressed;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      to([1, 1, 0, 0], SPRINGS.release);
    };

    const down = (event) => {
      if (!event.isPrimary || event.button !== 0 || pointer) return;
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      const box = el.getBoundingClientRect();
      const w = el.offsetWidth || 1;
      const h = el.offsetHeight || 1;
      const natural = Math.min(0.22, Math.max(0.07, 9 / Math.sqrt(w * h)));
      const amount = (grow ?? natural) * (event.pointerType === 'mouse' ? 0.75 : 1);
      const base = 1 + amount;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, box, base, w, h };
      el.dataset.pressed = '';
      light(event, box);
      to([base, base, 0, 0], SPRINGS.press);
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    };

    const blur = () => up();
    // Older iOS ignores touch-action on some elements; a held press owns the gesture.
    const hold = (event) => {
      if (pointer && event.cancelable) event.preventDefault();
    };
    const unguard = guardSelection(el);
    el.addEventListener('touchmove', hold, { passive: false });
    el.addEventListener('pointerdown', down);
    window.addEventListener('blur', blur);
    onWatcherCleanup(() => {
      up();
      springs.forEach((s) => s.stop());
      unguard();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('touchmove', hold);
      window.removeEventListener('blur', blur);
      el.style.removeProperty('scale');
      el.style.removeProperty('translate');
    });
  });
}
