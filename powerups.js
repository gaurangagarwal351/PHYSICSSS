// ─────────────────────────────────────────────
//  powerups.js  —  Powerup definitions, world
//  objects, and active-powerup state machine.
//
//  Exposes a clean API; game.js drives it by
//  calling spawn(), tick(), tryCollect(), and
//  scroll().  No rendering lives here.
// ─────────────────────────────────────────────

import { POWERUPS } from './constants.js';

// ─────────────────────────────────────────────────────────────
//  Definitions
// ─────────────────────────────────────────────────────────────

/**
 * @typedef {Object} PowerupDef
 * @property {string} label
 * @property {number} dur      - active duration in seconds
 * @property {string} color
 * @property {string} bg
 * @property {string} icon
 * @property {string} desc
 */

/** @type {Object.<string, PowerupDef>} */
export const POWERUP_DEFS = {
  FREEZE      : { label:'FREEZE TIME',  dur:2, color:'#00eeff', bg:'#003344', icon:'❄',  desc:'World frozen!'  },
  TRIPLE_JUMP : { label:'TRIPLE JUMP',  dur:5, color:'#ffdd00', bg:'#332200', icon:'▲',  desc:'3 jumps!'       },
  SLOW_MO     : { label:'SLOW-MO',      dur:4, color:'#ff66ff', bg:'#220033', icon:'⧗',  desc:'Slowed!'        },
  SHIELD      : { label:'SHIELD',       dur:4, color:'#44ff99', bg:'#003322', icon:'◈',  desc:'Protected!'     },
};

const TYPES = Object.keys(POWERUP_DEFS);

// ─────────────────────────────────────────────────────────────
//  World powerup objects
// ─────────────────────────────────────────────────────────────

/** @type {Object[]} */
let _items = [];

export function getItems() { return _items; }

/**
 * Maybe spawn a powerup after a mode shift.
 * @param {number} levelIdx
 * @param {number} W
 * @param {number} H
 */
export function maybeSpawn(levelIdx, W, H) {
  if (levelIdx < POWERUPS.MIN_LEVEL_IDX)         return;
  if (Math.random() > POWERUPS.SPAWN_CHANCE)      return;

  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  _items.push({
    x    : W * 0.55 + Math.random() * W * 0.35,
    y    : H * 0.18 + Math.random() * H * 0.52,
    type,
    bobT : Math.random() * Math.PI * 2,
    angle: 0,
  });
}

/**
 * Scroll items left and remove off-screen ones.
 * GC fix: in-place compaction avoids a new array allocation every frame.
 *
 * @param {number} scrollDelta  pixels to move left this frame
 * @param {number} dt           ms
 */
export function scroll(scrollDelta, dt) {
  let alive = 0;
  for (let i = 0; i < _items.length; i++) {
    const pw = _items[i];
    pw.x    -= scrollDelta;
    pw.bobT += dt / 600;
    pw.angle += dt / 1000 * 2;
    if (pw.x > -40) {
      if (alive !== i) _items[alive] = _items[i];
      alive++;
    }
  }
  _items.length = alive;
}

/**
 * Check if player has collected a powerup.
 * @param {Object} player
 * @returns {string|null}  collected type, or null
 */
export function tryCollect(player) {
  const HIT = 16;
  for (let i = 0; i < _items.length; i++) {
    const pw = _items[i];
    if (
      player.x + player.w > pw.x - HIT &&
      player.x            < pw.x + HIT &&
      player.y + player.h > pw.y - HIT &&
      player.y            < pw.y + HIT
    ) {
      _items.splice(i, 1);
      return pw.type;
    }
  }
  return null;
}

export function clearItems() { _items.length = 0; }

// ─────────────────────────────────────────────────────────────
//  Active powerup state
// ─────────────────────────────────────────────────────────────

/** @type {{ type:string|null, timer:number, maxTimer:number }} */
export const active = { type: null, timer: 0, maxTimer: 1 };

/** Derived booleans for physics / game logic. */
export const state = {
  frozen  : false,
  triple  : false,
  shield  : false,
  slowMo  : false,
};

/** Announce overlay state (read by renderer). */
export const announce = { type: null, timer: 0 };

/**
 * Activate a powerup by type key.
 * @param {string} type
 * @param {Object} player  - to grant extra jumps for TRIPLE_JUMP
 */
export function activate(type, player) {
  const def       = POWERUP_DEFS[type];
  active.type     = type;
  active.timer    = def.dur;
  active.maxTimer = def.dur;

  announce.type  = type;
  announce.timer = 2.0;

  state.frozen = type === 'FREEZE';
  state.triple = type === 'TRIPLE_JUMP';
  state.shield = type === 'SHIELD';
  state.slowMo = type === 'SLOW_MO';

  if (state.triple && player) player.jumpsLeft = 3;
}

/** Clear all active powerup effects. */
export function deactivate() {
  active.type  = null;
  active.timer = 0;
  state.frozen = state.triple = state.shield = state.slowMo = false;
}

/**
 * Advance timers.
 * @param {number} dt  milliseconds
 */
export function tick(dt) {
  if (announce.timer > 0) announce.timer -= dt / 1000;

  if (!active.type) return;
  active.timer -= dt / 1000;
  if (active.timer <= 0) deactivate();
}
