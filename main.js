/* ═══════════════════════════════════════════════════════════════
   VAULTACKIE.COM  ·  main.js
   © 2026 Vaultackie. All Rights Reserved.
   Unauthorised use strictly prohibited without written permission
   from Vignesh Sivajayam, CEO & Founder, Vaultackie.
   Contact: hello@vaultackie.com
═══════════════════════════════════════════════════════════════ */

'use strict';

// ════════════════════════════════════════════
// 1. LOADER
// ════════════════════════════════════════════
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('gone');
  }, 2200);
});

// ════════════════════════════════════════════
// 2. CUSTOM CURSOR
// ════════════════════════════════════════════
const curEl    = document.getElementById('cur');
const trailEl  = document.getElementById('cur-trail');
let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (curEl) {
    curEl.style.left = mouseX + 'px';
    curEl.style.top  = mouseY + 'px';
  }
});

(function animateTrail() {
  trailX += (mouseX - trailX) * 0.1;
  trailY += (mouseY - trailY) * 0.1;
  if (trailEl) {
    trailEl.style.left = trailX + 'px';
    trailEl.style.top  = trailY + 'px';
  }
  requestAnimationFrame(animateTrail);
})();

// ════════════════════════════════════════════
// 3. NEURAL PARTICLE CANVAS
// ════════════════════════════════════════════
(function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const NUM_PARTICLES = 90;
  const CONNECTION_DIST = 120;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Initialise particles
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      vx:    (Math.random() - 0.5) * 0.4,
      vy:    (Math.random() - 0.5) * 0.4,
      r:     Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      gold:  Math.random() > 0.75
    });
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONNECTION_DIST) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / CONNECTION_DIST) * 0.12;
          ctx.strokeStyle = '#c8a84b';
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Draw & move particles
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.gold ? '#c8a84b' : 'rgba(200,168,75,0.4)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(drawFrame);
  }
  drawFrame();
})();

// ════════════════════════════════════════════
// 4. NAV — SCROLL SHRINK
// ════════════════════════════════════════════
const mainNav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  if (mainNav) mainNav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ════════════════════════════════════════════
// 5. HAMBURGER MENU
// ════════════════════════════════════════════
const burger   = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ════════════════════════════════════════════
// 6. SCROLL REVEAL
// ════════════════════════════════════════════
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ════════════════════════════════════════════
// 7. ACTIVE NAV LINK ON SCROLL
// ════════════════════════════════════════════
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? '#c8a84b' : '';
  });
}, { passive: true });

// ════════════════════════════════════════════
// 8. CONTACT FORM — UI FEEDBACK
// ════════════════════════════════════════════
const contactForm = document.getElementById('cform');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = contactForm.querySelector('.f-submit');
    const orig = btn.textContent;
    btn.textContent         = 'MESSAGE SENT ✓';
    btn.style.background    = 'linear-gradient(135deg,#4caf82,#2e7d52)';
    setTimeout(() => {
      btn.textContent      = orig;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

// ════════════════════════════════════════════
// 9. CONSOLE BRANDING
// ════════════════════════════════════════════
console.log(
  '%c VAULTACKIE © 2026 · Intelligence Engineered ',
  'background:#c8a84b;color:#04070f;font-family:serif;font-size:14px;padding:8px 24px;font-weight:bold;letter-spacing:0.2em;'
);
console.log(
  '%c Vignesh Sivajayam · CEO & Founder · Dharmapuri, Tamil Nadu, India ',
  'color:#c8a84b;font-size:11px;font-style:italic;'
);
console.log(
  '%c ⚠ Unauthorised usage is strictly prohibited. ',
  'color:#ff9d3d;font-size:11px;'
);
