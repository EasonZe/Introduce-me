(() => {
  const root = document.documentElement;
  const $ = (selector, base = document) => base.querySelector(selector);
  const $$ = (selector, base = document) => Array.from(base.querySelectorAll(selector));

  const CONFIG = {
    siteStartDate: '2026-06-04',
    typingTexts: [
      '慢慢来，所有热爱都会发光。',
      '把普通日子过成自己的星河。',
      '今天也要向喜欢的未来靠近一点。',
      '奔赴星辰大海，不负心中热爱。'
    ]
  };

  const customState = {
    hue: Number(localStorage.getItem('custom-hue') || 210),
    bgMode: localStorage.getItem('custom-bg-mode') || 'default',
    showHeroText: localStorage.getItem('custom-show-hero-text') !== '0',
    showStars: localStorage.getItem('custom-show-stars') !== '0',
    showMeteor: localStorage.getItem('custom-show-meteor') !== '0',
    showMist: localStorage.getItem('custom-show-mist') !== '0',
    showDividerFx: localStorage.getItem('custom-show-divider-fx') !== '0'
  };

  function currentTheme() {
    return root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function updateThemeButton() {
    const dark = currentTheme() === 'dark';
    const text = $('#themeText');
    const icon = $('#themeIcon');
    if (text) text.textContent = dark ? '浅色' : '深色';
    if (icon) icon.innerHTML = dark
      ? '<path d="M12 4v1.5M12 18.5V20M4 12h1.5M18.5 12H20M6.3 6.3l1 1M16.7 16.7l1 1M17.7 6.3l-1 1M7.3 16.7l-1 1"></path><circle cx="12" cy="12" r="4"></circle>'
      : '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"></path>';
  }

  function applyAccentHue(hueValue) {
    const hue = ((Number(hueValue) % 360) + 360) % 360;
    const dark = currentTheme() === 'dark';
    root.style.setProperty('--mist', dark ? `hsl(${hue} 42% 66%)` : `hsl(${hue} 42% 74%)`);
    root.style.setProperty('--mist-2', dark ? `hsl(${(hue + 14) % 360} 25% 38%)` : `hsl(${(hue + 12) % 360} 42% 84%)`);
    root.style.setProperty('--mist-3', dark ? `hsl(${(hue + 8) % 360} 32% 12%)` : `hsl(${(hue + 8) % 360} 48% 96%)`);
    root.style.setProperty('--pink', dark ? `hsl(${(hue + 34) % 360} 46% 72%)` : `hsl(${(hue + 34) % 360} 52% 78%)`);
    root.style.setProperty('--line', dark ? `hsla(${hue} 28% 82% / .14)` : `hsla(${hue} 24% 46% / .22)`);
    $('#hueValue') && ($('#hueValue').textContent = hue);
    $('#hueSlider') && ($('#hueSlider').value = hue);
    localStorage.setItem('custom-hue', String(hue));
  }

  function applyBackgroundMode(mode) {
    const safeMode = ['default', 'night'].includes(mode) ? mode : 'default';
    root.classList.remove('bg-gradient', 'bg-night', 'bg-solid');
    if (safeMode !== 'default') root.classList.add(`bg-${safeMode}`);
    customState.bgMode = safeMode;
    localStorage.setItem('custom-bg-mode', safeMode);
    $$('[data-bg-mode]').forEach((btn) => btn.classList.toggle('active', btn.dataset.bgMode === safeMode));
  }

  function applyWallpaperSwitches() {
    root.classList.toggle('custom-hide-hero-text', !customState.showHeroText);
    root.classList.toggle('custom-hide-stars', !customState.showStars);
    root.classList.toggle('custom-hide-meteor', !customState.showMeteor);
    root.classList.toggle('custom-hide-mist', !customState.showMist);
    root.classList.toggle('custom-hide-divider-fx', !customState.showDividerFx);
    const pairs = [
      ['toggleHeroText', 'showHeroText'],
      ['toggleStars', 'showStars'],
      ['toggleMeteor', 'showMeteor'],
      ['toggleMist', 'showMist'],
      ['toggleDividerFx', 'showDividerFx']
    ];
    pairs.forEach(([id, key]) => {
      const input = $(`#${id}`);
      if (input) input.checked = customState[key];
      localStorage.setItem(`custom-${key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`, customState[key] ? '1' : '0');
    });
  }

  function initThemePalette() {
    if (localStorage.getItem('theme')) root.dataset.theme = localStorage.getItem('theme');
    updateThemeButton();
    applyAccentHue(customState.hue);
    applyBackgroundMode(customState.bgMode);
    applyWallpaperSwitches();
    $('#themeBtn')?.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem('theme', next);
      updateThemeButton();
      applyAccentHue(customState.hue);
    });
    $('#paletteBtn')?.addEventListener('click', () => openModal('#paletteModal'));
    $('#hueSlider')?.addEventListener('input', (event) => applyAccentHue(event.target.value));
    $$('[data-bg-mode]').forEach((btn) => btn.addEventListener('click', () => applyBackgroundMode(btn.dataset.bgMode)));
    $('#paletteResetBtn')?.addEventListener('click', () => {
      localStorage.removeItem('custom-hue');
      localStorage.removeItem('custom-bg-mode');
      ['custom-show-hero-text', 'custom-show-stars', 'custom-show-meteor', 'custom-show-mist', 'custom-show-divider-fx'].forEach((key) => localStorage.removeItem(key));
      Object.assign(customState, { hue: 210, bgMode: 'default', showHeroText: true, showStars: true, showMeteor: true, showMist: true, showDividerFx: true });
      applyAccentHue(210);
      applyBackgroundMode('default');
      applyWallpaperSwitches();
    });
    [
      ['toggleHeroText', 'showHeroText'],
      ['toggleStars', 'showStars'],
      ['toggleMeteor', 'showMeteor'],
      ['toggleMist', 'showMist'],
      ['toggleDividerFx', 'showDividerFx']
    ].forEach(([id, key]) => $(`#${id}`)?.addEventListener('change', (event) => {
      customState[key] = event.target.checked;
      applyWallpaperSwitches();
    }));
  }

  function openModal(target) {
    const modal = typeof target === 'string' ? $(target) : target;
    if (!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    if (!$('.modal.show')) document.body.classList.remove('modal-open');
  }

  function initModal() {
    $$('[data-close-modal]').forEach((btn) => btn.addEventListener('click', () => closeModal(btn.closest('.modal'))));
    $$('.modal').forEach((modal) => modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    }));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') $$('.modal.show').forEach(closeModal);
    });
  }

  function initTyping() {
    const el = $('#typeText');
    if (!el) return;
    let textIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let holdTicks = 0;

    const tick = () => {
      const text = CONFIG.typingTexts[textIndex % CONFIG.typingTexts.length];

      if (!deleting) {
        el.textContent = text.slice(0, charIndex);
        if (charIndex < text.length) {
          charIndex += 1;
          setTimeout(tick, 135);
          return;
        }
        if (holdTicks < 1) {
          holdTicks += 1;
          setTimeout(tick, 1700);
          return;
        }
        deleting = true;
        holdTicks = 0;
        setTimeout(tick, 650);
        return;
      }

      el.textContent = text.slice(0, charIndex);
      if (charIndex > 0) {
        charIndex -= 1;
        setTimeout(tick, 70);
        return;
      }

      deleting = false;
      textIndex += 1;
      setTimeout(tick, 520);
    };

    tick();
  }

  function initStars() {
    const canvas = $('#starsCanvas');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let stars = [];
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.min(120, Math.floor(innerWidth * innerHeight / 11000)) }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() * 1.4 + .3,
        a: Math.random(),
        s: Math.random() * .018 + .006
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      if (!root.classList.contains('custom-hide-stars')) {
        stars.forEach((star) => {
          star.a += star.s;
          const alpha = .24 + Math.abs(Math.sin(star.a)) * .5;
          ctx.beginPath();
          ctx.fillStyle = `rgba(210,230,244,${alpha})`;
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      requestAnimationFrame(draw);
    };
    resize(); draw();
    addEventListener('resize', resize, { passive: true });
  }

  function initMeteor() {
    const layer = $('#meteorLayer');
    if (!layer) return;
    const spawn = () => {
      if (!root.classList.contains('custom-hide-meteor')) {
        const meteor = document.createElement('span');
        meteor.className = 'meteor fly';
        meteor.style.left = `${Math.random() * 90 + 8}vw`;
        meteor.style.top = `${Math.random() * 45 + 4}vh`;
        meteor.style.animationDuration = `${Math.random() * 1.2 + 1.2}s`;
        layer.appendChild(meteor);
        setTimeout(() => meteor.remove(), 2600);
      }
      setTimeout(spawn, Math.random() * 4200 + 2600);
    };
    setTimeout(spawn, 1200);
  }

  function initNavigation() {
    const backTop = $('#backTopBtn');
    const nav = $('#siteNav');
    const onScroll = () => {
      const top = window.scrollY || document.documentElement.scrollTop || 0;
      backTop?.classList.toggle('is-hidden', top < 220);
      nav?.classList.toggle('nav-collapsed-top', top <= 90);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    $$('[data-scroll-target]').forEach((btn) => btn.addEventListener('click', () => {
      const target = $(btn.dataset.scrollTarget || '');
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));

    $$('a[href="#messageBox"]').forEach((link) => link.addEventListener('click', () => {
      const details = $('.message-accordion');
      if (details) details.open = true;
    }));

    onScroll();
  }

  function initFooterRuntime() {
    const runFooter = $('#runFooter');
    if (!runFooter) return;
    const start = new Date(CONFIG.siteStartDate + 'T00:00:00');
    const update = () => {
      const diff = Math.max(0, Date.now() - start.getTime());
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor(diff / 3600000) % 24;
      const minutes = Math.floor(diff / 60000) % 60;
      const seconds = Math.floor(diff / 1000) % 60;
      runFooter.textContent = `${days}天 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    update();
    setInterval(update, 1000);
  }

  initModal();
  initThemePalette();
  initTyping();
  initStars();
  initMeteor();
  initNavigation();
  initFooterRuntime();
})();
