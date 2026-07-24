(() => {
  'use strict';

  const STAGE_MS = 840;
  const QUICK_TAP_MS = 220;
  const RESET_MS = 520;
  const controllers = new Map();

  const stage = (name, primary, secondary, accent, lightning, power, style) => ({
    name,
    primary,
    secondary,
    accent,
    lightning,
    power,
    style
  });

  const PATHS = {
    goku: {
      title: 'Watched + In Progress',
      titleLines: ['Watched +', 'In Progress'],
      match: ['watched + in progress', 'watched and in progress'],
      realm: 'ACTIVE ARCHIVE',
      fallbackCount: '102 titles',
      stages: [
        stage('Base', '#77f6ff', '#267fa8', '#f8ffff', 0, .18, 'calm'),
        stage('Goku Mini — DAIMA', '#7af7ff', '#277aa3', '#ffffff', 0, .30, 'calm'),
        stage('Enraged', '#fff6dc', '#e34c32', '#ffffff', 1, .34, 'flame'),
        stage('Great Ape', '#ffb341', '#7a351d', '#fff0ba', 0, .48, 'ember'),
        stage('Kaioken', '#ff304f', '#a70022', '#ffd0d7', 1, .48, 'flame'),
        stage('Kaioken ×20', '#ff173f', '#ff6a00', '#ffffff', 2, .65, 'flame'),
        stage('False Super Saiyan', '#ffad20', '#f35016', '#fffbd1', 1, .62, 'flame'),
        stage('Super Saiyan', '#ffd92f', '#ff8a15', '#fffbd2', 1, .66, 'flame'),
        stage('Super Saiyan Mini', '#ffd92c', '#ff8a15', '#fffbd2', 1, .66, 'flame'),
        stage('Ascended Super Saiyan — Grade 2', '#ffe34a', '#ff7518', '#ffffff', 2, .73, 'flame'),
        stage('Ultra Super Saiyan — Grade 3', '#fff05a', '#ff5818', '#ffffff', 2, .82, 'flame'),
        stage('Full Power Super Saiyan — Grade 4', '#ffe669', '#ffae19', '#fffde8', 1, .70, 'calm'),
        stage('Super Kaioken', '#ffcf26', '#ef113d', '#ffffff', 3, .82, 'flame'),
        stage('Spirit Bomb Absorbed', '#66e8ff', '#2368ff', '#ffffff', 3, .84, 'orb'),
        stage('Super Saiyan 2', '#fff04f', '#3ea4ff', '#ffffff', 4, .86, 'electric'),
        stage('Super Saiyan 2 Mini', '#ffea40', '#3c9fff', '#ffffff', 4, .86, 'electric'),
        stage('Super Saiyan 3', '#ffc928', '#ff6f0b', '#fff8bf', 3, .92, 'flame'),
        stage('Super Saiyan 3 Mini', '#ffc728', '#ff6f0b', '#fff8bf', 3, .92, 'flame'),
        stage('Golden Great Ape', '#ffc21e', '#a82713', '#fff5aa', 2, .88, 'ember'),
        stage('Super Saiyan 4 — DAIMA', '#e62a38', '#6e1a8f', '#ffd34e', 5, .94, 'dual'),
        stage('Super Saiyan 4 — GT', '#e92936', '#1e1422', '#ffd148', 2, .94, 'flame'),
        stage('Full Power Super Saiyan 4', '#ff3643', '#ff9f1a', '#fff6b8', 3, .98, 'flame'),
        stage('Super Saiyan God', '#ff314c', '#f4009b', '#fff1f3', 1, .76, 'god'),
        stage('Super Saiyan Blue', '#23dfff', '#087bf5', '#efffff', 2, .82, 'god'),
        stage('Perfected Super Saiyan Blue — Manga', '#1cf2ff', '#0e42cb', '#ffffff', 1, .88, 'calm'),
        stage('Super Saiyan Blue Kaioken', '#19dfff', '#fa164a', '#ffffff', 4, .96, 'dual'),
        stage('Ultra Instinct -Sign-', '#dce8ff', '#50658d', '#ffffff', 3, .90, 'mist'),
        stage('True Ultra Instinct', '#e6e9f0', '#43506c', '#ffeff2', 4, .96, 'mist'),
        stage('Perfected Ultra Instinct', '#f7fbff', '#92a9d1', '#ffffff', 4, 1, 'mist'),
        stage('Giant Ultra Instinct Avatar', '#dffaff', '#637cff', '#ffffff', 4, 1, 'orb'),
        stage('Super Full Power Saiyan 4 — Limit Breaker', '#ff273c', '#7736ff', '#fff3bc', 5, 1, 'dual'),
        stage('Universe Tree Power', '#7ffff2', '#8a36ff', '#ffffff', 5, 1, 'orb')
      ]
    },

    vegeta: {
      title: "Haven't Started Yet",
      titleLines: ["Haven't", 'Started Yet'],
      match: ["haven't started yet", 'havent started yet', 'not started'],
      realm: 'UNCHARTED REALM',
      fallbackCount: '96 titles',
      stages: [
        stage('Base', '#7b8cff', '#3f4fa8', '#ffffff', 0, .18, 'calm'),
        stage('Vegeta Mini — DAIMA', '#8a7cff', '#46329b', '#ffffff', 0, .28, 'calm'),
        stage('Great Ape', '#ff9f36', '#6d2f1f', '#ffe8b8', 0, .46, 'ember'),
        stage('Super Saiyan', '#ffd62e', '#ff8614', '#fffbd2', 1, .64, 'flame'),
        stage('Super Saiyan Mini', '#ffda33', '#ff8f18', '#fffbd2', 1, .66, 'flame'),
        stage('Super Vegeta — Grade 2', '#ffe454', '#ff6f16', '#ffffff', 2, .73, 'flame'),
        stage('Full Power Super Saiyan', '#ffe76c', '#ffb01d', '#fffde8', 1, .70, 'calm'),
        stage('Super Saiyan 2', '#fff04f', '#4f8fff', '#ffffff', 4, .84, 'electric'),
        stage('Super Saiyan 2 Mini', '#ffec42', '#4a86ff', '#ffffff', 4, .86, 'electric'),
        stage('Majin Vegeta', '#ffe02e', '#8e35ff', '#ffffff', 4, .89, 'dual'),
        stage('Enraged Super Saiyan 2', '#fff45c', '#ef254a', '#ffffff', 5, .92, 'electric'),
        stage('Super Saiyan 3 Mini — DAIMA', '#ffc429', '#ff690c', '#fff5b5', 3, .93, 'flame'),
        stage('Super Saiyan 3 — Xeno', '#ffc32c', '#a733ff', '#fff5b5', 4, .94, 'dual'),
        stage('Golden Great Ape', '#ffbd20', '#9d2717', '#fff1a3', 2, .90, 'ember'),
        stage('Super Saiyan 4 — GT', '#df283b', '#241522', '#ffd24c', 3, .94, 'flame'),
        stage('Super Saiyan 4 — Xeno', '#ee3047', '#5d1b81', '#ffd55a', 4, .96, 'dual'),
        stage('Super Saiyan God', '#ff304f', '#db0e8d', '#fff1f3', 1, .78, 'god'),
        stage('Super Saiyan Blue', '#22d8ff', '#126ff0', '#efffff', 2, .84, 'god'),
        stage('Perfected Super Saiyan Blue — Manga', '#20ebff', '#103bc1', '#ffffff', 1, .88, 'calm'),
        stage('Super Saiyan Blue Evolved', '#3159ff', '#101fa9', '#d9e3ff', 4, .94, 'electric'),
        stage('Blue Evolved + Spirit Fission', '#3762ff', '#17dbff', '#ffffff', 4, .95, 'orb'),
        stage('Super Saiyan Blue Berserk', '#244cff', '#a01cff', '#ff9bf4', 5, .96, 'dual'),
        stage('Controlled Blue Berserk', '#345cff', '#8228ff', '#ffffff', 5, .98, 'dual'),
        stage('Super Saiyan 4 — Limit Breaker', '#f51f42', '#7c24ff', '#fff0b4', 5, .99, 'dual'),
        stage('Blue Evolved + Destruction Aura', '#384dff', '#982dff', '#ff92e9', 5, 1, 'dual'),
        stage('Ultra Ego', '#a236ff', '#6518b8', '#ff83e3', 6, 1, 'god')
      ]
    }
  };

  const normalize = value => String(value || '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  const compact = value => normalize(value).replace(/[^a-z0-9]+/g, '');
  const matchesPath = (value, path) => {
    const text = compact(value);
    return path.match.some(term => text.includes(compact(term)));
  };

  const visible = element => {
    if (!(element instanceof Element)) return false;
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 0 &&
      rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden';
  };

  function findAnchor(path) {
    const matches = [];
    const selector = 'h1,h2,h3,h4,strong,p,span,div';
    for (const element of document.querySelectorAll(selector)) {
      if (!visible(element) || element.closest('.kn29-overlay,.kn29-shield')) continue;
      const text = normalize(element.textContent);
      if (!matchesPath(text, path) || text.length > 180) continue;
      const rect = element.getBoundingClientRect();
      matches.push({
        element,
        area: rect.width * rect.height,
        textLength: text.length
      });
    }
    matches.sort((a, b) => a.textLength - b.textLength || a.area - b.area);
    return matches[0]?.element || null;
  }

  function cardScore(element, path) {
    const rect = element.getBoundingClientRect();
    if (
      rect.width < 250 ||
      rect.height < 150 ||
      rect.height > 580 ||
      rect.width > 1150
    ) return -Infinity;

    const text = normalize(element.innerText || element.textContent);
    if (!matchesPath(text, path)) return -Infinity;
    const other = Object.values(PATHS).find(candidate => candidate !== path);
    if (matchesPath(text, other)) return -Infinity;

    const style = getComputedStyle(element);
    const radius = Number.parseFloat(style.borderTopLeftRadius) || 0;
    const border = (Number.parseFloat(style.borderTopWidth) || 0) +
      (Number.parseFloat(style.borderBottomWidth) || 0);
    const background = (
      style.backgroundImage &&
      style.backgroundImage !== 'none'
    ) || style.backgroundColor !== 'rgba(0, 0, 0, 0)';
    const shadow = style.boxShadow && style.boxShadow !== 'none';
    const ratio = rect.width / rect.height;
    if (ratio < 1.05 || ratio > 4.2) return -Infinity;

    return rect.width * rect.height +
      radius * 9000 +
      border * 12000 +
      (background ? 50000 : 0) +
      (shadow ? 35000 : 0);
  }

  function findCard(path) {
    const anchor = findAnchor(path);
    if (!anchor) return null;
    const candidates = [];
    let node = anchor;
    const boundary = document.querySelector('#homeView') || document.body;
    while (
      node &&
      node !== boundary &&
      node !== document.body &&
      node !== document.documentElement
    ) {
      const score = cardScore(node, path);
      if (Number.isFinite(score)) candidates.push({ element: node, score });
      node = node.parentElement;
    }
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0]?.element || null;
  }

  function stopController(state) {
    state.active = false;
    cancelAnimationFrame(state.frame);
    state.frame = 0;
    state.resizeObserver?.disconnect();
  }

  function cleanupLegacy(root = document) {
    for (const state of controllers.values()) stopController(state);
    controllers.clear();

    root.querySelectorAll?.(
      '.kn-power-layer,.kn-touch-shield,' +
      '.kn28-overlay,.kn28-shield,.kn29-overlay,.kn29-shield'
    ).forEach(node => node.remove());

    root.querySelectorAll?.(
      '.kn-transform-card,.kn28-card,.kn29-card'
    ).forEach(card => {
      if (card.__kn29ClickHandler) {
        card.removeEventListener('click', card.__kn29ClickHandler, true);
        delete card.__kn29ClickHandler;
      }
      card.classList.remove(
        'kn-transform-card',
        'kn-charging',
        'kn-unleashed',
        'kn-collapse',
        'kn28-card',
        'kn28-active',
        'kn28-release',
        'kn28-collapse',
        'kn29-card',
        'kn29-active',
        'kn29-locked',
        'kn29-release',
        'kn29-collapse'
      );
      delete card.dataset.knTransform;
      delete card.dataset.fighter;
      delete card.dataset.stage;
      delete card.dataset.kn28Fighter;
      delete card.dataset.kn28Stage;
      delete card.dataset.kn29Fighter;
      delete card.dataset.kn29Stage;
      card.querySelectorAll(
        '[data-kn-original-content],' +
        '[data-kn-original-hold],' +
        '[data-kn28-original],' +
        '[data-kn29-original]'
      ).forEach(node => {
        node.removeAttribute('data-kn-original-content');
        node.removeAttribute('data-kn-original-hold');
        node.removeAttribute('data-kn28-original');
        node.removeAttribute('data-kn29-original');
      });
    });
  }

  function getCount(card, path) {
    const match = String(card.innerText || card.textContent || '')
      .match(/\b\d+\s+titles?\b/i);
    return match?.[0] || path.fallbackCount;
  }

  function markup(path, count) {
    const title = path.titleLines.map(line => `<span>${line}</span>`).join('');
    return `<div class="kn29-overlay" aria-hidden="true">
      <div class="kn29-rays"></div>
      <div class="kn29-orb"><i></i><i></i></div>
      <canvas class="kn29-canvas"></canvas>
      <div class="kn29-copy">
        <span class="kn29-form">${path.realm}</span>
        <strong class="kn29-title">${title}</strong>
        <span class="kn29-count">${count}</span>
      </div>
      <span class="kn29-rank">01 / ${String(path.stages.length).padStart(2, '0')}</span>
      <span class="kn29-hold">KEEP HOLDING</span>
      <div class="kn29-meter"><i></i></div>
    </div>
    <span
      class="kn29-shield"
      role="button"
      tabindex="0"
      aria-label="Press and hold to power up"
    ></span>`;
  }

  function applyEnergyVars(card, power) {
    card.style.setProperty('--kn29-energy', power);
    card.style.setProperty('--kn29-bg-energy', `${(power * 25).toFixed(1)}%`);
    card.style.setProperty('--kn29-outer-glow', `${(16 + power * 24).toFixed(1)}px`);
    card.style.setProperty('--kn29-inner-glow', `${(10 + power * 28).toFixed(1)}px`);
    card.style.setProperty('--kn29-shake-speed', `${Math.round(100 + (1 - power) * 260)}ms`);
    card.style.setProperty('--kn29-aura-opacity', (.12 + power * .62).toFixed(3));
    card.style.setProperty('--kn29-aura-blur', `${(18 - power * 8).toFixed(1)}px`);
    card.style.setProperty('--kn29-spin-speed', `${(10 - power * 7).toFixed(2)}s`);
    card.style.setProperty('--kn29-inset-opacity', (.12 + power * .45).toFixed(3));
    card.style.setProperty('--kn29-inset-glow', `${(24 + power * 42).toFixed(1)}px`);
    card.style.setProperty('--kn29-orb-opacity', (.22 + power * .65).toFixed(3));
    card.style.setProperty('--kn29-orb-glow', `${(28 + power * 38).toFixed(1)}px`);
    card.style.setProperty('--kn29-orb-inner', `${(30 + power * 35).toFixed(1)}px`);
    card.style.setProperty('--kn29-orb-scale', (1 + power * .1).toFixed(3));
    card.style.setProperty('--kn29-title-glow', `${(2 + power * 16).toFixed(1)}px`);
  }

  function setStage(state, index, progress, initial = false) {
    const current = state.path.stages[index];
    const changed = index !== state.stage;
    state.stage = index;
    state.form = current;
    state.card.dataset.kn29Stage = String(index);
    state.card.style.setProperty('--kn29-primary', current.primary);
    state.card.style.setProperty('--kn29-secondary', current.secondary);
    state.card.style.setProperty('--kn29-accent', current.accent);
    state.card.style.setProperty('--kn29-progress', String(progress));
    applyEnergyVars(state.card, current.power);
    state.formLabel.textContent = current.name;
    state.rank.textContent = `${String(index + 1).padStart(2, '0')} / ${String(state.path.stages.length).padStart(2, '0')}`;

    if (changed && !initial) {
      state.flash = 1;
      burst(state, 12 + Math.round(current.power * 18));
      try {
        navigator.vibrate?.(
          index === state.path.stages.length - 1 ? [18, 24, 28] : 8
        );
      } catch {}
    }
  }

  function resizeCanvas(state) {
    const rect = state.card.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    state.width = rect.width;
    state.height = rect.height;
    state.dpr = dpr;
    state.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    state.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    state.context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function hexToRgb(hex) {
    const value = hex.replace('#', '');
    const normalized = value.length === 3
      ? value.split('').map(char => char + char).join('')
      : value;
    const number = Number.parseInt(normalized, 16);
    return {
      r: (number >> 16) & 255,
      g: (number >> 8) & 255,
      b: number & 255
    };
  }

  function rgba(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function particleType(form) {
    if (form.style === 'ember') return Math.random() < .65 ? 'ember' : 'streak';
    if (form.style === 'mist') return Math.random() < .55 ? 'mist' : 'spark';
    if (form.style === 'electric') return Math.random() < .7 ? 'spark' : 'streak';
    if (form.style === 'orb') return Math.random() < .55 ? 'orb' : 'spark';
    return Math.random() < .58 ? 'streak' : 'orb';
  }

  function createParticle(state, extraPower = 0) {
    const form = state.form;
    const type = particleType(form);
    const fromBottom = Math.random() < .78;
    const x = Math.random() * state.width;
    const y = fromBottom ? state.height + 8 : Math.random() * state.height;
    const side = x < state.width / 2 ? -1 : 1;
    const power = form.power + extraPower;
    const colorRoll = Math.random();
    const color = colorRoll < .55
      ? form.primary
      : colorRoll < .82
        ? form.secondary
        : form.accent;

    state.particles.push({
      x,
      y,
      vx: fromBottom
        ? (state.width / 2 - x) * (.0007 + Math.random() * .0014) +
          (Math.random() - .5) * .7
        : -side * (.15 + Math.random() * .8),
      vy: fromBottom
        ? -(1.15 + Math.random() * 2.6 + power * 2.1)
        : -(Math.random() - .35) * 1.3,
      life: 1,
      decay: .009 + Math.random() * .021,
      size: 1 + Math.random() * (2.3 + power * 2.2),
      color,
      type,
      wobble: Math.random() * Math.PI * 2
    });
  }

  function burst(state, count) {
    for (let index = 0; index < count; index += 1) {
      createParticle(state, .5);
    }
  }

  function createBolt(state) {
    const form = state.form;
    const edge = Math.floor(Math.random() * 4);
    let start;
    let end;

    if (edge === 0) {
      start = { x: Math.random() * state.width, y: 0 };
      end = {
        x: state.width * (.25 + Math.random() * .5),
        y: state.height * (.45 + Math.random() * .45)
      };
    } else if (edge === 1) {
      start = { x: state.width, y: Math.random() * state.height };
      end = {
        x: state.width * (.4 + Math.random() * .4),
        y: state.height * (.3 + Math.random() * .55)
      };
    } else if (edge === 2) {
      start = { x: Math.random() * state.width, y: state.height };
      end = {
        x: state.width * (.2 + Math.random() * .65),
        y: state.height * (.25 + Math.random() * .5)
      };
    } else {
      start = { x: 0, y: Math.random() * state.height };
      end = {
        x: state.width * (.2 + Math.random() * .45),
        y: state.height * (.2 + Math.random() * .6)
      };
    }

    const points = [];
    const segments = 6 + Math.floor(Math.random() * 5);
    for (let index = 0; index <= segments; index += 1) {
      const ratio = index / segments;
      const spread = index === 0 || index === segments
        ? 0
        : 14 + form.power * 16;
      points.push({
        x: start.x + (end.x - start.x) * ratio +
          (Math.random() - .5) * spread,
        y: start.y + (end.y - start.y) * ratio +
          (Math.random() - .5) * spread
      });
    }

    state.bolts.push({
      points,
      life: 1,
      decay: .12 + Math.random() * .08,
      width: 1 + Math.random() * 1.8,
      color: Math.random() < .72 ? form.accent : form.primary
    });
  }

  function drawAura(state, time) {
    const { context, width, height, form } = state;
    const pulse = 1 + Math.sin(time * .008) * .035;
    const centerX = width * .53;
    const centerY = height * .61;
    const radius = Math.max(width, height) *
      (.35 + form.power * .2) *
      pulse;
    const glow = context.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    );
    glow.addColorStop(0, rgba(form.accent, .03 + form.power * .05));
    glow.addColorStop(.42, rgba(form.primary, .055 + form.power * .08));
    glow.addColorStop(.72, rgba(form.secondary, .035 + form.power * .06));
    glow.addColorStop(1, rgba(form.primary, 0));
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    const tongues = state.reducedMotion ? 2 : 5 + Math.round(form.power * 4);
    for (let index = 0; index < tongues; index += 1) {
      const position = (index + .5) / tongues;
      const x = width * position;
      const sway = Math.sin(
        time * (.0025 + index * .00013) + index * 1.7
      ) * width * .035;
      const peak = height * (.11 + (index % 3) * .025);
      const gradient = context.createLinearGradient(0, height, 0, peak);
      gradient.addColorStop(
        0,
        rgba(index % 2 ? form.secondary : form.primary, .02)
      );
      gradient.addColorStop(
        .55,
        rgba(
          index % 2 ? form.primary : form.secondary,
          .1 + form.power * .07
        )
      );
      gradient.addColorStop(1, rgba(form.accent, 0));

      context.beginPath();
      context.moveTo(x - width * .1, height + 10);
      context.quadraticCurveTo(
        x - width * .05 + sway,
        height * .56,
        x + sway,
        peak
      );
      context.quadraticCurveTo(
        x + width * .05 + sway,
        height * .62,
        x + width * .1,
        height + 10
      );
      context.closePath();
      context.fillStyle = gradient;
      context.fill();
    }
  }

  function drawParticles(state) {
    const context = state.context;
    state.particles = state.particles.filter(particle => particle.life > 0);

    for (const particle of state.particles) {
      particle.wobble += .08;
      particle.x += particle.vx + Math.sin(particle.wobble) * .16;
      particle.y += particle.vy;
      particle.vy *= particle.type === 'ember' ? .985 : 1.002;
      particle.life -= particle.decay;

      const alpha = Math.max(0, particle.life);
      context.save();
      context.globalAlpha = alpha;
      context.shadowBlur = 8 + particle.size * 4;
      context.shadowColor = particle.color;
      context.strokeStyle = particle.color;
      context.fillStyle = particle.color;

      if (particle.type === 'streak') {
        context.lineWidth = Math.max(.7, particle.size * .5);
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(
          particle.x - particle.vx * 5,
          particle.y - particle.vy * 6
        );
        context.stroke();
      } else if (particle.type === 'spark') {
        context.lineWidth = Math.max(.7, particle.size * .35);
        context.beginPath();
        context.moveTo(particle.x - particle.size * 2, particle.y);
        context.lineTo(particle.x + particle.size * 2, particle.y);
        context.moveTo(particle.x, particle.y - particle.size * 2);
        context.lineTo(particle.x, particle.y + particle.size * 2);
        context.stroke();
      } else if (particle.type === 'mist') {
        const mist = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 4
        );
        mist.addColorStop(0, rgba(particle.color, .45));
        mist.addColorStop(1, rgba(particle.color, 0));
        context.fillStyle = mist;
        context.beginPath();
        context.arc(
          particle.x,
          particle.y,
          particle.size * 4,
          0,
          Math.PI * 2
        );
        context.fill();
      } else {
        context.beginPath();
        context.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );
        context.fill();
      }
      context.restore();
    }
  }

  function drawBolts(state) {
    const context = state.context;
    state.bolts = state.bolts.filter(bolt => bolt.life > 0);

    for (const bolt of state.bolts) {
      bolt.life -= bolt.decay;
      const alpha = Math.max(0, bolt.life);

      context.save();
      context.globalAlpha = alpha;
      context.lineJoin = 'round';
      context.lineCap = 'round';
      context.shadowBlur = 16;
      context.shadowColor = bolt.color;
      context.strokeStyle = bolt.color;
      context.lineWidth = bolt.width * 3.4;
      context.beginPath();
      bolt.points.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      });
      context.stroke();

      context.shadowBlur = 4;
      context.strokeStyle = '#ffffff';
      context.lineWidth = Math.max(.65, bolt.width * .52);
      context.stroke();
      context.restore();
    }
  }

  function drawFlash(state) {
    if (state.flash <= 0) return;
    const { context, width, height, form } = state;
    const gradient = context.createRadialGradient(
      width * .5,
      height * .55,
      0,
      width * .5,
      height * .55,
      Math.max(width, height) * .72
    );
    gradient.addColorStop(0, rgba(form.accent, state.flash * .68));
    gradient.addColorStop(.26, rgba(form.primary, state.flash * .36));
    gradient.addColorStop(1, rgba(form.primary, 0));
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    state.flash *= .82;
  }

  function animate(state, time) {
    if (!state.active) return;
    const elapsed = time - state.started;
    const total = state.path.stages.length * STAGE_MS;
    const progress = Math.min(1, elapsed / total);
    const index = Math.min(
      state.path.stages.length - 1,
      Math.floor(elapsed / STAGE_MS)
    );

    if (index !== state.stage) setStage(state, index, progress);
    else state.card.style.setProperty('--kn29-progress', String(progress));

    if (!state.completed) {
      state.hold.textContent = 'KEEP HOLDING';
      if (progress >= 1) {
        state.completed = true;
        state.charging = false;
        state.card.classList.add('kn29-locked');
        setStage(state, state.path.stages.length - 1, 1);
        state.hold.textContent = 'RELEASE TO ENTER';
        try {
          navigator.vibrate?.([22, 22, 34, 18, 50]);
        } catch {}
      }
    }

    const spawnDelay = Math.max(18, 72 - state.form.power * 50);
    if (
      !state.reducedMotion &&
      time - state.lastParticleTime > spawnDelay
    ) {
      const amount = 1 + Math.floor(state.form.power * 2);
      for (let particle = 0; particle < amount; particle += 1) {
        createParticle(state);
      }
      state.lastParticleTime = time;
    }

    if (
      !state.reducedMotion &&
      state.form.lightning > 0 &&
      time - state.lastBoltTime >
        Math.max(70, 450 - state.form.lightning * 65)
    ) {
      createBolt(state);
      if (state.form.lightning >= 5 && Math.random() > .45) {
        createBolt(state);
      }
      state.lastBoltTime = time;
    }

    state.context.clearRect(0, 0, state.width, state.height);
    drawAura(state, time);
    drawParticles(state);
    drawBolts(state);
    drawFlash(state);
    state.frame = requestAnimationFrame(next => animate(state, next));
  }

  function reset(state) {
    state.active = false;
    state.charging = false;
    state.completed = false;
    cancelAnimationFrame(state.frame);
    state.frame = 0;
    state.particles = [];
    state.bolts = [];
    state.context.clearRect(0, 0, state.width, state.height);
    state.card.classList.remove(
      'kn29-active',
      'kn29-locked',
      'kn29-release',
      'kn29-collapse'
    );
    state.hold.textContent = 'HOLD TO UNLEASH';
    setStage(state, 0, 0, true);
  }

  function activateOriginal(state) {
    state.allowClick = true;
    const target = (
      state.clickTarget &&
      state.card.contains(state.clickTarget)
    ) ? state.clickTarget : state.card;
    try {
      if (typeof target.click === 'function') target.click();
      else {
        target.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
      }
    } finally {
      state.allowClick = false;
    }
  }

  function complete(state) {
    if (!state.completed) return;
    state.active = false;
    cancelAnimationFrame(state.frame);
    state.frame = 0;
    state.card.classList.remove('kn29-active', 'kn29-locked');
    state.card.classList.add('kn29-release');
    state.hold.textContent = 'TRANSFORMATION COMPLETE';

    const flash = document.createElement('div');
    flash.className = 'kn29-screen-flash';
    flash.style.setProperty('--kn29-flash', state.form.primary);
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 760);
    try {
      navigator.vibrate?.([22, 22, 34, 18, 50]);
    } catch {}
    setTimeout(() => activateOriginal(state), 520);
    setTimeout(() => reset(state), 1200);
  }

  function start(state) {
    if (state.active || state.completed) return;
    document.getSelection?.()?.removeAllRanges?.();
    state.active = true;
    state.charging = true;
    state.completed = false;
    state.started = performance.now();
    state.stage = -1;
    state.flash = 1;
    state.lastParticleTime = 0;
    state.lastBoltTime = 0;
    state.particles = [];
    state.bolts = [];
    state.card.classList.remove(
      'kn29-collapse',
      'kn29-release',
      'kn29-locked'
    );
    state.card.classList.add('kn29-active');
    resizeCanvas(state);
    setStage(state, 0, 0, true);
    burst(state, 22);
    state.frame = requestAnimationFrame(time => animate(state, time));
  }

  function cancel(state) {
    if (!state.active || state.completed) return;
    state.active = false;
    state.charging = false;
    cancelAnimationFrame(state.frame);
    state.frame = 0;
    state.card.classList.remove('kn29-active');
    state.card.classList.add('kn29-collapse');
    state.formLabel.textContent = 'POWER RELEASED';
    state.hold.textContent = 'HOLD AGAIN';
    setTimeout(() => reset(state), RESET_MS);
  }

  function release(state) {
    if (!state.active) return;
    const elapsed = performance.now() - state.started;
    if (state.completed) {
      complete(state);
      return;
    }
    if (elapsed < QUICK_TAP_MS) {
      state.active = false;
      cancelAnimationFrame(state.frame);
      reset(state);
      activateOriginal(state);
      return;
    }
    cancel(state);
  }

  function stop(event) {
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
  }

  function findClickTarget(card, anchor) {
    const ancestor = anchor?.closest('button,a,[role="button"]');
    if (ancestor && card.contains(ancestor)) return ancestor;
    return card.matches('button,a,[role="button"]')
      ? card
      : card.querySelector('button,a,[role="button"]') || card;
  }

  function attach(card, fighter, path) {
    if (!card || controllers.has(card)) return;
    const anchor = findAnchor(path);
    const clickTarget = findClickTarget(card, anchor);
    const count = getCount(card, path);

    card.querySelectorAll(
      '.kn-power-layer,.kn-touch-shield,' +
      '.kn28-overlay,.kn28-shield,.kn29-overlay,.kn29-shield'
    ).forEach(node => node.remove());
    card.classList.remove(
      'kn-transform-card',
      'kn-charging',
      'kn-unleashed',
      'kn-collapse',
      'kn28-card',
      'kn28-active',
      'kn28-release',
      'kn28-collapse'
    );
    card.classList.add('kn29-card');
    card.dataset.kn29Fighter = fighter;
    card.dataset.kn29Stage = '0';
    card.setAttribute('draggable', 'false');

    for (const child of [...card.children]) {
      child.dataset.kn29Original = '1';
    }
    card.insertAdjacentHTML('beforeend', markup(path, count));

    const canvas = card.querySelector('.kn29-canvas');
    const state = {
      card,
      path,
      fighter,
      anchor,
      clickTarget,
      canvas,
      context: canvas.getContext('2d'),
      shield: card.querySelector('.kn29-shield'),
      formLabel: card.querySelector('.kn29-form'),
      rank: card.querySelector('.kn29-rank'),
      hold: card.querySelector('.kn29-hold'),
      allowClick: false,
      active: false,
      charging: false,
      completed: false,
      frame: 0,
      started: 0,
      stage: -1,
      form: path.stages[0],
      particles: [],
      bolts: [],
      flash: 0,
      width: 0,
      height: 0,
      dpr: 1,
      lastParticleTime: 0,
      lastBoltTime: 0,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches
    };
    controllers.set(card, state);
    resizeCanvas(state);
    setStage(state, 0, 0, true);

    if ('ResizeObserver' in window) {
      state.resizeObserver = new ResizeObserver(() => resizeCanvas(state));
      state.resizeObserver.observe(card);
    }

    const shield = state.shield;
    shield.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      stop(event);
      try {
        shield.setPointerCapture?.(event.pointerId);
      } catch {}
      start(state);
    }, true);
    shield.addEventListener('pointerup', event => {
      stop(event);
      release(state);
    }, true);
    shield.addEventListener('pointercancel', event => {
      stop(event);
      cancel(state);
    }, true);
    shield.addEventListener('keydown', event => {
      if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
        stop(event);
        start(state);
      }
    }, true);
    shield.addEventListener('keyup', event => {
      if (event.key === ' ' || event.key === 'Enter') {
        stop(event);
        release(state);
      }
    }, true);
    for (const type of ['click', 'contextmenu', 'dragstart', 'selectstart']) {
      shield.addEventListener(type, stop, true);
    }

    card.__kn29ClickHandler = event => {
      if (state.allowClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    card.addEventListener('click', card.__kn29ClickHandler, true);
  }

  function scan() {
    cleanupLegacy();
    for (const [fighter, path] of Object.entries(PATHS)) {
      const card = findCard(path);
      if (card) attach(card, fighter, path);
    }
  }

  let timer = 0;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(scan, 80);
  }

  for (const type of ['selectstart', 'contextmenu', 'dragstart']) {
    document.addEventListener(type, event => {
      if (
        event.target instanceof Element &&
        event.target.closest('.kn29-card')
      ) {
        if (event.cancelable) event.preventDefault();
        document.getSelection?.()?.removeAllRanges?.();
      }
    }, true);
  }

  scan();
  window.addEventListener('kagenexus-ready', schedule);
  window.addEventListener('anime-haven-ready', schedule);
  const observer = new MutationObserver(records => {
    const homeAdded = records.some(record =>
      [...record.addedNodes].some(node =>
        node instanceof Element &&
        (node.matches?.('#homeView') || node.querySelector?.('#homeView'))
      )
    );
    if (homeAdded) schedule();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  window.addEventListener('pagehide', () => {
    for (const state of controllers.values()) stopController(state);
    observer.disconnect();
  }, { once: true });
})();
