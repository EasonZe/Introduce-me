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
          setTimeout(tick, 105);
          return;
        }
        if (holdTicks < 1) {
          holdTicks += 1;
          setTimeout(tick, 1300);
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
        setTimeout(tick, 55);
        return;
      }

      deleting = false;
      textIndex += 1;
      setTimeout(tick, 420);
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



  function initPhysicsBlocks() {
    const card = $('#physicsCard');
    const stage = $('#physicsStage');
    if (!card || !stage) return;

    let started = false;
    let engine = null;
    let render = null;
    let runner = null;
    let resizeTimer = null;

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

    function makeBlocks(Matter, world, width) {
      const { Bodies, Composite } = Matter;
      const sourceGames = [{"name": "minecraft", "texture": "images/game_full/minecraft.jpg", "w": 183, "h": 275}, {"name": "terraria", "texture": "images/game_full/terraria.jpg", "w": 250, "h": 375}, {"name": "stardew_valley", "texture": "images/game_full/stardew_valley.jpg", "w": 600, "h": 800}, {"name": "dont_starve", "texture": "images/game_full/dont_starve.jpg", "w": 466, "h": 214}, {"name": "gmod", "texture": "images/game_full/gmod.png", "w": 225, "h": 225}, {"name": "half_life", "texture": "images/game_full/half_life.jpg", "w": 329, "h": 153}, {"name": "half_life_2", "texture": "images/game_full/half_life_2.webp", "w": 516, "h": 290}, {"name": "vrchat", "texture": "images/game_full/vrchat.jpg", "w": 297, "h": 170}, {"name": "rust", "texture": "images/game_full/rust.jpg", "w": 616, "h": 353}, {"name": "left4dead2", "texture": "images/game_full/left4dead2.jpg", "w": 297, "h": 170}];
      const gameBlocks = sourceGames.concat(sourceGames);
      const totalBlocks = gameBlocks.length;
      const maxLongSide = Math.max(54, Math.min(78, Math.floor(width / 12)));
      const minShortSide = 30;
      const safePadding = 22;
      const usableWidth = Math.max(maxLongSide * 8.5, width - safePadding * 2);
      const slotGap = usableWidth / Math.max(1, totalBlocks - 1);
      const slots = Array.from({ length: totalBlocks }, (_, i) => safePadding + i * slotGap);

      for (let i = slots.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [slots[i], slots[j]] = [slots[j], slots[i]];
      }

      const blocks = gameBlocks.map((game, index) => {
        const aspect = game.w / game.h;
        let blockWidth, blockHeight;
        if (aspect >= 1) {
          blockWidth = maxLongSide;
          blockHeight = Math.max(minShortSide, Math.round(maxLongSide / aspect));
        } else {
          blockHeight = maxLongSide;
          blockWidth = Math.max(minShortSide, Math.round(maxLongSide * aspect));
        }
        const jitter = (Math.random() - 0.5) * 8;
        const x = Math.max(blockWidth / 2 + 10, Math.min(width - blockWidth / 2 - 10, slots[index] + jitter));
        const y = -60 - index * (maxLongSide * 0.82);
        return Bodies.rectangle(x, y, blockWidth, blockHeight, {
          restitution: 0.48,
          friction: 0.72,
          frictionStatic: 0.78,
          frictionAir: 0.01,
          density: 0.0028,
          angle: (Math.random() - 0.5) * 0.18,
          render: {
            sprite: {
              texture: game.texture,
              xScale: blockWidth / game.w,
              yScale: blockHeight / game.h
            }
          }
        });
      });

      Composite.add(world, blocks);
    }

    function startPhysics(Matter) {
      if (started) return;
      started = true;
      stage.classList.add('is-ready');

      const { Engine, Render, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;
      const rect = stage.getBoundingClientRect();
      const width = Math.max(320, Math.floor(rect.width));
      const height = Math.max(320, Math.floor(rect.height));

      engine = Engine.create();
      engine.gravity.y = 1;

      render = Render.create({
        element: stage,
        engine,
        options: {
          width,
          height,
          wireframes: false,
          background: 'transparent',
          pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
        }
      });

      const wallThickness = 80;
      const floor = Bodies.rectangle(width / 2, height + wallThickness / 2 - 8, width + wallThickness * 2, wallThickness, {
        isStatic: true,
        label: 'floor',
        render: { fillStyle: 'rgba(255,255,255,.12)' }
      });
      const leftWall = Bodies.rectangle(-wallThickness / 2 + 4, height / 2, wallThickness, height * 2, {
        isStatic: true,
        label: 'leftWall',
        render: { fillStyle: 'transparent' }
      });
      const rightWall = Bodies.rectangle(width + wallThickness / 2 - 4, height / 2, wallThickness, height * 2, {
        isStatic: true,
        label: 'rightWall',
        render: { fillStyle: 'transparent' }
      });

      Composite.add(engine.world, [floor, leftWall, rightWall]);
      makeBlocks(Matter, engine.world, width);

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

      render.canvas.addEventListener('touchmove', (event) => {
        if (mouseConstraint.body) event.preventDefault();
      }, { passive: false });

      Events.on(mouseConstraint, 'startdrag', () => {
        render.canvas.style.cursor = 'grabbing';
      });
      Events.on(mouseConstraint, 'enddrag', () => {
        render.canvas.style.cursor = 'grab';
      });
      render.canvas.style.cursor = 'grab';

      const clampBodyInsideStage = (body) => {
        if (!body || body.isStatic) return;
        const minX = 12;
        const maxX = width - 12;
        const minY = 12;
        const maxY = height - 12;
        const halfW = Math.max(10, (body.bounds.max.x - body.bounds.min.x) / 2);
        const halfH = Math.max(10, (body.bounds.max.y - body.bounds.min.y) / 2);
        const clampedX = Math.min(maxX - halfW, Math.max(minX + halfW, body.position.x));
        const clampedY = Math.min(maxY - halfH, Math.max(minY + halfH, body.position.y));
        if (clampedX !== body.position.x || clampedY !== body.position.y) {
          Body.setPosition(body, { x: clampedX, y: clampedY });
          Body.setVelocity(body, { x: body.velocity.x * 0.55, y: body.velocity.y * 0.55 });
        }
      };

      Events.on(engine, 'beforeUpdate', () => {
        const dragged = mouseConstraint.body;
        if (dragged) clampBodyInsideStage(dragged);
      });

      Events.on(engine, 'afterUpdate', () => {
        const bodies = Composite.allBodies(engine.world);
        for (const body of bodies) {
          if (!body.isStatic) clampBodyInsideStage(body);
        }
      });

      Render.run(render);
      runner = Runner.create();
      Runner.run(runner, engine);

      window.addEventListener('resize', () => {
        if (!render || !engine) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const nextRect = stage.getBoundingClientRect();
          const nextW = Math.max(320, Math.floor(nextRect.width));
          const nextH = Math.max(320, Math.floor(nextRect.height));
          const sx = nextW / render.options.width;
          const sy = nextH / render.options.height;

          render.bounds.max.x = nextW;
          render.bounds.max.y = nextH;
          render.options.width = nextW;
          render.options.height = nextH;
          render.canvas.width = nextW * Math.min(window.devicePixelRatio || 1, 2);
          render.canvas.height = nextH * Math.min(window.devicePixelRatio || 1, 2);
          render.canvas.style.width = nextW + 'px';
          render.canvas.style.height = nextH + 'px';

          Body.setPosition(floor, { x: nextW / 2, y: nextH + wallThickness / 2 - 8 });
          Body.setPosition(leftWall, { x: -wallThickness / 2 + 4, y: nextH / 2 });
          Body.setPosition(rightWall, { x: nextW + wallThickness / 2 - 4, y: nextH / 2 });
          Body.setVertices(floor, Bodies.rectangle(nextW / 2, nextH + wallThickness / 2 - 8, nextW + wallThickness * 2, wallThickness).vertices);
          Body.setVertices(leftWall, Bodies.rectangle(-wallThickness / 2 + 4, nextH / 2, wallThickness, nextH * 2).vertices);
          Body.setVertices(rightWall, Bodies.rectangle(nextW + wallThickness / 2 - 4, nextH / 2, wallThickness, nextH * 2).vertices);
        }, 180);
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
