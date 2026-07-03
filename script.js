/* ================================================================
   Happy Birthday, May — script.js
   Vanilla JS only. Organized by feature, each self-contained.
================================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------
     0. LOADER
  ------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  function revealHero() {
    loader.classList.add('is-hidden');
    document.body.classList.add('is-loaded');
  }
  window.addEventListener('load', () => setTimeout(revealHero, 500));
  // fallback in case 'load' already fired
  setTimeout(revealHero, 2200);

  /* ------------------------------------------------------------
     1. AMBIENT BACKGROUND — floating petals + glowing particles
  ------------------------------------------------------------ */
  const petalField = document.getElementById('petal-field');
  const particleField = document.getElementById('particle-field');

  function spawnPetal() {
    const petal = document.createElement('img');
    petal.src = 'assets/petal.svg';
    petal.className = 'petal';
    petal.alt = '';
    const size = 12 + Math.random() * 16;
    const startX = Math.random() * 100;
    const duration = 9 + Math.random() * 10;
    const drift = (Math.random() - 0.5) * 200;
    petal.style.left = startX + 'vw';
    petal.style.width = size + 'px';
    petal.style.setProperty('--drift', drift + 'px');
    petal.style.animationDuration = duration + 's';
    petal.style.opacity = (0.5 + Math.random() * 0.4).toFixed(2);
    petalField.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000 + 200);
  }

  function spawnParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 3 + Math.random() * 5;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = Math.random() * 100 + 'vh';
    p.style.animationDuration = (4 + Math.random() * 5) + 's';
    particleField.appendChild(p);
    setTimeout(() => p.remove(), 10000);
  }

  // seed the field, then keep it topped up
  for (let i = 0; i < 10; i++) setTimeout(spawnPetal, i * 400);
  for (let i = 0; i < 18; i++) spawnParticle();
  setInterval(spawnPetal, 1400);
  setInterval(spawnParticle, 1200);

  /* ------------------------------------------------------------
     2. CURSOR GLOW + PETAL ATTRACTION + CLICK EFFECTS
  ------------------------------------------------------------ */
  const cursorGlow = document.getElementById('cursor-glow');
  const fxLayer = document.getElementById('fx-layer');
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let lastSparkle = 0;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';

    // gently nudge nearby petals away from the cursor (subtle attraction feel)
    const now = performance.now();
    if (now - lastSparkle > 90) {
      lastSparkle = now;
      const sparkle = document.createElement('span');
      sparkle.className = 'fx-sparkle';
      sparkle.textContent = Math.random() > 0.5 ? '✦' : '·';
      sparkle.style.left = (mouseX + (Math.random() * 20 - 10)) + 'px';
      sparkle.style.top = (mouseY + (Math.random() * 20 - 10)) + 'px';
      sparkle.style.color = Math.random() > 0.5 ? '#F5C242' : '#D98E2B';
      fxLayer.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 950);
    }
  }, { passive: true });

  document.addEventListener('dblclick', (e) => {
    for (let i = 0; i < 6; i++) {
      const heart = document.createElement('span');
      heart.className = 'fx-heart';
      heart.textContent = '❤️';
      heart.style.left = (e.clientX + (Math.random() * 60 - 30)) + 'px';
      heart.style.top = (e.clientY + (Math.random() * 20 - 10)) + 'px';
      heart.style.animationDelay = (i * 60) + 'ms';
      fxLayer.appendChild(heart);
      setTimeout(() => heart.remove(), 1600);
    }
  });

  /* ------------------------------------------------------------
     2b. MAGNETIC BUTTONS
  ------------------------------------------------------------ */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35 - 4}px) scale(1.03)`;
      btn.style.boxShadow = 'var(--shadow-lift)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.boxShadow = '';
    });
  });

  /* ------------------------------------------------------------
     2c. MESH BLOB PARALLAX
  ------------------------------------------------------------ */
  const meshBlobs = document.querySelectorAll('.mesh-blob');
  window.addEventListener('pointermove', (e) => {
    const cx = (e.clientX / window.innerWidth - 0.5) * 2;
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;
    meshBlobs.forEach((blob, i) => {
      const depth = (i + 1) * 8;
      blob.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
    });
  }, { passive: true });

  /* ------------------------------------------------------------
     3. DOT NAVIGATION
  ------------------------------------------------------------ */
  const dots = Array.from(document.querySelectorAll('.dot-nav__dot'));
  const navSections = dots.map(d => document.getElementById(d.dataset.target)).filter(Boolean);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = navSections.indexOf(entry.target);
        dots.forEach(d => d.classList.remove('is-active'));
        if (dots[idx]) dots[idx].classList.add('is-active');
      }
    });
  }, { threshold: 0.5 });
  navSections.forEach(sec => navObserver.observe(sec));

  /* ------------------------------------------------------------
     4. HERO — "Begin Our Story"
  ------------------------------------------------------------ */
  const beginBtn = document.getElementById('begin-btn');
  const journeySection = document.getElementById('journey');
  beginBtn.addEventListener('click', () => {
    document.body.classList.add('is-blooming');
    // extra celebratory petal burst
    for (let i = 0; i < 24; i++) setTimeout(spawnPetal, i * 40);
    setTimeout(() => {
      journeySection.scrollIntoView({ behavior: 'smooth' });
      document.body.classList.remove('is-blooming');
    }, 500);
  });

  /* ------------------------------------------------------------
     5. SCROLL REVEALS + TIMELINE TILT
  ------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(el => revealObserver.observe(el));

  document.querySelectorAll('[data-tilt]').forEach(card => {
    const inner = card.querySelector('.timeline-card-inner');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      inner.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  });

  /* ------------------------------------------------------------
     6. GIFT BOXES
  ------------------------------------------------------------ */
  document.querySelectorAll('.gift').forEach(gift => {
    const box = gift.querySelector('.gift-box');
    box.addEventListener('click', () => {
      const opening = !gift.classList.contains('is-open');
      // little wiggle beat before opening, handled purely by the existing CSS animation
      gift.classList.toggle('is-open');
      box.setAttribute('aria-expanded', String(opening));
    });
  });

  // voice note play/pause + animated waveform
  const voiceNote = document.querySelector('.voice-note');
  if (voiceNote) {
    const playBtn = voiceNote.querySelector('.voice-note-play');
    const audio = document.getElementById('voice-audio');
    playBtn.addEventListener('click', () => {
      const playing = voiceNote.classList.toggle('is-playing');
      playBtn.textContent = playing ? '❚❚' : '▶';
      if (playing) {
        audio.play().catch(() => { /* placeholder file may not exist yet */ });
      } else {
        audio.pause();
      }
    });
    audio.addEventListener('ended', () => {
      voiceNote.classList.remove('is-playing');
      playBtn.textContent = '▶';
    });
  }

  /* ------------------------------------------------------------
     7. 10 THINGS I LOVE ABOUT YOU — sunflower petals
  ------------------------------------------------------------ */
  const reasons = [
    "Your smile — it's the first thing that made me stay.",
    "Your faith, steady even when life isn't.",
    "Your kindness toward people who can't do anything for you.",
    "Your laugh, completely unfiltered and real.",
    "Your patience with me, again and again.",
    "Your love — generous, without keeping score.",
    "Your heart for Jesus, the center of everything you do.",
    "Your care for others before yourself.",
    "Your beautiful eyes, easily my favorite view.",
    "Everything that makes you, you."
  ];

  const petalRing = document.getElementById('petal-ring');
  const petalCard = document.getElementById('petal-card');
  const petalCardText = document.getElementById('petal-card-text');
  const petalCardClose = document.getElementById('petal-card-close');
  const petalCount = reasons.length;

  for (let i = 0; i < petalCount; i++) {
    const angle = (360 / petalCount) * i;
    const btn = document.createElement('button');
    btn.className = 'petal-btn';
    btn.setAttribute('aria-label', 'Reveal reason ' + (i + 1));
    btn.style.transform = `translate(-50%,-100%) rotate(${angle}deg)`;
    btn.style.animationDelay = (i * 0.15) + 's';
    btn.addEventListener('click', () => {
      petalCardText.textContent = reasons[i];
      petalCard.classList.add('is-open');
      btn.classList.add('is-used');
    });
    petalRing.appendChild(btn);
  }
  petalCardClose.addEventListener('click', () => petalCard.classList.remove('is-open'));

  /* ------------------------------------------------------------
     8. ENVELOPE + LETTER
  ------------------------------------------------------------ */
  const envelope = document.getElementById('envelope');
  const envelopeHint = document.getElementById('envelope-hint');
  function toggleEnvelope() {
    const open = envelope.classList.toggle('is-open');
    envelopeHint.textContent = open ? 'tap again to seal it back up' : 'tap the envelope to open it';
  }
  envelope.addEventListener('click', toggleEnvelope);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleEnvelope(); }
  });

  /* ------------------------------------------------------------
     9. PEANUT BUTTER ❤ JELLY — drag-to-merge signature moment
  ------------------------------------------------------------ */
  const stage = document.getElementById('pbj-stage');
  const jarPB = document.getElementById('jar-pb');
  const jarJelly = document.getElementById('jar-jelly');
  const pbjMessage = document.getElementById('pbj-message');
  let merged = false;

  function makeDraggable(jar) {
    let dragging = false, offsetX = 0, offsetY = 0;

    const start = (clientX, clientY) => {
      if (merged) return;
      dragging = true;
      stage.classList.add('is-dragging');
      const rect = jar.getBoundingClientRect();
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
      jar.style.zIndex = 10;
    };
    const move = (clientX, clientY) => {
      if (!dragging) return;
      const stageRect = stage.getBoundingClientRect();
      let x = clientX - stageRect.left - offsetX;
      let y = clientY - stageRect.top - offsetY;
      jar.style.position = 'absolute';
      jar.style.left = x + 'px';
      jar.style.top = y + 'px';
      jar.style.transform = 'none';
      checkOverlap();
    };
    const end = () => {
      dragging = false;
      stage.classList.remove('is-dragging');
    };

    jar.addEventListener('pointerdown', (e) => { jar.setPointerCapture(e.pointerId); start(e.clientX, e.clientY); });
    jar.addEventListener('pointermove', (e) => move(e.clientX, e.clientY));
    jar.addEventListener('pointerup', end);
    jar.addEventListener('pointercancel', end);
  }

  makeDraggable(jarPB);
  makeDraggable(jarJelly);

  function checkOverlap() {
    if (merged) return;
    const a = jarPB.getBoundingClientRect();
    const b = jarJelly.getBoundingClientRect();
    const overlapX = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const overlapY = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    const overlapArea = overlapX * overlapY;
    const minArea = Math.min(a.width * a.height, b.width * b.height);
    if (overlapArea > minArea * 0.32) {
      triggerMerge();
    }
  }

  function triggerMerge() {
    merged = true;
    jarPB.classList.add('pbj-jar--merged-hide');
    jarJelly.classList.add('pbj-jar--merged-hide');
    pbjMessage.classList.add('is-visible');
    burstConfettiAndSunflowers();
  }

  function burstConfettiAndSunflowers() {
    const burst = document.createElement('div');
    burst.className = 'pbj-burst';
    stage.appendChild(burst);

    const colors = ['#F5C242', '#E8A93E', '#C0392B', '#E85D75', '#6B4226'];
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 160;
      piece.style.setProperty('--cx', Math.cos(angle) * dist + 'px');
      piece.style.setProperty('--cy', (Math.sin(angle) * dist + 120) + 'px');
      piece.style.setProperty('--cr', (Math.random() * 720 - 360) + 'deg');
      piece.style.left = '50%';
      piece.style.top = '45%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = (Math.random() * 0.2) + 's';
      burst.appendChild(piece);
    }

    for (let i = 0; i < 6; i++) {
      const bloom = document.createElement('img');
      bloom.src = 'assets/sunflower.svg';
      bloom.className = 'bloom-sunflower';
      bloom.alt = '';
      const spread = (i - 2.5) * 15;
      bloom.style.left = `calc(50% + ${spread}%)`;
      bloom.style.bottom = '0';
      bloom.style.animationDelay = (i * 0.08) + 's';
      burst.appendChild(bloom);
    }

    setTimeout(() => burst.remove(), 2200);
  }

  /* ------------------------------------------------------------
     10. REPLAY
  ------------------------------------------------------------ */
  const replayBtn = document.getElementById('replay-btn');
  replayBtn.addEventListener('click', () => {
    // reset gifts
    document.querySelectorAll('.gift.is-open').forEach(g => g.classList.remove('is-open'));
    // reset petals
    petalCard.classList.remove('is-open');
    document.querySelectorAll('.petal-btn.is-used').forEach(b => b.classList.remove('is-used'));
    // reset envelope
    envelope.classList.remove('is-open');
    envelopeHint.textContent = 'tap the envelope to open it';
    // reset PB&J
    merged = false;
    jarPB.classList.remove('pbj-jar--merged-hide');
    jarJelly.classList.remove('pbj-jar--merged-hide');
    jarPB.style.position = ''; jarPB.style.left = ''; jarPB.style.top = ''; jarPB.style.transform = '';
    jarJelly.style.position = ''; jarJelly.style.left = ''; jarJelly.style.top = ''; jarJelly.style.transform = '';
    pbjMessage.classList.remove('is-visible');
    // scroll to top
    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
  });

});
