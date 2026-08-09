/* ==========================================================================
   PORTFOLIO — main.js
   Toutes les interactions : curseur custom, menu mobile, révélations au
   scroll, tilt 3D des cartes, effet machine à écrire, filtres projets,
   barres de compétences, et la scène 3D Three.js du hero.
   ========================================================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* ----------------------------- Menu mobile ----------------------------- */
(function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const tabs = document.querySelector('.tabs');
  if (!toggle || !tabs) return;
  toggle.addEventListener('click', () => {
    const isOpen = tabs.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  tabs.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    tabs.classList.remove('is-open');
    toggle.classList.remove('is-open');
  }));
})();

/* --------------------------- Curseur custom ----------------------------- */
(function initCursor() {
  if (isTouch) return;
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  function loop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, .project-card, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
  });
})();

/* --------------------------- Révélations scroll ------------------------- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!els.length) return;

  if (prefersReducedMotion) {
    els.forEach(el => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ------------------------- Barres de compétences ------------------------ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.level || '0';
        entry.target.style.width = target + '%';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(bar => io.observe(bar));
})();

/* ------------------------------ Effet tilt 3D ---------------------------- */
(function initTilt() {
  if (isTouch || prefersReducedMotion) return;
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const inner = card.querySelector('.project-card-inner');
    if (!inner) return;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const rotY = px * 10;
      const rotX = -py * 10;
      inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.015)`;
    });
    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
})();

/* ------------------------------ Machine à écrire ------------------------- */
(function initTyping() {
  const el = document.querySelector('[data-typing]');
  if (!el) return;
  const phrases = JSON.parse(el.dataset.typing || '[]');
  if (!phrases.length) return;

  if (prefersReducedMotion) {
    el.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 60);
  }
  tick();
})();

/* ------------------------------ Modale projet ---------------------------- */
(function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const cards = document.querySelectorAll('.project-card');
  if (!modal || !cards.length) return;

  const mediaEl = modal.querySelector('.project-modal-media');
  const tagEl = modal.querySelector('#modal-tag');
  const titleEl = modal.querySelector('#modal-title');
  const descEl = modal.querySelector('#modal-desc');
  const techEl = modal.querySelector('#modal-tech');
  const linksEl = modal.querySelector('#modal-links');
  let lastFocused = null;

  function openFromCard(card) {
    const thumbBg = card.querySelector('.thumb-bg');
    const bgImage = thumbBg ? getComputedStyle(thumbBg).backgroundImage : 'none';
    mediaEl.style.backgroundImage = bgImage;

    const tag = card.querySelector('.thumb-tag')?.textContent.trim() || '';
    tagEl.textContent = tag;
    tagEl.style.display = tag ? '' : 'none';

    titleEl.textContent = card.querySelector('h3')?.textContent.trim() || '';

    const detail = card.querySelector('.project-detail');
    descEl.textContent = detail?.querySelector('p')?.textContent.trim() || '';

    const techItems = Array.from(detail?.querySelectorAll('.tech-list li') || []).map(li => li.textContent.trim());
    techEl.innerHTML = techItems.map(t => `<li>${t}</li>`).join('');

    const links = Array.from(detail?.querySelectorAll('.project-links a') || []);
    const dateSpan = detail?.querySelector('.project-links span');
    let linksHtml = links.map(a => `<a href="${a.getAttribute('href')}" target="_blank" rel="noopener">${a.textContent.trim()}</a>`).join('');
    if (dateSpan) linksHtml += `<span>${dateSpan.textContent.trim()}</span>`;
    linksEl.innerHTML = linksHtml;

    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.project-modal-close').focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-haspopup', 'dialog');
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // laisse les liens s'ouvrir normalement
      openFromCard(card);
    });
    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')) {
        e.preventDefault();
        openFromCard(card);
      }
    });
  });

  modal.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();

/* -------------------------------- Filtres -------------------------------- */
(function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('[data-tech]');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const techs = (card.dataset.tech || '').split(',');
        const show = filter === 'all' || techs.includes(filter);
        card.style.display = show ? '' : 'none';
      });
    });
  });
})();

/* -------------------------------- Année footer ---------------------------- */
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* ==========================================================================
   SCÈNE 3D — Three.js
   Un réseau de nœuds flottants (constellation tech) qui réagit doucement
   à la position de la souris / au tilt sur mobile. Utilisé sur le hero
   et en version discrète en fond des autres pages.
   ========================================================================== */

function initScene(canvasId, opts = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof THREE === 'undefined') return;

  const density = opts.density || 70;
  const ambient = !!opts.ambient;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = ambient ? 26 : 22;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Nuage de points (nœuds)
  const nodeCount = density;
  const positions = new Float32Array(nodeCount * 3);
  const velocities = [];
  const spread = ambient ? 22 : 16;

  for (let i = 0; i < nodeCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread * 2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
    velocities.push({
      x: (Math.random() - 0.5) * 0.006,
      y: (Math.random() - 0.5) * 0.006,
      z: (Math.random() - 0.5) * 0.006,
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const pointMaterial = new THREE.PointsMaterial({
    color: 0xa78bfa,
    size: ambient ? 0.09 : 0.14,
    transparent: true,
    opacity: ambient ? 0.55 : 0.85,
  });
  const points = new THREE.Points(geometry, pointMaterial);
  scene.add(points);

  // Lignes reliant les nœuds proches (recalculées périodiquement, pas chaque frame)
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xc026d3,
    transparent: true,
    opacity: ambient ? 0.12 : 0.2,
  });
  let lineSegments = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
  scene.add(lineSegments);

  const maxDist = ambient ? 5 : 6.2;

  function rebuildLines() {
    const linePositions = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < maxDist) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
        }
      }
    }
    lineSegments.geometry.dispose();
    lineSegments.geometry = new THREE.BufferGeometry();
    lineSegments.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  }
  rebuildLines();

  // Icosaèdre wireframe central (signature visuelle)
  let icoMesh = null;
  if (!ambient) {
    const icoGeo = new THREE.IcosahedronGeometry(5.4, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    icoMesh = new THREE.Mesh(icoGeo, icoMat);
    scene.add(icoMesh);
  }

  // Parallax souris
  let targetRotX = 0, targetRotY = 0;
  let curRotX = 0, curRotY = 0;

  if (!isTouch) {
    window.addEventListener('mousemove', (e) => {
      targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.5;
      targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });
  }

  let frame = 0;
  let rafId;
  function animate() {
    rafId = requestAnimationFrame(animate);
    frame++;

    if (!prefersReducedMotion) {
      for (let i = 0; i < nodeCount; i++) {
        positions[i * 3] += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;
        positions[i * 3 + 2] += velocities[i].z;

        if (Math.abs(positions[i * 3]) > spread) velocities[i].x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > spread / 2) velocities[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 7) velocities[i].z *= -1;
      }
      geometry.attributes.position.needsUpdate = true;

      if (frame % 12 === 0) rebuildLines();

      if (icoMesh) {
        icoMesh.rotation.y += 0.0016;
        icoMesh.rotation.x += 0.0008;
      }

      curRotX += (targetRotX - curRotX) * 0.04;
      curRotY += (targetRotY - curRotY) * 0.04;
      scene.rotation.x = curRotX;
      scene.rotation.y = curRotY;
    }

    renderer.render(scene, camera);
  }
  animate();

  // Pause quand l'onglet n'est pas visible (perf)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      animate();
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('hero-canvas')) {
    initScene('hero-canvas', { density: 90 });
  }
  if (document.getElementById('ambient-canvas')) {
    initScene('ambient-canvas', { density: 50, ambient: true });
  }
});
