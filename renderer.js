// ─────────────────────────────────────────────
//  renderer.js  —  Canvas draw calls.
//
//  Every draw function receives the data it
//  needs as arguments — no global reads.
//  Organised into sections:
//    Primitives · Gameplay · HUD · Screens · Cursor
// ─────────────────────────────────────────────

import { HUD, CURSOR, CANVAS } from './constants.js';
import { MODES, LEVELS, ENDLESS_IDX } from './levels.js';
import { POWERUP_DEFS } from './powerups.js';
import { BG_STARS } from './backgrounds.js';

// ─────────────────────────────────────────────────────────────
//  Primitives
// ─────────────────────────────────────────────────────────────

/** Rounded rectangle path helper. */
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x,     y + r);
  ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
}

// ─────────────────────────────────────────────────────────────
//  Geometry helpers (shared with input.js via game.js)
// ─────────────────────────────────────────────────────────────

/**
 * Return the bounding rect for a level-select card.
 * Index 10 (ENDLESS_IDX) is a special wide banner below the 2×5 grid.
 */
export function cardRect(i, W) {
  const cols  = HUD.GRID_COLS;
  const gridW = cols * HUD.CARD_W + (cols - 1) * HUD.CARD_PAD;
  const gridX = (W - gridW) / 2;

  if (i === ENDLESS_IDX) {
    // Wide banner card sits below the two normal rows
    const bannerY = HUD.CARD_GRID_Y + 2 * (HUD.CARD_H + HUD.CARD_PAD);
    return { x: gridX, y: bannerY, w: gridW, h: 52 };
  }

  const col  = i % cols;
  const row  = Math.floor(i / cols);
  return {
    x: gridX + col * (HUD.CARD_W + HUD.CARD_PAD),
    y: HUD.CARD_GRID_Y + row * (HUD.CARD_H + HUD.CARD_PAD),
    w: HUD.CARD_W,
    h: HUD.CARD_H,
  };
}

export function pauseBtnRect(i, W, H) {
  return {
    x: W / 2 - HUD.PAUSE_BTN_W / 2,
    y: H / 2 - 18 + i * (HUD.PAUSE_BTN_H + HUD.PAUSE_BTN_GAP),
    w: HUD.PAUSE_BTN_W,
    h: HUD.PAUSE_BTN_H,
  };
}

// ─────────────────────────────────────────────────────────────
//  Gameplay elements
// ─────────────────────────────────────────────────────────────

