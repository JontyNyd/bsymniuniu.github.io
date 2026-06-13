#!/usr/bin/env node
/**
 * 加载 index.html 游戏脚本到 Node 环境（模拟 DOM + 定时器）
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const ELEMENT_IDS = [
  'app', 'fx-layer', 'title-screen', 'game-screen', 'title-bg-canvas', 'battle-bg',
  'enemy-panel', 'enemy-canvas-wrap', 'enemy-canvas', 'enemy-name', 'enemy-desc',
  'enemy-hp-bar', 'enemy-hp-text', 'enemy-hp-preview', 'enemy-intent', 'enemy-status', 'enemy-inspect', 'enemy-sparkle', 'slash-fx',
  'player-hp-bar', 'player-hp-text', 'spirit-text', 'spirit-bar', 'morale-text',
  'morale-bar', 'shield-stat', 'hand', 'hand-count', 'deck-info', 'deck-info-text',
  'stage-progress', 'stage-label', 'turn-counter', 'coins-display', 'battle-log',
  'fengshen-slots', 'slots-remaining', 'curse-warning', 'btn-end-turn', 'btn-sound',
  'btn-start', 'btn-continue', 'btn-story-ok', 'btn-result-ok', 'btn-restart',
  'btn-help-close', 'btn-pause', 'btn-skip-reward', 'btn-leave-shop',
  'btn-fight-elite', 'btn-skip-elite', 'card-tooltip',
  'overlay-story', 'overlay-result', 'overlay-ending', 'overlay-help',
  'overlay-reward', 'overlay-shop', 'overlay-fengshen', 'overlay-elite', 'overlay-rest',
  'story-title', 'story-text', 'story-canvas', 'result-title', 'result-text',
  'reward-grid', 'shop-coins-text', 'shop-grid', 'fengshen-prompt',
  'fengshen-portrait', 'fengshen-choices', 'elite-prompt', 'elite-portrait',
  'rest-heal-text', 'rest-stage-text', 'rest-canvas', 'btn-rest-ok', 'combo-meter',
  'ending-title', 'ending-text', 'ending-badges', 'ending-stats', 'ending-sealed',
  'ending-canvas', 'ach-grid-title', 'ach-grid-ending', 'battle-roof-deco'
];

function makeRect() {
  return { left: 100, top: 100, width: 80, height: 80, right: 180, bottom: 180 };
}

function makeCanvasCtx() {
  return {
    fillRect() {}, clearRect() {}, fillStyle: '', strokeStyle: '',
    lineWidth: 1, globalAlpha: 1, textAlign: 'left', font: '',
    fillText() {}, strokeRect() {}, beginPath() {}, arc() {}, stroke() {},
    moveTo() {}, lineTo() {}, closePath() {}, fill() {}, ellipse() {},
    drawImage() {},
    createRadialGradient: () => ({ addColorStop() {} }),
    createLinearGradient: () => ({ addColorStop() {} }),
    imageSmoothingEnabled: false
  };
}

function makeEl(id = '') {
  const style = {
    setProperty(k, v) { this[k] = v; },
    removeProperty(k) { delete this[k]; }
  };
  const classList = {
    _s: new Set(),
    add(...c) { c.forEach(x => this._s.add(x)); },
    remove(...c) { c.forEach(x => this._s.delete(x)); },
    toggle(c, force) {
      if (force === true) this._s.add(c);
      else if (force === false) this._s.delete(c);
      else if (this._s.has(c)) this._s.delete(c);
      else this._s.add(c);
    },
    contains(c) { return this._s.has(c); }
  };
  const el = {
    id,
    className: '',
    classList,
    style,
    textContent: '',
    innerHTML: '',
    disabled: false,
    onclick: null,
    addEventListener() {},
    dataset: {},
    children: [],
    parentNode: null,
    parentElement: null,
    offsetWidth: 100,
    offsetHeight: 100,
    clientWidth: 800,
    clientHeight: 600,
    getBoundingClientRect: () => makeRect(),
    appendChild(child) {
      child.parentNode = this;
      child.parentElement = this;
      this.children.push(child);
      return child;
    },
    prepend(child) {
      child.parentNode = this;
      child.parentElement = this;
      this.children.unshift(child);
      return child;
    },
    remove() {
      if (this.parentNode) {
        const i = this.parentNode.children.indexOf(this);
        if (i >= 0) this.parentNode.children.splice(i, 1);
      }
    },
    cloneNode() {
      const c = makeEl(this.id);
      c.className = this.className;
      c.dataset = { ...this.dataset };
      return c;
    },
    querySelector(sel) {
      const walk = (node) => {
        if (sel.startsWith('.') && node.className?.includes(sel.slice(1))) return node;
        for (const c of node.children || []) {
          const found = walk(c);
          if (found) return found;
        }
        return null;
      };
      return walk(this);
    },
    querySelectorAll(sel) {
      const out = [];
      const walk = (node) => {
        if (sel.startsWith('.') && node.className?.includes(sel.slice(1))) out.push(node);
        for (const c of node.children || []) walk(c);
      };
      walk(this);
      return out;
    },
    getContext() { return makeCanvasCtx(); }
  };
  Object.defineProperty(el, 'innerHTML', {
    get() { return el._innerHTML || ''; },
    set(html) {
      el._innerHTML = html;
      el.children = [];
      for (const m of html.matchAll(/<div class="([^"]*)"[^>]*>/g)) {
        const child = makeEl('');
        child.className = m[1];
        child.parentNode = el;
        child.parentElement = el;
        el.children.push(child);
      }
    }
  });
  Object.defineProperty(el, 'width', { get: () => 100, set() {} });
  Object.defineProperty(el, 'height', { get: () => 100, set() {} });
  return el;
}

export function createMockDocument() {
  const map = new Map();
  ELEMENT_IDS.forEach(id => map.set(id, makeEl(id)));

  const gameScreen = map.get('game-screen');
  gameScreen.classList.add('hidden');
  const battleBg = map.get('battle-bg');
  const enemyPanel = map.get('enemy-panel');
  gameScreen.appendChild(battleBg);
  enemyPanel.appendChild(map.get('enemy-inspect'));
  const enemyWrap = map.get('enemy-canvas-wrap');
  enemyWrap.appendChild(map.get('enemy-sparkle'));
  enemyPanel.appendChild(map.get('slash-fx'));
  const mainPanel = makeEl('main-panel');
  mainPanel.className = 'main-panel';
  map.set('main-panel', mainPanel);

  const body = makeEl('body');
  body.appendChild(map.get('fx-layer'));

  const document = {
    body,
    documentElement: makeEl('html'),
    createElement(tag) {
      const el = makeEl('');
      el.tagName = tag.toUpperCase();
      if (tag === 'canvas') el.getContext = () => makeCanvasCtx();
      return el;
    },
    getElementById(id) {
      if (!map.has(id)) map.set(id, makeEl(id));
      return map.get(id);
    },
    querySelector(sel) {
      if (sel === '.top-bar') return map.get('spirit-text');
      if (sel === '.main-panel') return map.get('main-panel');
      if (sel === '#overlay-ending .overlay-box') return makeEl('overlay-box');
      if (sel === '#overlay-result .overlay-box') return makeEl('overlay-box');
      return map.get('app') || null;
    },
    querySelectorAll(sel) {
      if (sel === '#hand .card') return [];
      if (sel === '.card:not(.disabled)') return [];
      if (sel === '.diff-btn') return [];
      if (sel === '.dragon-float') return [];
      return [];
    },
    addEventListener() {}
  };
  return { document, map };
}

export function loadGameScript() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  let script = html.match(/<script>([\s\S]*)<\/script>/)[1];
  const bootIdx = script.indexOf('TitleAmbient.init();');
  if (bootIdx >= 0) script = script.slice(0, bootIdx);
  script = script
    .replace(/\blet state = \{\};/, 'var state = {};')
    .replace(/\blet difficulty = /, 'var difficulty = ')
    .replace(/\blet achievements = /, 'var achievements = ')
    .replace(/\blet runAchievements = /, 'var runAchievements = ')
    .replace(/^const /gm, 'var ');

  const { document, map } = createMockDocument();
  const timeouts = [];
  const rafs = [];

  const ctx = {
    console,
    document,
    window: {
      innerWidth: 1280,
      innerHeight: 720,
      addEventListener: () => {},
      AudioContext: class {
        constructor() {
          this.state = 'running';
          this.destination = {};
          this.currentTime = 0;
        }
        resume() { return Promise.resolve(); }
        createBufferSource() { return { connect() {}, start() {}, buffer: null }; }
        createGain() {
          return {
            gain: { value: 1, setValueAtTime() {}, exponentialRampToValueAtTime() {} },
            connect() {}
          };
        }
        createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {} }, type: 'sine' }; }
        createBiquadFilter() { return { connect() {}, frequency: { value: 0 }, Q: { value: 0 }, type: 'lowpass' }; }
        createBuffer(len) { return { getChannelData: () => new Float32Array(len || 128), duration: 0.1, sampleRate: 44100 }; }
        decodeAudioData() { return Promise.resolve({}); }
      },
      webkitAudioContext: null,
      performance: { now: () => Date.now() },
      requestAnimationFrame(fn) { rafs.push(fn); return rafs.length; },
      localStorage: {
        _d: {},
        getItem(k) { return this._d[k] ?? null; },
        setItem(k, v) { this._d[k] = String(v); },
        removeItem(k) { delete this._d[k]; }
      }
    },
    Math, JSON, parseInt, parseFloat, isNaN, isFinite,
    setTimeout(fn, ms) {
      const id = timeouts.length + 1;
      timeouts.push({ id, fn, ms: ms ?? 0 });
      return id;
    },
    clearTimeout() {},
    setInterval() { return 1; },
    clearInterval() {},
    requestAnimationFrame(fn) { rafs.push(fn); return rafs.length; },
    cancelAnimationFrame() {},
    fetch: async () => ({ ok: false }),
    Image: class {
      constructor() {
        this.onload = null;
        this.complete = true;
        this.naturalWidth = 16;
        this.naturalHeight = 16;
      }
      set src(_) { if (this.onload) setTimeout(() => this.onload(), 0); }
    },
    HTMLElement: function() {},
    Audio: class {
      set volume(_) {}
      set src(_) {}
      set currentTime(_) {}
      play() { return Promise.resolve(); }
    }
  };
  ctx.window.webkitAudioContext = ctx.window.AudioContext;
  ctx.localStorage = ctx.window.localStorage;

  vm.runInNewContext(script, ctx, { filename: 'index.html' });

  ctx.map = map;
  ctx.timeouts = timeouts;
  ctx.rafs = rafs;
  ctx.tick = function tick(ms = 400) {
    let budget = ms;
    while (timeouts.length && budget >= 0) {
      const t = timeouts.shift();
      budget -= t.ms ?? 0;
      t.fn();
    }
    while (rafs.length) rafs.shift()();
  };
  ctx.flush = function flush() {
    while (timeouts.length) timeouts.shift().fn();
    while (rafs.length) rafs.shift()();
  };
  return ctx;
}
