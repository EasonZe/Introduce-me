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

  function normalizeHue(value, fallback = 210) {
    const num = Number(value);
    if (!Number.isFinite(num)) return fallback;
    return Math.min(360, Math.max(0, Math.round(num)));
  }

  const customState = {
    hue: normalizeHue(localStorage.getItem('custom-hue') ?? 210),
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
    const displayHue = normalizeHue(hueValue, customState.hue || 210);
    const cssHue = displayHue === 360 ? 0 : displayHue;
    const dark = currentTheme() === 'dark';
    customState.hue = displayHue;

    root.style.setProperty('--mist', dark ? `hsl(${cssHue} 46% 66%)` : `hsl(${cssHue} 44% 74%)`);
    root.style.setProperty('--mist-2', dark ? `hsl(${(cssHue + 14) % 360} 28% 38%)` : `hsl(${(cssHue + 12) % 360} 44% 84%)`);
    root.style.setProperty('--mist-3', dark ? `hsl(${(cssHue + 8) % 360} 34% 12%)` : `hsl(${(cssHue + 8) % 360} 50% 96%)`);
    root.style.setProperty('--pink', dark ? `hsl(${(cssHue + 34) % 360} 48% 72%)` : `hsl(${(cssHue + 34) % 360} 54% 78%)`);
    root.style.setProperty('--accent', dark ? `hsl(${cssHue} 72% 70%)` : `hsl(${cssHue} 62% 56%)`);
    root.style.setProperty('--accent-2', dark ? `hsl(${(cssHue + 24) % 360} 68% 66%)` : `hsl(${(cssHue + 24) % 360} 68% 62%)`);
    root.style.setProperty('--accent-3', dark ? `hsl(${(cssHue + 44) % 360} 58% 72%)` : `hsl(${(cssHue + 44) % 360} 64% 70%)`);
    root.style.setProperty('--accent-soft', dark ? `hsla(${cssHue} 64% 68% / .18)` : `hsla(${cssHue} 66% 58% / .16)`);
    root.style.setProperty('--accent-faint', dark ? `hsla(${cssHue} 70% 72% / .08)` : `hsla(${cssHue} 72% 60% / .10)`);
    root.style.setProperty('--accent-border', dark ? `hsla(${cssHue} 48% 78% / .26)` : `hsla(${cssHue} 48% 44% / .28)`);
    root.style.setProperty('--accent-glow', dark ? `hsla(${cssHue} 76% 68% / .28)` : `hsla(${cssHue} 72% 58% / .22)`);
    root.style.setProperty('--line', dark ? `hsla(${cssHue} 32% 82% / .16)` : `hsla(${cssHue} 28% 46% / .24)`);
    root.style.setProperty('--shadow', dark ? `0 18px 55px hsla(${cssHue} 60% 5% / .38)` : `0 18px 50px hsla(${cssHue} 35% 45% / .18)`);

    $('#hueValue') && ($('#hueValue').textContent = displayHue);
    $('#hueSlider') && ($('#hueSlider').value = displayHue);
    localStorage.setItem('custom-hue', String(displayHue));
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

    const TYPE_BASE = 82;
    const DELETE_BASE = 42;
    const HOLD_AFTER_TYPE = 1550;
    const HOLD_AFTER_DELETE = 460;

    const nextDelay = (text, typedChar = '') => {
      if (deleting) return DELETE_BASE + Math.random() * 18;
      if ('，。！？、'.includes(typedChar)) return TYPE_BASE + 140;
      return TYPE_BASE + Math.random() * 26;
    };

    const tick = () => {
      const text = CONFIG.typingTexts[textIndex % CONFIG.typingTexts.length];

      if (!deleting) {
        charIndex = Math.min(text.length, charIndex + 1);
        el.textContent = text.slice(0, charIndex);
        if (charIndex < text.length) {
          setTimeout(tick, nextDelay(text, text[charIndex - 1]));
          return;
        }
        deleting = true;
        setTimeout(tick, HOLD_AFTER_TYPE);
        return;
      }

      charIndex = Math.max(0, charIndex - 1);
      el.textContent = text.slice(0, charIndex);
      if (charIndex > 0) {
        setTimeout(tick, nextDelay(text));
        return;
      }

      deleting = false;
      textIndex += 1;
      setTimeout(tick, HOLD_AFTER_DELETE);
    };

    setTimeout(tick, 260);
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



  function initPhysicsBlocks() {
    const card = $('#physicsCard');
    const stage = $('#physicsStage');
    if (!card || !stage) return;

    let started = false;
    let engine = null;
    let render = null;
    let runner = null;
    let bodies = [];
    let blockEls = [];
    let stageWidth = 0;
    let stageHeight = 0;
    let animationFrameId = 0;
    let spawnQueue = [];
    let spawnTimer = 0;
    let attachDomDrag = null;

    function loadMatter() {
      if (window.Matter) return Promise.resolve(window.Matter);
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/matter-js@0.20.0/build/matter.min.js';
        script.async = true;
        script.onload = () => window.Matter ? resolve(window.Matter) : reject(new Error('Matter.js 未加载成功'));
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    const games = [
      { name: 'Astroneer', src: 'images/game_full/astroneer.png', ratio: 0.6667 },
      { name: 'Delta Force', src: 'images/game_full/delta_force.png', ratio: 0.7765 },
      { name: "Don't Starve", src: 'images/game_full/dont_starve.png', ratio: 0.6667 },
      { name: "Garry's Mod", src: 'images/game_full/garrys_mod.png', ratio: 0.6655 },
      { name: 'Goat Simulator', src: 'images/game_full/goat_simulator.png', ratio: 0.6708 },
      { name: 'Half-Life', src: 'images/game_full/half_life.png', ratio: 0.6961 },
      { name: 'Half-Life 2', src: 'images/game_full/half_life_2.png', ratio: 0.727 },
      { name: 'Jalopy', src: 'images/game_full/jalopy.png', ratio: 0.6667 },
      { name: 'Left 4 Dead 2', src: 'images/game_full/left4dead2.png', ratio: 0.6667 },
      { name: 'Lethal Company', src: 'images/game_full/lethal_company.png', ratio: 0.6667 },
      { name: 'Minecraft', src: 'images/game_full/minecraft.png', ratio: 0.6655 },
      { name: 'Outer Wilds', src: 'images/game_full/outer_wilds.png', ratio: 0.7767 },
      { name: 'Rust', src: 'images/game_full/rust.png', ratio: 0.749 },
      { name: 'Secret Laboratory', src: 'images/game_full/secret_laboratory.png', ratio: 0.7022 },
      { name: 'Slime Rancher', src: 'images/game_full/slime_rancher.png', ratio: 0.6655 },
      { name: 'Stardew Valley', src: 'images/game_full/stardew_valley.png', ratio: 0.75 },
      { name: 'Team Fortress 2', src: 'images/game_full/team_fortress_2.jpg', ratio: 0.6655 },
      { name: 'The Forest', src: 'images/game_full/the_forest.png', ratio: 0.6667 },
      { name: 'R.E.P.O.', src: 'images/game_full/repo.jpg', ratio: 0.6786 },
      { name: 'Undertale', src: 'images/game_full/undertale.png', ratio: 0.7636 },
      { name: 'Unturned', src: 'images/game_full/unturned.png', ratio: 0.6699 },
      { name: 'VRChat', src: 'images/game_full/vrchat.png', ratio: 0.749 },
      { name: 'We Happy Few', src: 'images/game_full/we_happy_few.png', ratio: 0.7765 }
    ];

    function createDomBlock(game, width, height) {
      const el = document.createElement('div');
      el.className = 'game-physics-block';
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.dataset.game = game.name;
      el.style.opacity = '0';
      el.style.touchAction = 'none';

      const img = document.createElement('img');
      img.src = game.src;
      img.alt = game.name;
      img.draggable = false;
      img.loading = 'eager';
      img.onerror = () => {
        el.textContent = game.name;
        el.style.display = 'grid';
        el.style.placeItems = 'center';
        el.style.textAlign = 'center';
        el.style.fontSize = '11px';
        el.style.fontWeight = '900';
        el.style.color = '#fff';
      };
      el.appendChild(img);

      stage.appendChild(el);
      return el;
    }

    function buildBlocks(Matter, width) {
      const { Bodies } = Matter;
      const allGames = games.slice();
      const total = allGames.length;
      const maxLongSide = Math.max(40, Math.min(60, Math.floor(width / 13.8)));
      const minShortSide = 24;
      const safePadding = 22;
      const spawnBand = Math.min(88, width * 0.14);

      bodies = [];
      blockEls = [];
      spawnQueue = [];

      allGames.forEach((game, index) => {
        let blockW, blockH;
        if (game.ratio >= 1) {
          blockW = maxLongSide;
          blockH = Math.max(minShortSide, Math.round(maxLongSide / game.ratio));
        } else {
          blockH = maxLongSide;
          blockW = Math.max(minShortSide, Math.round(maxLongSide * game.ratio));
        }

        const xBase = safePadding + blockW / 2 + 6;
        const x = Math.max(blockW / 2 + 10, Math.min(width - blockW / 2 - 10, xBase + Math.random() * spawnBand));
        const y = -blockH - 30 - index * 6;

        const body = Bodies.rectangle(x, y, blockW, blockH, {
          restitution: 0.48,
          friction: 0.72,
          frictionStatic: 0.78,
          frictionAir: 0.01,
          density: 0.0028,
          angle: (Math.random() - 0.5) * 0.18,
          render: { visible: false }
        });

        const el = createDomBlock(game, blockW, blockH);
        body.plugin = { domEl: el, width: blockW, height: blockH };

        spawnQueue.push(body);
        blockEls.push(el);
      });
    }

    function startSpawnSequence(Matter, world) {
      const { Composite } = Matter;
      if (spawnTimer) {
        window.clearTimeout(spawnTimer);
        spawnTimer = 0;
      }

      const dropNext = () => {
        const body = spawnQueue.shift();
        if (!body) {
          spawnTimer = 0;
          return;
        }
        const el = body.plugin?.domEl;
        if (el) el.style.opacity = '1';
        if (typeof attachDomDrag === 'function') attachDomDrag(body);
        bodies.push(body);
        Composite.add(world, body);
        spawnTimer = spawnQueue.length
          ? window.setTimeout(dropNext, 150 + Math.random() * 130)
          : 0;
      };

      spawnTimer = window.setTimeout(dropNext, 120);
    }

    function startPhysics(Matter) {
      if (started) return;
      started = true;
      stage.classList.add('is-ready');

      const { Engine, Render, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;
      const rect = stage.getBoundingClientRect();
      stageWidth = Math.max(320, Math.floor(rect.width));
      stageHeight = Math.max(320, Math.floor(rect.height));

      engine = Engine.create();
      engine.gravity.y = 1;

      render = Render.create({
        element: stage,
        engine,
        options: {
          width: stageWidth,
          height: stageHeight,
          wireframes: false,
          background: 'transparent',
          pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
        }
      });

      const wallThickness = 80;
      const floor = Bodies.rectangle(stageWidth / 2, stageHeight + wallThickness / 2 - 8, stageWidth + wallThickness * 2, wallThickness, {
        isStatic: true,
        label: 'floor',
        render: { visible: false }
      });
      const leftWall = Bodies.rectangle(-wallThickness / 2 + 4, stageHeight / 2, wallThickness, stageHeight * 2, {
        isStatic: true,
        label: 'leftWall',
        render: { visible: false }
      });
      const rightWall = Bodies.rectangle(stageWidth + wallThickness / 2 - 4, stageHeight / 2, wallThickness, stageHeight * 2, {
        isStatic: true,
        label: 'rightWall',
        render: { visible: false }
      });

      Composite.add(engine.world, [floor, leftWall, rightWall]);
      buildBlocks(Matter, stageWidth);

      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.18,
          damping: 0.08,
          render: { visible: false }
        }
      });
      Composite.add(engine.world, mouseConstraint);
      render.mouse = mouse;

      render.canvas.style.pointerEvents = 'none';
      render.canvas.style.touchAction = 'pan-y';

      let activeDragBody = null;
      let activePointerId = null;
      let lastDragPoint = null;

      const getStagePoint = (event) => {
        const box = stage.getBoundingClientRect();
        return {
          x: event.clientX - box.left,
          y: event.clientY - box.top
        };
      };

      const clampPointInsideStage = (body, point) => {
        const halfW = Math.max(10, (body.bounds.max.x - body.bounds.min.x) / 2);
        const halfH = Math.max(10, (body.bounds.max.y - body.bounds.min.y) / 2);
        return {
          x: Math.min(stageWidth - halfW - 8, Math.max(halfW + 8, point.x)),
          y: Math.min(stageHeight - halfH - 8, Math.max(halfH + 8, point.y))
        };
      };

      attachDomDrag = (body) => {
        const el = body.plugin?.domEl;
        if (!el || el.dataset.dragBound === '1') return;
        el.dataset.dragBound = '1';

        const endDrag = (event) => {
          if (activeDragBody !== body) return;
          activeDragBody = null;
          activePointerId = null;
          lastDragPoint = null;
          try { el.releasePointerCapture?.(event.pointerId); } catch (_) {}
        };

        el.addEventListener('pointerdown', (event) => {
          activeDragBody = body;
          activePointerId = event.pointerId;
          const point = clampPointInsideStage(body, getStagePoint(event));
          lastDragPoint = point;
          Body.setPosition(body, point);
          Body.setVelocity(body, { x: 0, y: 0 });
          el.setPointerCapture?.(event.pointerId);
          event.preventDefault();
          event.stopPropagation();
        }, { passive: false });

        el.addEventListener('pointermove', (event) => {
          if (activeDragBody !== body || activePointerId !== event.pointerId) return;
          const point = clampPointInsideStage(body, getStagePoint(event));
          Body.setPosition(body, point);
          if (lastDragPoint) {
            Body.setVelocity(body, {
              x: (point.x - lastDragPoint.x) * 0.35,
              y: (point.y - lastDragPoint.y) * 0.35
            });
          }
          lastDragPoint = point;
          event.preventDefault();
        }, { passive: false });

        el.addEventListener('pointerup', endDrag);
        el.addEventListener('pointercancel', endDrag);
        el.addEventListener('lostpointercapture', () => {
          if (activeDragBody === body) {
            activeDragBody = null;
            activePointerId = null;
            lastDragPoint = null;
          }
        });
      };

      const clampBodyInsideStage = (body) => {
        if (!body || body.isStatic) return;
        const halfW = Math.max(10, (body.bounds.max.x - body.bounds.min.x) / 2);
        const halfH = Math.max(10, (body.bounds.max.y - body.bounds.min.y) / 2);
        const x = Math.min(stageWidth - halfW - 8, Math.max(halfW + 8, body.position.x));
        const y = Math.min(stageHeight - halfH - 8, Math.max(halfH + 8, body.position.y));
        if (x !== body.position.x || y !== body.position.y) {
          Body.setPosition(body, { x, y });
          Body.setVelocity(body, { x: body.velocity.x * 0.55, y: body.velocity.y * 0.55 });
        }
      };

      Events.on(engine, 'beforeUpdate', () => {
        if (activeDragBody) clampBodyInsideStage(activeDragBody);
        if (mouseConstraint.body) clampBodyInsideStage(mouseConstraint.body);
      });

      Events.on(engine, 'afterUpdate', () => {
        bodies.forEach(clampBodyInsideStage);
      });

      function syncDomBlocks() {
        bodies.forEach((body) => {
          const el = body.plugin?.domEl;
          if (!el) return;
          const w = body.plugin.width;
          const h = body.plugin.height;
          el.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`;
        });
        animationFrameId = requestAnimationFrame(syncDomBlocks);
      }

      Render.run(render);
      runner = Runner.create();
      Runner.run(runner, engine);
      syncDomBlocks();
      startSpawnSequence(Matter, engine.world);

      window.addEventListener('resize', () => {
        // 简单处理：刷新后重新计算最稳，避免旋转屏幕造成边界错位
      }, { passive: true });
    }

    function showFallback() {
      const loading = $('#physicsLoading');
      if (loading) loading.textContent = '物理引擎加载失败，请刷新页面重试。';
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      loadMatter().then(startPhysics).catch(showFallback);
    }, { threshold: 0.24 });

    observer.observe(card);
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
  initPhysicsBlocks();
  initFooterRuntime();
})();
