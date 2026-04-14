// ─────────────────────────────────────────────
//  levels.js  —  MODES and LEVELS data only.
//  No logic lives here; just pure data objects.
// ─────────────────────────────────────────────

/**
 * @typedef {Object} Mode
 * @property {string} name
 * @property {number} gY        - vertical gravity per frame
 * @property {number} gX        - horizontal gravity per frame
 * @property {number} fric      - ground friction multiplier (0=no friction, 1=ice)
 * @property {number} jump      - initial jump velocity (negative = up)
 * @property {string} color     - HEX accent colour
 * @property {string} bg        - fallback background colour
 * @property {string} desc      - short description shown to player
 */

/** @type {Mode[]} */
export const MODES = [
  { name:"NORMAL",   gY: 0.52,  gX: 0,    fric: 0.82,  jump:-13.5, color:"#00ff88", bg:"#050510", desc:"Standard physics"     },
  { name:"MOON",     gY: 0.13,  gX: 0,    fric: 0.90,  jump:-7.5,  color:"#8cb4ff", bg:"#05050f", desc:"Low gravity — floaty!" },
  { name:"CRUSHER",  gY: 1.45,  gX: 0,    fric: 0.75,  jump:-19,   color:"#ff3355", bg:"#100505", desc:"Heavy gravity!"        },
  { name:"FLIPPED",  gY:-0.52,  gX: 0,    fric: 0.82,  jump: 13.5, color:"#dd44ff", bg:"#0a0510", desc:"Gravity INVERTED"      },
  { name:"ICE",      gY: 0.52,  gX: 0,    fric: 0.975, jump:-13.5, color:"#66ffff", bg:"#050a10", desc:"Zero friction"         },
  { name:"GLUE",     gY: 0.52,  gX: 0,    fric: 0.50,  jump:-13.5, color:"#ffaa00", bg:"#100800", desc:"Max friction"          },
  { name:"DRIFT",    gY: 0.04,  gX: 0,    fric: 0.99,  jump:-5.5,  color:"#ffffff", bg:"#050508", desc:"Near zero-G"           },
  { name:"SIDEWAYS", gY: 0.18,  gX: 0.42, fric: 0.84,  jump:-11,   color:"#ff7700", bg:"#0a0500", desc:"Side gravity"          },
];

/**
 * @typedef {Object} Level
 * @property {number}   id
 * @property {string}   name
 * @property {string}   emoji        - display prefix (currently the level number)
 * @property {number[]} modes        - indices into MODES that can appear
 * @property {number}   goal         - score needed to complete the level (Infinity = no goal)
 * @property {number}   shiftEvery   - seconds between mode shifts (9999 = never)
 * @property {number}   scrollBase   - base scroll speed
 * @property {number}   platWMul     - platform-width multiplier (>1 = wider)
 * @property {number}   gapMul       - gap multiplier (>1 = wider gaps)
 * @property {number}   lives        - starting lives for this level
 * @property {string}   desc         - short description shown on card
 */

/** @type {Level[]} */
export const LEVELS = [
  { id:1,  name:"The Basics",       emoji:"01", modes:[0],                  goal:500,      shiftEvery:9999, scrollBase:3.12, platWMul:1.6, gapMul:0.65, lives:3, desc:"Learn the ropes"             },
  { id:2,  name:"Light Touch",      emoji:"02", modes:[0,1],                goal:700,      shiftEvery:22,   scrollBase:3.48, platWMul:1.4, gapMul:0.8,  lives:3, desc:"Gravity gets lighter"        },
  { id:3,  name:"Slip & Slide",     emoji:"03", modes:[0,4],                goal:900,      shiftEvery:20,   scrollBase:3.84, platWMul:1.25,gapMul:0.9,  lives:3, desc:"ICE mode is slippery!"       },
  { id:4,  name:"Heavy Load",       emoji:"04", modes:[0,2],                goal:1100,     shiftEvery:18,   scrollBase:4.20, platWMul:1.1, gapMul:1.0,  lives:3, desc:"CRUSHER gravity awaits"      },
  { id:5,  name:"Flip It",          emoji:"05", modes:[0,3],                goal:1300,     shiftEvery:16,   scrollBase:4.56, platWMul:1.0, gapMul:1.1,  lives:3, desc:"Gravity inverts!"            },
  { id:6,  name:"Drift Zone",       emoji:"06", modes:[6,7],                goal:1500,     shiftEvery:14,   scrollBase:4.92, platWMul:0.9, gapMul:1.2,  lives:3, desc:"Near zero-G chaos"           },
  { id:7,  name:"Chaos Begins",     emoji:"07", modes:[0,1,2,3],            goal:1800,     shiftEvery:13,   scrollBase:5.40, platWMul:0.8, gapMul:1.35, lives:2, desc:"4 modes in the mix!"         },
  { id:8,  name:"Speed Run",        emoji:"08", modes:[0,2,4,5,6],          goal:2100,     shiftEvery:11,   scrollBase:6.00, platWMul:0.7, gapMul:1.5,  lives:2, desc:"Fast and furious"            },
  { id:9,  name:"Almost There",     emoji:"09", modes:[0,1,2,3,4,5],        goal:2500,     shiftEvery:10,   scrollBase:6.72, platWMul:0.6, gapMul:1.65, lives:2, desc:"All modes, tiny platforms"   },
  { id:10, name:"PHYSICSSS MASTER", emoji:"10", modes:[0,1,2,3,4,5,6,7],   goal:3000,     shiftEvery:8,    scrollBase:7.44, platWMul:0.5, gapMul:1.8,  lives:1, desc:"No mercy. Full chaos."       },

  // ── Endless mode — unlocks after completing level 10 ──────────────────────
  // goal: Infinity means the win condition is never triggered.
  // lives: 1 — one strike and you're scored.
  { id:11, name:"ENDLESS",          emoji:"∞",  modes:[0,1,2,3,4,5,6,7],   goal:Infinity, shiftEvery:7,    scrollBase:7.44, platWMul:0.5, gapMul:1.8,  lives:1, desc:"Survive as long as you can"  },
];

/** Convenience index of the endless level in the LEVELS array. */
export const ENDLESS_IDX = 10;
