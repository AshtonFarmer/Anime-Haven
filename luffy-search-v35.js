(() => {
  'use strict';

  const VERSION = '35';
  const STORAGE_KEY = 'kagenexus-search-style';
  const CLASSIC = 'classic';
  const LUFFY = 'luffy';
  const MEDIA_ROOT = './assets/media/luffy-search/';
  const OPEN_SOURCE = `${MEDIA_ROOT}luffy-arm-open-v35.webp?release=${VERSION}`;
  const CLOSE_SOURCE = `${MEDIA_ROOT}luffy-arm-close-v35.webp?release=${VERSION}`;
  const COILED_SOURCE = `${MEDIA_ROOT}luffy-arm-coiled-v35.webp?release=${VERSION}`;
  const SEARCH_SOURCE = `${MEDIA_ROOT}luffy-arm-search-v35.webp?release=${VERSION}`;

  const readPreference = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) === CLASSIC ? CLASSIC : LUFFY;
    } catch (error) {
      console.warn('KageNexus could not read the search style', error);
      return LUFFY;
    }
  };

  const savePreference = value => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      return true;
    } catch (error) {
      console.warn('KageNexus could not save the search style', error);
      return false;
    }
  };

  const addStylesheet = (href, match) => {
    if (document.querySelector(`link[href*="${match}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  const loadScript = source => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src*="${source.split('?')[0]}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = source;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Could not load ${source}`));
    document.head.appendChild(script);
  });

  const installSettings = preference => {
    const grid = document.querySelector('#settingsView .settings-grid');
    if (!grid) return false;

    let card = document.getElementById('kn35SearchStyleSettings');
    if (!card) {
      card = document.createElement('article');
      card.id = 'kn35SearchStyleSettings';
      card.className = 'glass-panel settings-card full-span';
      card.innerHTML = `
        <div class="kn35-setting-row">
          <div>
            <h3>Search bar style</h3>
            <p>Keep the new thirty-frame Luffy Haki arm, or switch back to the original search punch.</p>
          </div>
          <label class="kn35-switch" for="kn35ClassicSearch" aria-label="Use the classic search bar">
            <input id="kn35ClassicSearch" type="checkbox">
            <span class="kn35-switch-track" aria-hidden="true"></span>
          </label>
        </div>
        <p class="kn35-search-choice" id="kn35SearchChoice"></p>
      `;
      grid.prepend(card);
    }

    const toggle = card.querySelector('#kn35ClassicSearch');
    const choice = card.querySelector('#kn35SearchChoice');
    if (!toggle || !choice) return false;

    toggle.checked = preference === CLASSIC;
    choice.textContent = toggle.checked
      ? 'Classic search is active.'
      : 'New Luffy arm search is active.';

    if (!toggle.dataset.kn35Bound) {
      toggle.dataset.kn35Bound = '1';
      toggle.addEventListener('change', () => {
        const next = toggle.checked ? CLASSIC : LUFFY;
        if (!savePreference(next)) {
          toggle.checked = !toggle.checked;
          return;
        }
        choice.textContent = toggle.checked
          ? 'Switching to the classic search…'
          : 'Switching to the Luffy arm search…';
        window.setTimeout(() => window.location.reload(), 180);
      });
    }
    return true;
  };

  const installClassic = async () => {
    document.documentElement.dataset.knSearchStyle = CLASSIC;
    try {
      await loadScript('./rubber-search-v11.js?release=11');
      await loadScript('./rubber-search-compact-v12.js?release=12');
    } catch (error) {
      console.error('KageNexus classic search could not load', error);
    }
  };

  const installLuffy = () => {
    const box = document.getElementById('rubberSearch');
    const input = document.getElementById('globalSearch');
    const button = document.getElementById('searchPunch');
    if (!box || !input || !button) return false;
    if (box.dataset.luffyArmV35) return true;

    document.documentElement.dataset.knSearchStyle = LUFFY;
    box.dataset.luffyArmV35 = VERSION;
    box.removeAttribute('data-haki-punch-v11');
    box.removeAttribute('data-compact-v12');
    box.classList.remove(
      'open',
      'is-winding',
      'is-punching',
      'is-retracting',
      'is-confirming',
      'has-query'
    );

    [...box.children].forEach(child => {
      if (child !== input && child !== button) child.remove();
    });

    const stillImage = document.createElement('img');
    stillImage.className = 'kn35-arm-image kn35-arm-still';
    stillImage.src = COILED_SOURCE;
    stillImage.alt = '';
    stillImage.setAttribute('aria-hidden', 'true');

    const animationImage = document.createElement('img');
    animationImage.className = 'kn35-arm-image kn35-arm-animation';
    animationImage.alt = '';
    animationImage.setAttribute('aria-hidden', 'true');

    const canvas = document.createElement('canvas');
    canvas.className = 'kn35-effects';
    canvas.setAttribute('aria-hidden', 'true');

    const closeButton = document.createElement('button');
    closeButton.className = 'kn35-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close search');
    closeButton.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6l12 12M18 6 6 18"></path>
      </svg>
    `;

    button.innerHTML = `
      <span class="kn35-search-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <circle cx="10.5" cy="10.5" r="6.5"></circle>
          <path d="m15.5 15.5 5 5"></path>
        </svg>
      </span>
    `;
    button.setAttribute('aria-label', 'Open Luffy arm search');
    input.setAttribute('aria-label', 'Search anime or franchise');

    box.prepend(stillImage, animationImage, canvas);
    box.append(input, button, closeButton);

    const context = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let state = 'closed';
    let timers = [];
    let animationFrame = 0;
    let particles = [];

    const later = (delay, callback) => {
      const timer = window.setTimeout(callback, delay);
      timers.push(timer);
      return timer;
    };

    const clearTimers = () => {
      timers.forEach(timer => window.clearTimeout(timer));
      timers = [];
    };

    const resizeCanvas = () => {
      if (!context) return;
      const rect = box.getBoundingClientRect();
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const drawEffects = () => {
      if (!context) return;
      const rect = box.getBoundingClientRect();
      context.clearRect(0, 0, rect.width, rect.height);
      particles = particles.filter(particle => particle.life > 0);

      particles.forEach(particle => {
        particle.life -= 1;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= .96;
        particle.vy *= .96;
        const alpha = Math.max(0, particle.life / particle.maxLife);
        context.save();
        context.globalAlpha = alpha;
        context.fillStyle = particle.smoke ? 'rgba(220,220,235,.28)' : '#ff2946';
        context.shadowColor = particle.smoke ? '#fff' : '#ff1738';
        context.shadowBlur = particle.smoke ? 18 : 12;
        context.translate(particle.x, particle.y);
        if (particle.smoke) {
          context.beginPath();
          context.arc(0, 0, particle.size, 0, Math.PI * 2);
          context.fill();
        } else {
          context.rotate(Math.atan2(particle.vy, particle.vx));
          context.fillRect(-particle.size * 2.4, -particle.size / 2, particle.size * 4.8, particle.size);
        }
        context.restore();
      });

      if (particles.length) {
        animationFrame = window.requestAnimationFrame(drawEffects);
      } else {
        animationFrame = 0;
      }
    };

    const burst = (count, x, y, smoke = false) => {
      if (!context) return;
      for (let index = 0; index < count; index += 1) {
        const angle = smoke
          ? Math.PI + (Math.random() - .5) * 1.4
          : Math.random() * Math.PI * 2;
        const speed = (smoke ? .8 : 2.5) * (.6 + Math.random() * 1.2);
        const life = smoke ? 70 + Math.random() * 35 : 30 + Math.random() * 25;
        particles.push({
          smoke,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (smoke ? .35 : 0),
          size: smoke ? 8 + Math.random() * 18 : 1.5 + Math.random() * 3,
          life,
          maxLife: life
        });
      }
      if (!animationFrame) animationFrame = window.requestAnimationFrame(drawEffects);
    };

    const restartAnimation = source => {
      animationImage.removeAttribute('src');
      void animationImage.offsetWidth;
      animationImage.src = source;
    };

    const finishOpen = () => {
      box.classList.remove('kn35-playing', 'kn35-impact');
      box.classList.add('kn35-ready', 'open');
      stillImage.src = SEARCH_SOURCE;
      state = 'open';
      button.setAttribute('aria-label', 'Search');
      input.focus({ preventScroll: true });
    };

    const runOpen = () => {
      if (state !== 'closed') return;
      clearTimers();
      state = 'opening';
      box.classList.remove('kn35-ready');
      box.classList.add('kn35-playing');
      restartAnimation(OPEN_SOURCE);
      button.setAttribute('aria-label', 'Opening Luffy arm search');
      burst(16, box.clientWidth * .75, box.clientHeight * .5, true);

      if (reducedMotion) {
        finishOpen();
        return;
      }

      later(1150, () => {
        if (state !== 'opening') return;
        box.classList.add('kn35-impact');
        burst(52, box.clientWidth * .15, box.clientHeight * .5);
        burst(24, box.clientWidth * .2, box.clientHeight * .5, true);
      });
      later(1420, () => box.classList.remove('kn35-impact'));
      later(1800, finishOpen);
    };

    const finishClose = () => {
      box.classList.remove('kn35-playing', 'kn35-impact', 'open');
      stillImage.src = COILED_SOURCE;
      state = 'closed';
      button.setAttribute('aria-label', 'Open Luffy arm search');
    };

    const runClose = () => {
      if (state !== 'open') return;
      clearTimers();
      state = 'closing';
      box.classList.remove('kn35-ready', 'kn35-search-pulse', 'open');
      box.classList.add('kn35-playing');
      input.blur();
      restartAnimation(CLOSE_SOURCE);
      burst(20, box.clientWidth * .55, box.clientHeight * .5);

      if (reducedMotion) {
        finishClose();
        return;
      }
      later(1800, finishClose);
    };

    button.addEventListener('click', event => {
      if (state === 'closed') {
        runOpen();
        return;
      }
      if (state !== 'open') {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      box.classList.remove('kn35-search-pulse');
      void box.offsetWidth;
      box.classList.add('kn35-search-pulse');
      later(560, () => box.classList.remove('kn35-search-pulse'));
    }, true);

    closeButton.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      runClose();
    }, true);

    input.addEventListener('keydown', event => {
      if (event.key === 'Escape' && state === 'open') runClose();
      if (event.key === 'Enter' && state === 'open') {
        box.classList.remove('kn35-search-pulse');
        void box.offsetWidth;
        box.classList.add('kn35-search-pulse');
        later(560, () => box.classList.remove('kn35-search-pulse'));
      }
    }, true);

    document.addEventListener('pointerdown', event => {
      if (
        state === 'open' &&
        !box.contains(event.target) &&
        !input.value.trim()
      ) {
        runClose();
      }
    }, true);

    if ('ResizeObserver' in window) {
      new ResizeObserver(resizeCanvas).observe(box);
    } else {
      window.addEventListener('resize', resizeCanvas, { passive: true });
    }
    resizeCanvas();
    window.addEventListener('pagehide', () => {
      clearTimers();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    }, { once: true });
    return true;
  };

  let started = false;
  const start = () => {
    if (started) return true;
    const preference = readPreference();
    if (!document.getElementById('rubberSearch')) return false;
    started = true;
    addStylesheet('./luffy-search-v35.css?release=35', 'luffy-search-v35.css');
    installSettings(preference);
    if (preference === CLASSIC) installClassic();
    else installLuffy();
    return true;
  };

  if (!start()) {
    window.addEventListener('anime-haven-ready', start, { once: true });
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (start() || tries > 180) window.clearInterval(timer);
    }, 100);
  }
})();
