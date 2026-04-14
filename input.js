// ─────────────────────────────────────────────
//  input.js  —  Centralised input handling.
//
//  All raw DOM events are captured here.
//  The rest of the game reads clean state via
//  the exported snapshot objects — never touches
//  event objects directly.
// ─────────────────────────────────────────────

import { HUD, CANVAS } from './constants.js';

// ── Raw key state ──────────────────────────────────────────────
const _keys = {};

// ── Mouse / touch state ────────────────────────────────────────
export const mouse = { x: 0, y: 0 };

// ── Action callbacks registered by game.js ────────────────────
//  (avoids circular imports — game registers handlers, not DOM)
const _handlers = {
  onJump        : null,
  onPause       : null,   // ESC while playing
  onResume      : null,   // ESC while paused
  onBack        : null,   // ESC in other screens
  onCardClick   : null,   // (index) => void
  onMenuClick   : null,
  onPauseBtn    : null,   // (action) => void
  onTouchJump   : null,
};

/** Register a named handler. Call from game.js init(). */
export function on(event, fn) {
  if (event in _handlers) _handlers[event] = fn;
}

// ── Hovering state ─────────────────────────────────────────────
export const hovered = { card: -1, pauseBtn: -1 };

// ── Key helpers (exported for physics / player movement) ───────
export function isLeft()  { return !!(_keys['ArrowLeft']  || _keys['KeyA']); }
export function isRight() { return !!(_keys['ArrowRight'] || _keys['KeyD']); }

// ── Canvas reference (set at init) ────────────────────────────
let _canvas = null;
let _getState = null;   // () => current game state string

/**
 * Attach all event listeners.
 * @param {HTMLCanvasElement} canvas
 * @param {() => string} getState   - getter for current game state
 * @param {(i:number) => {x,y,w,h}} cardRect
 * @param {(i:number) => {x,y,w,h}} pauseBtnRect
 */
export function init(canvas, getState, cardRect, pauseBtnRect) {
  _canvas   = canvas;
  _getState = getState;

  // ── Keyboard ────────────────────────────────────────────────
  window.addEventListener('keydown', e => {
    _keys[e.code] = true;
    const st = _getState();

    if (e.code === 'Escape') {
      if      (st === 'playing')     _handlers.onPause?.();
      else if (st === 'paused')      _handlers.onResume?.();
      else                           _handlers.onBack?.();
      e.preventDefault();
      return;
    }

    if (['Space','ArrowUp','KeyW'].includes(e.code)) {
      if      (st === 'playing')                                          _handlers.onJump?.();
      else if (st === 'paused')                                           _handlers.onResume?.();
      else if (st === 'menu')                                             _handlers.onMenuClick?.();
      else if (st === 'dead')                                             _handlers.onJump?.();
      else if (st === 'levelComplete' || st === 'gameover'
            || st === 'endlessOver')                                      _handlers.onBack?.();
      e.preventDefault();
    }

    if (['ArrowLeft','ArrowRight','ArrowDown','KeyA','KeyD','KeyS'].includes(e.code))
      e.preventDefault();
  });

  window.addEventListener('keyup', e => { _keys[e.code] = false; });

  // Prevent sticky keys when tab loses focus
  window.addEventListener('blur', () => {
    for (const k in _keys) _keys[k] = false;
  });

  // ── Mouse move — update coordinates & hover state ───────────
  canvas.addEventListener('mousemove', e => {
    const { mx, my } = _toCanvas(e.clientX, e.clientY);
    mouse.x = mx;
    mouse.y = my;

    hovered.card     = -1;
    hovered.pauseBtn = -1;
    const st = _getState();

    if (st === 'levelSelect') {
      for (let i = 0; i < 11; i++) {  // 11 = 10 levels + 1 endless card
        const c = cardRect(i);
        if (_inRect(mx, my, c)) { hovered.card = i; break; }
      }
    }
    if (st === 'paused') {
      for (let i = 0; i < 3; i++) {
        const b = pauseBtnRect(i);
        if (_inRect(mx, my, b)) { hovered.pauseBtn = i; break; }
      }
    }
  });

  // ── Mouse click ─────────────────────────────────────────────
  canvas.addEventListener('click', e => {
    const { mx, my } = _toCanvas(e.clientX, e.clientY);
    const st = _getState();

    if (st === 'paused') {
      for (let i = 0; i < 3; i++) {
        if (_inRect(mx, my, pauseBtnRect(i))) { _handlers.onPauseBtn?.(i); return; }
      }
      return;
    }

    if (st === 'menu')                                                   { _handlers.onMenuClick?.(); return; }
    if (st === 'gameover' || st === 'levelComplete' || st === 'endlessOver') { _handlers.onBack?.();     return; }

    if (st === 'levelSelect') {
      for (let i = 0; i < 11; i++) {  // 11 = 10 levels + 1 endless card
        if (_inRect(mx, my, cardRect(i))) { _handlers.onCardClick?.(i); return; }
      }
      // "Back to menu" button
      const bx = CANVAS.MAX_WIDTH - 130, by = CANVAS.HEIGHT - 40;
      if (mx >= bx && mx <= bx + 110 && my >= by && my <= by + 26) _handlers.onBack?.();
    }
  });

  // ── Touch ───────────────────────────────────────────────────
  let touchStartX = 0;

  canvas.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    const { mx, my } = _toCanvas(e.touches[0].clientX, e.touches[0].clientY);
    const st = _getState();

    if (st === 'paused') {
      for (let i = 0; i < 3; i++) {
        if (_inRect(mx, my, pauseBtnRect(i))) { _handlers.onPauseBtn?.(i); return; }
      }
      return;
    }
    if (st === 'menu')                                                       { _handlers.onMenuClick?.(); return; }
    if (st === 'gameover' || st === 'levelComplete' || st === 'endlessOver') { _handlers.onBack?.();     return; }
    if (st === 'dead')                                                       { _handlers.onJump?.();      return; }
    if (st === 'levelSelect') {
      for (let i = 0; i < 11; i++) {  // 11 = 10 levels + 1 endless card
        if (_inRect(mx, my, cardRect(i))) { _handlers.onCardClick?.(i); return; }
      }
      return;
    }
    if (st === 'playing') _handlers.onTouchJump?.();
  }, { passive: true });

  canvas.addEventListener('touchmove', e => {
    const dx = e.touches[0].clientX - touchStartX;
    _keys['ArrowRight'] = dx >  20;
    _keys['ArrowLeft']  = dx < -20;
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    _keys['ArrowLeft']  = false;
    _keys['ArrowRight'] = false;
  }, { passive: true });
}

// ── Private helpers ────────────────────────────────────────────

function _toCanvas(clientX, clientY) {
  const rect = _canvas.getBoundingClientRect();
  const W = _canvas.width, H = _canvas.height;
  return {
    mx: (clientX - rect.left) * (W / rect.width),
    my: (clientY - rect.top)  * (H / rect.height),
  };
}

function _inRect(mx, my, r) {
  return mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h;
}