export function drawPlatforms(ctx, platforms, mode) {
  for (const p of platforms) {
    ctx.shadowBlur  = 14;
    ctx.shadowColor = mode.color;
    const g = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
    g.addColorStop(0, mode.color + 'ff');
    g.addColorStop(1, mode.color + '33');
    ctx.fillStyle = g;
    rr(ctx, p.x, p.y, p.w, p.h, 3);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export function drawPlayer(ctx, player, mode) {
  // Trail
  for (let i = 0; i < player.trail.length; i++) {
    const pt = player.trail[i];
    const a  = i / player.trail.length;
    const s  = a * player.w * 0.75;
    ctx.fillStyle = mode.color + Math.floor(a * 80).toString(16).padStart(2, '0');
    ctx.fillRect(pt.x - s/2, pt.y - s/2, s, s);
  }
  // Body
  ctx.shadowBlur  = 22;
  ctx.shadowColor = mode.color;
  ctx.fillStyle   = mode.color;
  rr(ctx, player.x, player.y, player.w, player.h, 5);
  ctx.fill();
  ctx.shadowBlur = 0;
}

export function drawParticles(ctx, particles) {
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle   = p.col;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

export function drawShards(ctx, shards) {
  for (const s of shards) {
    ctx.globalAlpha  = Math.max(0, s.life);
    ctx.shadowBlur   = s.life > 0.5 ? 18 : 6;
    ctx.shadowColor  = s.col;
    ctx.fillStyle    = s.col + Math.floor(s.life * 180).toString(16).padStart(2, '0');
    ctx.strokeStyle  = s.col;
    ctx.lineWidth    = 1.2;
    ctx.beginPath();
    ctx.moveTo(s.pts[0].x, s.pts[0].y);
    for (let i = 1; i < s.pts.length; i++) ctx.lineTo(s.pts[i].x, s.pts[i].y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;
}

export function drawPowerupItems(ctx, items) {
  const t = performance.now() / 1000;
  for (const pw of items) {
    const def   = POWERUP_DEFS[pw.type];
    const bob   = Math.sin(pw.bobT) * 6;
    const cx    = pw.x;
    const cy    = pw.y + bob;
    const pulse = 1 + 0.14 * Math.sin(t * 5);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(pw.angle * 0.4);

    // Outer ring
    ctx.shadowBlur  = 22; ctx.shadowColor = def.color;
    ctx.strokeStyle = def.color; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a  = (i / 6) * Math.PI * 2;
      const a2 = ((i + 0.5) / 6) * Math.PI * 2;
      i === 0
        ? ctx.moveTo(Math.cos(a) * 22 * pulse, Math.sin(a) * 22 * pulse)
        : ctx.lineTo(Math.cos(a) * 22 * pulse, Math.sin(a) * 22 * pulse);
      ctx.lineTo(Math.cos(a2) * 14 * pulse, Math.sin(a2) * 14 * pulse);
    }
    ctx.closePath(); ctx.stroke();

    // Diamond fill
    const grd = ctx.createRadialGradient(0,-4,1,0,0,13);
    grd.addColorStop(0,'#ffffff');
    grd.addColorStop(0.3, def.color);
    grd.addColorStop(1, def.bg || '#000022');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(0,-13); ctx.lineTo(11,0); ctx.lineTo(0,13); ctx.lineTo(-11,0);
    ctx.closePath(); ctx.fill();

    // Icon
    ctx.shadowBlur = 0; ctx.font = 'bold 11px "Courier New"';
    ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff';
    ctx.fillText(def.icon, 0, 4);
    ctx.restore();

    // Label
    ctx.font = '9px "Courier New"'; ctx.textAlign = 'center';
    ctx.fillStyle = def.color; ctx.shadowBlur = 6; ctx.shadowColor = def.color;
    ctx.fillText(def.label, cx, cy + 30);
    ctx.shadowBlur = 0;
  }
}

// ─────────────────────────────────────────────────────────────
//  HUD
// ─────────────────────────────────────────────────────────────

export function drawHUD(ctx, W, H, { mode, modeTimer, levelIdx, score, lives, distance, activePowerup }) {
  const t      = performance.now() / 1000;
  const lvl    = LEVELS[levelIdx];
  const isEndless = lvl.goal === Infinity;
  const WARN   = HUD.WARN_THRESHOLD;
  const imm    = lvl.shiftEvery < 9999 && modeTimer < WARN;
  const urg    = imm ? Math.max(0, 1 - modeTimer / WARN) : 0;
  const pulseHz= HUD.PULSE_HZ_MIN + urg * (HUD.PULSE_HZ_MAX - HUD.PULSE_HZ_MIN);
  const pulse  = imm ? 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * pulseHz) : 1;
  const breathe= imm ? 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * (pulseHz * 0.5)) : 0;

  // Vignette flash
  if (imm) {
    const vigA = urg * HUD.VIGNETTE_ALPHA * breathe;
    const vig  = ctx.createRadialGradient(W/2,H/2,H*0.28,W/2,H/2,H*0.78);
    vig.addColorStop(0,'rgba(0,0,0,0)');
    vig.addColorStop(1, mode.color + Math.floor(vigA * 255).toString(16).padStart(2,'0'));
    ctx.fillStyle = vig; ctx.fillRect(0,0,W,H);
  }

  // Timer bar
  const barH = imm ? HUD.BAR_H_WARN : HUD.BAR_H;
  const bx = HUD.BAR_X, by = HUD.BAR_Y - (barH - HUD.BAR_H) / 2, bw = W - HUD.BAR_X * 2;

  ctx.fillStyle = '#ffffff0d';
  rr(ctx, bx, by, bw, barH, 3); ctx.fill();

  if (lvl.shiftEvery < 9999) {
    const ratio    = Math.max(0, modeTimer / lvl.shiftEvery);
    const barColor = imm ? `rgba(255,255,255,${0.55 + pulse * 0.45})` : mode.color;
    if (imm) { ctx.shadowBlur = 6 + urg * 18 * breathe; ctx.shadowColor = mode.color; }
    ctx.fillStyle = barColor;
    rr(ctx, bx, by, bw * ratio, barH, 3); ctx.fill();
    ctx.shadowBlur = 0;

    if (ratio > 0.01) {
      ctx.fillStyle = imm ? `rgba(255,255,255,${pulse})` : `${mode.color}cc`;
      ctx.fillRect(bx + bw * ratio - 2, by, 2, barH);
    }

    if (imm) {
      ctx.globalAlpha = Math.min(1, urg * 3) * pulse;
      ctx.font = `bold ${11 + Math.floor(urg*3)}px "Courier New"`;
      ctx.textAlign   = 'center'; ctx.fillStyle = '#ffffff';
      ctx.shadowBlur  = 10; ctx.shadowColor = mode.color;
      ctx.fillText('SHIFT IN ' + modeTimer.toFixed(1) + 's', W/2, by - 4);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
  }

  // Score / lives
  ctx.font      = 'bold 15px "Courier New"';
  ctx.textAlign = 'left';
  ctx.fillStyle = imm ? `rgba(255,255,255,${0.7 + pulse*0.3})` : '#ffffff';

  if (isEndless) {
    ctx.fillText('∞  ' + score + ' pts', 22, 44);
  } else {
    ctx.fillText('LV' + lvl.id + '  ' + score + ' / ' + lvl.goal, 22, 44);
  }

  ctx.textAlign = 'right';
  if (imm) { ctx.shadowBlur = 6 * breathe; ctx.shadowColor = mode.color; }
  ctx.fillText('♥️'.repeat(Math.max(0, lives)), W - 22, 44);
  ctx.shadowBlur = 0;

  // Goal progress bar — omitted for endless; show a subtle distance ticker instead
  if (!isEndless) {
    const pr = Math.min(1, distance / (lvl.goal * 10));
    ctx.fillStyle = '#ffffff09'; rr(ctx, 20, H-18, W-40, 5, 2); ctx.fill();
    ctx.fillStyle = mode.color + '99'; rr(ctx, 20, H-18, (W-40)*pr, 5, 2); ctx.fill();
    ctx.font = '10px "Courier New"'; ctx.textAlign = 'right'; ctx.fillStyle = mode.color + '88';
    ctx.fillText('GOAL ' + Math.floor(pr*100) + '%', W - 22, H - 22);
  } else {
    // Endless: show a slow-moving "distance" pulse bar as ambient decoration
    const tick = (performance.now() / 1000) % 4 / 4;
    ctx.fillStyle = mode.color + '18'; rr(ctx, 20, H-18, W-40, 5, 2); ctx.fill();
    ctx.fillStyle = mode.color + '55'; rr(ctx, 20, H-18, (W-40)*tick, 5, 2); ctx.fill();
    ctx.font = '10px "Courier New"'; ctx.textAlign = 'right'; ctx.fillStyle = mode.color + '66';
    ctx.fillText('∞  ENDLESS', W - 22, H - 22);
  }

  // Pause hint
  ctx.font = '10px "Courier New"'; ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff22';
  ctx.fillText('ESC = PAUSE', 22, H - 22);

  // Active powerup
  drawActivePowerupHUD(ctx, W, H, activePowerup, t);
}

function drawActivePowerupHUD(ctx, W, H, activePowerup, t) {
  if (!activePowerup.type) return;
  const def   = POWERUP_DEFS[activePowerup.type];
  const ratio = Math.max(0, activePowerup.timer / activePowerup.maxTimer);
  const bx = W/2 - 90, by = H - 52, bw = 180, bh = 28;

  ctx.globalAlpha = 0.88;
  ctx.fillStyle   = def.bg || '#001122';
  rr(ctx, bx, by, bw, bh, 6); ctx.fill();
  ctx.strokeStyle = def.color; ctx.lineWidth = 1.5;
  ctx.shadowBlur  = 10; ctx.shadowColor = def.color;
  rr(ctx, bx, by, bw, bh, 6); ctx.stroke();
  ctx.shadowBlur  = 0; ctx.globalAlpha = 1;

  ctx.fillStyle = def.color + '55';
  rr(ctx, bx+4, by+bh-8, bw-8, 5, 2); ctx.fill();
  ctx.fillStyle = def.color;
  if (ratio > 0) { rr(ctx, bx+4, by+bh-8, (bw-8)*ratio, 5, 2); ctx.fill(); }

  ctx.font = 'bold 13px "Courier New"'; ctx.textAlign = 'center';
  const pulse = activePowerup.timer < 1 ? (Math.sin(t*12) > 0 ? 1 : 0.3) : 1;
  ctx.globalAlpha = pulse;
  ctx.fillStyle   = def.color;
  ctx.shadowBlur  = 8; ctx.shadowColor = def.color;
  ctx.fillText(def.icon + ' ' + def.label + ' ' + activePowerup.timer.toFixed(1) + 's', W/2, by + 16);
  ctx.shadowBlur  = 0; ctx.globalAlpha = 1;
}

export function drawModeAnnounce(ctx, W, H, mode, announceTimer) {
  if (announceTimer <= 0) return;
  ctx.fillStyle = '#000000bb';
  ctx.fillRect(0, H/2 - 52, W, 74);
  ctx.font      = 'bold 52px "Courier New"'; ctx.textAlign = 'center'; ctx.fillStyle = mode.color;
  ctx.fillText(mode.name, W/2, H/2 + 6);
  ctx.font      = '13px "Courier New"'; ctx.fillStyle = '#aaaaaa';
  ctx.fillText(mode.desc, W/2, H/2 + 26);
}

export function drawFlash(ctx, W, H, mode, flashAlpha) {
  if (flashAlpha <= 0) return;
  ctx.globalAlpha = flashAlpha * 0.28;
  ctx.fillStyle   = mode.color;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;
}

export function drawPowerupAnnounce(ctx, W, H, announce) {
  if (!announce.type || announce.timer <= 0) return;
  const def  = POWERUP_DEFS[announce.type];
  const af   = Math.min(1, announce.timer);
  ctx.globalAlpha = af;
  ctx.fillStyle   = '#000000cc';
  ctx.fillRect(0, H/2 - 100, W, 52);
  ctx.font       = 'bold 28px "Courier New"'; ctx.textAlign = 'center';
  ctx.fillStyle  = def.color;
  ctx.shadowBlur = 20; ctx.shadowColor = def.color;
  ctx.fillText('⚡ ' + def.label + ' ACTIVATED!', W/2, H/2 - 76);
  ctx.font = '12px "Courier New"'; ctx.fillStyle = '#aaaaaa'; ctx.shadowBlur = 0;
  ctx.fillText(def.desc + ' (' + def.dur + 's)', W/2, H/2 - 56);
  ctx.globalAlpha = 1;
}

// ─────────────────────────────────────────────────────────────
//  Screens
// ─────────────────────────────────────────────────────────────

export function drawStarBg(ctx, W, H) {
  ctx.fillStyle = '#030308'; ctx.fillRect(0,0,W,H);
  for (const s of BG_STARS) {
    ctx.fillStyle = `rgba(255,255,255,${s.a * 0.35})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
  }
}

export function drawMenu(ctx, W, H, bestScore) {
  drawStarBg(ctx, W, H);
  ctx.textAlign  = 'center';
  ctx.shadowBlur = 28; ctx.shadowColor = '#00ff88';
  ctx.font       = 'bold 88px "Courier New"'; ctx.fillStyle = '#00ff88';
  ctx.fillText('PHYSICSSS', W/2, H/2 - 38);
  ctx.shadowBlur = 0;
  ctx.font       = '16px "Courier New"'; ctx.fillStyle = '#888888';
  ctx.fillText('Physics chaos platformer — 10 levels + endless', W/2, H/2 + 18);
  ctx.font       = '13px "Courier New"'; ctx.fillStyle = '#444444';
  ctx.fillText('CLICK or SPACE to select a level', W/2, H/2 + 60);
  if (bestScore > 0) {
    ctx.fillStyle = '#00ff8833'; ctx.font = '12px "Courier New"';
    ctx.fillText('BEST  ' + bestScore, W/2, H/2 + 90);
  }
  ctx.font = '11px "Courier New"'; ctx.fillStyle = '#555555';
  ctx.fillText('Developed by an IITian', W/2, H - 18);
}

export function drawLevelSelect(ctx, W, H, { unlockedLevel, completedLevels, levelStars, hoveredCard, endlessScores = [] }) {
  drawStarBg(ctx, W, H);
  ctx.textAlign = 'center';
  ctx.font = 'bold 24px "Courier New"'; ctx.fillStyle = '#ffffff';
  ctx.fillText('SELECT LEVEL', W/2, 62);
  ctx.font = '11px "Courier New"'; ctx.fillStyle = '#333333';
  ctx.fillText('click to play  ·  ESC to go back', W/2, 82);

  // ── Normal levels 1–10 ─────────────────────────────────────
  for (let i = 0; i < 10; i++) {
    const lvl    = LEVELS[i];
    const c      = cardRect(i, W);
    const locked = (i + 1) > unlockedLevel;
    const done   = completedLevels.has(i + 1);
    const hov    = hoveredCard === i && !locked;
    const mc     = MODES[lvl.modes[0]].color;

    ctx.globalAlpha = locked ? 0.38 : hov ? 1 : 0.88;
    ctx.fillStyle   = locked ? '#0d0d0d' : '#080814';
    rr(ctx, c.x, c.y, c.w, c.h, 8); ctx.fill();

    ctx.strokeStyle = locked ? '#2a2a2a' : done ? '#00ff88' : mc;
    ctx.lineWidth   = hov ? 2.5 : 1.2;
    if (hov) { ctx.shadowBlur = 16; ctx.shadowColor = mc; }
    rr(ctx, c.x, c.y, c.w, c.h, 8); ctx.stroke();
    ctx.shadowBlur = 0;

    if (locked) {
      ctx.globalAlpha = 0.5;
      _drawLock(ctx, c.x + c.w/2, c.y + c.h/2 - 4);
      ctx.font = '11px "Courier New"'; ctx.fillStyle = '#444'; ctx.textAlign = 'center';
      ctx.fillText('LEVEL ' + lvl.id, c.x + c.w/2, c.y + c.h - 14);
    } else {
      ctx.globalAlpha = 1;
      ctx.font = 'bold 12px "Courier New"'; ctx.textAlign = 'left'; ctx.fillStyle = mc;
      ctx.fillText('LV ' + lvl.id, c.x + 10, c.y + 20);
      if (done) drawStarsRow(ctx, c.x + c.w - 38, c.y + 13, 3, levelStars[i+1] || 0, 9);
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 14px "Courier New"'; ctx.textAlign = 'center';
      ctx.fillText(lvl.name, c.x + c.w/2, c.y + 50);
      ctx.fillStyle = '#888888'; ctx.font = '11px "Courier New"';
      ctx.fillText(lvl.desc, c.x + c.w/2, c.y + 72);
      ctx.fillStyle = '#ff4455'; ctx.font = '13px "Courier New"';
      ctx.fillText('♥️'.repeat(lvl.lives), c.x + c.w/2, c.y + 96);
      const cw2 = 16, tot = lvl.modes.length;
      const sx2 = c.x + c.w/2 - (tot * (cw2 + 3)) / 2;
      for (let mi = 0; mi < tot; mi++) {
        ctx.fillStyle = MODES[lvl.modes[mi]].color + '88';
        ctx.fillRect(sx2 + mi * (cw2 + 3), c.y + c.h - 20, cw2, 7);
      }
    }
    ctx.globalAlpha = 1;
  }

  // ── Endless banner card (index 10) ─────────────────────────
  _drawEndlessCard(ctx, W, H, { unlockedLevel, hoveredCard, endlessScores });

  // Back button
  const bx = W - 130, by = H - 38, bw = 108, bh = 24;
  ctx.fillStyle = '#1a1a1a'; rr(ctx, bx, by, bw, bh, 5); ctx.fill();
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1; rr(ctx, bx, by, bw, bh, 5); ctx.stroke();
  ctx.font = '11px "Courier New"'; ctx.textAlign = 'center'; ctx.fillStyle = '#666';
  ctx.fillText('< BACK TO MENU', bx + bw/2, by + bh/2 + 4);
}

/** Renders the wide ENDLESS banner card in the level-select screen. */
function _drawEndlessCard(ctx, W, H, { unlockedLevel, hoveredCard, endlessScores }) {
  const c        = cardRect(ENDLESS_IDX, W);
  const locked   = unlockedLevel < 11;
  const hov      = hoveredCard === ENDLESS_IDX && !locked;
  const bestScore= endlessScores.length > 0 ? endlessScores[0].score : null;

  ctx.globalAlpha = locked ? 0.40 : hov ? 1 : 0.90;

  // Background
  ctx.fillStyle = locked ? '#0d0d0d' : '#0f0800';
  rr(ctx, c.x, c.y, c.w, c.h, 8); ctx.fill();

  // Border — gold gradient when unlocked
  if (locked) {
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth   = 1.2;
  } else {
    ctx.strokeStyle = hov ? '#ffdd00' : '#ffaa0066';
    ctx.lineWidth   = hov ? 2.5 : 1.5;
    if (hov) { ctx.shadowBlur = 22; ctx.shadowColor = '#ffaa00'; }
  }
  rr(ctx, c.x, c.y, c.w, c.h, 8); ctx.stroke();
  ctx.shadowBlur = 0;

  if (locked) {
    // Locked state
    _drawLock(ctx, c.x + 36, c.y + c.h / 2);
    ctx.font = '13px "Courier New"'; ctx.textAlign = 'left'; ctx.fillStyle = '#555555';
    ctx.fillText('∞  ENDLESS MODE  —  complete all 10 levels to unlock', c.x + 58, c.y + c.h / 2 + 5);
  } else {
    // Title
    ctx.font = 'bold 17px "Courier New"'; ctx.textAlign = 'left';
    ctx.fillStyle   = '#ffdd00';
    ctx.shadowBlur  = hov ? 12 : 0; ctx.shadowColor = '#ffdd00';
    ctx.fillText('∞  ENDLESS MODE', c.x + 16, c.y + 20);
    ctx.shadowBlur = 0;

    // Description
    ctx.font = '11px "Courier New"'; ctx.fillStyle = '#888888';
    ctx.fillText('All 8 physics modes  ·  1 life  ·  survive as long as you can', c.x + 16, c.y + 39);

    // Mode colour pips
    const pip = 14, gap = 4;
    const pipX = c.x + 16;
    for (let mi = 0; mi < 8; mi++) {
      ctx.fillStyle = MODES[mi].color + '99';
      ctx.fillRect(pipX + mi * (pip + gap), c.y + c.h - 14, pip, 6);
    }

    // Best score (top-right)
    if (bestScore !== null) {
      ctx.font = '11px "Courier New"'; ctx.textAlign = 'right';
      ctx.fillStyle = '#ffaa00';
      ctx.fillText('BEST  ' + bestScore, c.x + c.w - 14, c.y + 20);

      if (endlessScores.length > 1) {
        ctx.fillStyle = '#555555';
        ctx.fillText('#2  ' + endlessScores[1].score, c.x + c.w - 14, c.y + 36);
      }
    } else {
      ctx.font = '11px "Courier New"'; ctx.textAlign = 'right';
      ctx.fillStyle = '#444444';
      ctx.fillText('no runs yet', c.x + c.w - 14, c.y + 20);
    }
  }

  ctx.globalAlpha = 1;
  ctx.textAlign   = 'left';
}

export function drawPaused(ctx, W, H, { mode, levelIdx, score, lives, hoveredBtn }) {
  const lvl    = LEVELS[levelIdx];
  const pw     = 340, ph = 260, px = W/2 - pw/2, py = H/2 - ph/2 - 10;
  const LABELS = ['RESUME', 'RESTART LEVEL', 'QUIT TO MENU'];
  const COLORS = [mode.color, '#ff9900', '#ff3355'];

  // Dark overlay
  ctx.fillStyle = 'rgba(0,0,0,0.72)'; ctx.fillRect(0,0,W,H);

  // Scan lines
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 1;
  for (let y = 0; y < H; y += 4) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  // Panel
  ctx.fillStyle = '#0a0a14ee'; rr(ctx, px, py, pw, ph, 14); ctx.fill();
  ctx.strokeStyle = mode.color + '88'; ctx.lineWidth = 1.5;
  ctx.shadowBlur  = 18; ctx.shadowColor = mode.color;
  rr(ctx, px, py, pw, ph, 14); ctx.stroke();
  ctx.shadowBlur  = 0;

  // Corner accents
  const al = 18; ctx.strokeStyle = mode.color; ctx.lineWidth = 2;
  [[px,py],[px+pw,py],[px,py+ph],[px+pw,py+ph]].forEach(([cx,cy],i) => {
    const sx = i%2===0?1:-1, sy = i<2?1:-1;
    ctx.beginPath(); ctx.moveTo(cx+sx*al,cy); ctx.lineTo(cx,cy); ctx.lineTo(cx,cy+sy*al); ctx.stroke();
  });

  // Title
  ctx.textAlign  = 'center'; ctx.font = 'bold 34px "Courier New"';
  ctx.fillStyle  = mode.color; ctx.shadowBlur = 14; ctx.shadowColor = mode.color;
  ctx.fillText('PAUSED', W/2, py + 50);
  ctx.shadowBlur = 0;

  // Info strip
  const lvlLabel = lvl.goal === Infinity ? '∞ ENDLESS' : 'LV' + lvl.id + ' · ' + lvl.name;
  ctx.font = '11px "Courier New"'; ctx.fillStyle = '#555566';
  ctx.fillText(lvlLabel + '  |  ' + score + ' pts  |  ' + '♥️'.repeat(Math.max(0,lives)), W/2, py + 72);

  // Divider
  ctx.strokeStyle = mode.color + '33'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(px+24, py+84); ctx.lineTo(px+pw-24, py+84); ctx.stroke();

  // Buttons
  LABELS.forEach((label, i) => {
    const b   = pauseBtnRect(i, W, H);
    const hov = hoveredBtn === i;
    const col = COLORS[i];
    ctx.fillStyle   = hov ? col + '28' : '#11111e';
    rr(ctx, b.x, b.y, b.w, b.h, HUD.PAUSE_BTN_R); ctx.fill();
    ctx.strokeStyle = hov ? col : col + '55';
    ctx.lineWidth   = hov ? 1.8 : 1;
    if (hov) { ctx.shadowBlur = 12; ctx.shadowColor = col; }
    rr(ctx, b.x, b.y, b.w, b.h, HUD.PAUSE_BTN_R); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.font = 'bold 13px "Courier New"'; ctx.fillStyle = hov ? col : col + 'aa';
    ctx.textAlign = 'center';
    ctx.fillText(label, b.x + b.w/2, b.y + b.h/2 + 5);
  });

  ctx.font = '10px "Courier New"'; ctx.fillStyle = '#333344'; ctx.textAlign = 'center';
  ctx.fillText('ESC or SPACE to resume', W/2, py + ph - 12);
}

export function drawDead(ctx, W, H, lives) {
  ctx.fillStyle = '#000000aa'; ctx.fillRect(0, H/2 - 68, W, 118);
  ctx.textAlign = 'center';
  ctx.font = 'bold 48px "Courier New"'; ctx.fillStyle = '#ff3355';
  ctx.fillText('YOU DIED', W/2, H/2 - 12);
  ctx.font = '13px "Courier New"'; ctx.fillStyle = '#777777';
  ctx.fillText('Lives left: ' + '♥️'.repeat(Math.max(0, lives)), W/2, H/2 + 18);
  ctx.fillText('SPACE / TAP to respawn  ·  ESC to quit', W/2, H/2 + 42);
}

export function drawGameOver(ctx, W, H, { levelIdx, score }) {
  drawStarBg(ctx, W, H);
  const lvl = LEVELS[levelIdx];
  ctx.textAlign = 'center';
  ctx.font = 'bold 54px "Courier New"'; ctx.fillStyle = '#ff3355';
  ctx.fillText('GAME OVER', W/2, H/2 - 58);
  ctx.font = '16px "Courier New"'; ctx.fillStyle = '#888888';
  ctx.fillText('Level ' + lvl.id + ' — ' + lvl.name, W/2, H/2 - 18);
  ctx.font = 'bold 26px "Courier New"'; ctx.fillStyle = '#ffffff';
  ctx.fillText('SCORE  ' + score + ' / ' + lvl.goal, W/2, H/2 + 22);
  ctx.font = '13px "Courier New"'; ctx.fillStyle = '#444444';
  ctx.fillText('CLICK or SPACE — level select', W/2, H/2 + 68);
}

/**
 * Endless-run-over screen with top-10 leaderboard.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} W
 * @param {number} H
 * @param {{ score:number, endlessScores:Array, modeColor:string }} opts
 */
export function drawEndlessGameOver(ctx, W, H, { score, endlessScores, modeColor }) {
  drawStarBg(ctx, W, H);
  ctx.textAlign = 'center';

  // Title
  ctx.font = 'bold 50px "Courier New"'; ctx.fillStyle = '#ffaa00';
  ctx.shadowBlur = 22; ctx.shadowColor = '#ffaa00';
  ctx.fillText('∞ RUN OVER', W/2, 82);
  ctx.shadowBlur = 0;

  // Score
  ctx.font = 'bold 28px "Courier New"'; ctx.fillStyle = '#ffffff';
  ctx.fillText('SCORE  ' + score, W/2, 122);

  // Rank badge
  const rank = endlessScores.findIndex(e => e.score === score) + 1;
  if (rank >= 1 && rank <= 3) {
    const medals = ['🥇 NEW RECORD!', '🥈 TOP 3!', '🥉 TOP 3!'];
    ctx.font = '15px "Courier New"'; ctx.fillStyle = '#ffdd00';
    ctx.fillText(medals[rank - 1], W/2, 148);
  } else if (rank >= 4 && rank <= 10) {
    ctx.font = '14px "Courier New"'; ctx.fillStyle = '#8cb4ff';
    ctx.fillText('TOP 10 — Rank #' + rank, W/2, 148);
  }

  // Leaderboard panel
  const lbW = 320, lbH = 176, lbX = W/2 - lbW/2, lbY = 166;

  ctx.fillStyle = '#08081a';
  rr(ctx, lbX, lbY, lbW, lbH, 10); ctx.fill();
  ctx.strokeStyle = '#ffaa0044'; ctx.lineWidth = 1.2;
  rr(ctx, lbX, lbY, lbW, lbH, 10); ctx.stroke();

  ctx.font = 'bold 11px "Courier New"'; ctx.fillStyle = '#ffaa00';
  ctx.textAlign = 'center';
  ctx.fillText('TOP 10  ALL-TIME', W/2, lbY + 18);

  // Divider
  ctx.strokeStyle = '#ffaa0033'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(lbX + 12, lbY + 26); ctx.lineTo(lbX + lbW - 12, lbY + 26);
  ctx.stroke();

  const maxShow = Math.min(endlessScores.length, 10);
  const rowH    = (lbH - 34) / 10;

  for (let i = 0; i < 10; i++) {
    const ry = lbY + 32 + i * rowH + rowH * 0.5;
    if (i < maxShow) {
      const entry   = endlessScores[i];
      const isNew   = entry.score === score && i === rank - 1;
      const rankCol = i === 0 ? '#ffdd00' : i === 1 ? '#aaaaaa' : i === 2 ? '#cd7f32' : '#445566';
      ctx.fillStyle = isNew ? '#ffffff' : rankCol;
      ctx.font      = isNew ? 'bold 11px "Courier New"' : '11px "Courier New"';
      ctx.textAlign = 'left';
      ctx.fillText('#' + (i + 1), lbX + 14, ry);
      ctx.textAlign = 'right';
      ctx.fillText(entry.score + ' pts', lbX + lbW - 80, ry);
      ctx.fillStyle = '#334';
      ctx.fillText(entry.date || '', lbX + lbW - 14, ry);
    } else {
      ctx.fillStyle = '#22223a'; ctx.font = '11px "Courier New"';
      ctx.textAlign = 'left';
      ctx.fillText('#' + (i + 1), lbX + 14, ry);
      ctx.textAlign = 'right'; ctx.fillStyle = '#222233';
      ctx.fillText('—', lbX + lbW - 14, ry);
    }
  }

  ctx.textAlign = 'center';
  ctx.font = '12px "Courier New"'; ctx.fillStyle = '#444444';
  ctx.fillText('CLICK or SPACE — back to level select', W/2, H - 24);
}

export function drawLevelComplete(ctx, W, H, { levelIdx, score, earnedStars, modeColor }) {
  drawStarBg(ctx, W, H);
  const lvl = LEVELS[levelIdx];
  ctx.textAlign  = 'center';
  ctx.shadowBlur = 26; ctx.shadowColor = modeColor;
  ctx.font = 'bold 50px "Courier New"'; ctx.fillStyle = modeColor;
  ctx.fillText('LEVEL CLEAR!', W/2, H/2 - 75);
  ctx.shadowBlur = 0;
  ctx.font = '18px "Courier New"'; ctx.fillStyle = '#ffffff';
  ctx.fillText(lvl.id + '. ' + lvl.name, W/2, H/2 - 36);
  drawStarsRow(ctx, W/2, H/2 + 2, 3, earnedStars, 28);
  ctx.font = 'bold 20px "Courier New"'; ctx.fillStyle = '#00ff88';
  ctx.fillText('SCORE  ' + score, W/2, H/2 + 48);
  const msg = earnedStars === 3 ? 'Perfect run! All lives intact!'
            : earnedStars === 2 ? 'Nice! Lost just one life.'
            :                     'You made it — can you do better?';
  ctx.font = '11px "Courier New"'; ctx.fillStyle = '#666666';
  ctx.fillText(msg, W/2, H/2 + 68);

  // Unlock message
  if (levelIdx + 1 < LEVELS.length) {
    const nextLvl  = LEVELS[levelIdx + 1];
    const isEndless = nextLvl.goal === Infinity;
    if (isEndless) {
      ctx.font = '14px "Courier New"';
      ctx.fillStyle = '#ffdd00';
      ctx.shadowBlur = 10; ctx.shadowColor = '#ffdd00';
      ctx.fillText('∞  ENDLESS MODE UNLOCKED!', W/2, H/2 + 90);
      ctx.shadowBlur = 0;
    } else {
      ctx.font = '13px "Courier New"'; ctx.fillStyle = '#8cb4ff';
      ctx.fillText('UNLOCKED: Level ' + (levelIdx+2) + ' — ' + nextLvl.name, W/2, H/2 + 90);
    }
  } else {
    ctx.font = '14px "Courier New"'; ctx.fillStyle = '#ffaa00';
    ctx.fillText('ALL LEVELS COMPLETE — PHYSICSSS MASTER!', W/2, H/2 + 90);
  }
  ctx.font = '12px "Courier New"'; ctx.fillStyle = '#444444';
  ctx.fillText('CLICK or SPACE — back to level select', W/2, H/2 + 116);
}

// ─────────────────────────────────────────────────────────────
//  Cursor
// ─────────────────────────────────────────────────────────────

let _cursorAngle = 0;
const _cursorTrail = [];

export function drawCursor(ctx, mouseX, mouseY, modeColor) {
  const col = modeColor || '#00ff88';
  const t   = performance.now() / 1000;

  _cursorTrail.push({ x: mouseX, y: mouseY });
  if (_cursorTrail.length > CURSOR.TRAIL_LEN) _cursorTrail.shift();

  // Trail
  for (let i = 0; i < _cursorTrail.length; i++) {
    const pt   = _cursorTrail[i];
    const frac = i / _cursorTrail.length;
    ctx.globalAlpha = frac * 0.25;
    ctx.fillStyle   = col;
    ctx.beginPath(); ctx.arc(pt.x, pt.y, frac * 4, 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  _cursorAngle += CURSOR.ROTATE_SPD;
  const pulse = 1 + 0.12 * Math.sin(t * 4);

  ctx.save();
  ctx.translate(mouseX, mouseY);

  // Glow halo
  const grd = ctx.createRadialGradient(0,0,CURSOR.INNER_R,0,0,CURSOR.OUTER_R*2.2);
  grd.addColorStop(0, col + '33');
  grd.addColorStop(1, col + '00');
  ctx.fillStyle = grd;
  ctx.beginPath(); ctx.arc(0,0,CURSOR.OUTER_R*2.2,0,Math.PI*2); ctx.fill();

  // Rotating arc segments
  ctx.save();
  ctx.rotate(_cursorAngle);
  ctx.shadowBlur = 10; ctx.shadowColor = col;
  ctx.strokeStyle = col; ctx.lineWidth = 1.8;
  const arcLen = (Math.PI*2 / CURSOR.SEGMENTS) * CURSOR.ARC_FRAC;
  for (let i = 0; i < CURSOR.SEGMENTS; i++) {
    const a = (i / CURSOR.SEGMENTS) * Math.PI * 2;
    ctx.beginPath(); ctx.arc(0, 0, CURSOR.OUTER_R * pulse, a, a + arcLen); ctx.stroke();
  }
  ctx.restore();

  // Inner counter-rotating arcs
  ctx.save();
  ctx.rotate(-_cursorAngle * 1.7);
  ctx.strokeStyle = col + 'aa'; ctx.lineWidth = 1; ctx.shadowBlur = 6; ctx.shadowColor = col;
  for (let i = 0; i < 2; i++) {
    const a = (i / 2) * Math.PI * 2;
    ctx.beginPath(); ctx.arc(0, 0, CURSOR.OUTER_R * 0.55 * pulse, a, a + 0.9); ctx.stroke();
  }
  ctx.restore();

  // Crosshair ticks
  ctx.shadowBlur = 8; ctx.shadowColor = col;
  ctx.strokeStyle = col + 'cc'; ctx.lineWidth = 1;
  const gap = 5, len = 9;
  ctx.beginPath(); ctx.moveTo(0,-gap); ctx.lineTo(0,-gap-len); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, gap); ctx.lineTo(0, gap+len); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-gap,0); ctx.lineTo(-gap-len,0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo( gap,0); ctx.lineTo( gap+len,0); ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
//  Stars row (shared between level-select and level-complete)
// ─────────────────────────────────────────────────────────────

export function drawStarsRow(ctx, cx, cy, count, earned, size = 22) {
  const gap    = size + 6;
  const startX = cx - (count - 1) * gap / 2;
  for (let i = 0; i < count; i++) {
    const filled = i < earned;
    const x = startX + i * gap, y = cy;
    ctx.save();
    ctx.shadowBlur  = filled ? 14 : 0;
    ctx.shadowColor = '#ffcc00';
    ctx.fillStyle   = filled ? '#ffcc00' : '#333344';
    ctx.strokeStyle = filled ? '#ffaa00' : '#444455';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    for (let p = 0; p < 5; p++) {
      const a1 = (p * 2 * Math.PI / 5) - Math.PI/2;
      const a2 = ((p + 0.5) * 2 * Math.PI / 5) - Math.PI/2;
      ctx[p === 0 ? 'moveTo' : 'lineTo'](x + Math.cos(a1)*size/2, y + Math.sin(a1)*size/2);
      ctx.lineTo(x + Math.cos(a2)*size/4, y + Math.sin(a2)*size/4);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
}

// ─────────────────────────────────────────────────────────────
//  Private helpers
// ─────────────────────────────────────────────────────────────

function _drawLock(ctx, cx, cy) {
  ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy-7, 6, Math.PI, 0); ctx.stroke();
  ctx.fillStyle = '#444'; ctx.fillRect(cx-7, cy-4, 14, 11);
  ctx.fillStyle = '#333'; ctx.fillRect(cx-1, cy-1, 2, 5);
}
