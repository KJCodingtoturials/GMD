// Growth Matrix Digital — Premium Enhancements v2.0

// ============================================
// PREMIUM ENHANCEMENTS v2.0
// ============================================

// ===== PAGE LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 900);
});

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / total) * 100;
    progressBar.style.width = pct + '%';
  }, { passive: true });
}

// ===== CUSTOM CURSOR =====
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
if (dot && ring) {
  let rx = 0, ry = 0;
  document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    rx += (e.clientX - rx) * 0.12;
    ry += (e.clientY - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  });
  // Grow ring on clickable
  document.querySelectorAll('a, button, [onclick]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '56px';
      ring.style.height = '56px';
      ring.style.borderColor = 'rgba(0,242,254,0.8)';
      dot.style.opacity = '0';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(0,242,254,0.5)';
      dot.style.opacity = '1';
    });
  });
}

// ===== BACK TO TOP =====
const btt = document.getElementById('back-to-top');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== TOAST NOTIFICATION =====
function showToast(msg, duration = 3500) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ===== ANNOUNCEMENT BAR CLOSE =====
const annBar = document.querySelector('.announce-bar');
if (annBar) {
  document.body.classList.add('has-announce');
  const closeBtn = annBar.querySelector('.ann-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      annBar.style.display = 'none';
      document.body.classList.remove('has-announce');
      sessionStorage.setItem('ann-closed', '1');
    });
  }
  if (sessionStorage.getItem('ann-closed') === '1') {
    annBar.style.display = 'none';
    document.body.classList.remove('has-announce');
  }
}

// ===== SKILL PROGRESS BARS (founder page) =====
const skillBars = document.querySelectorAll('.skill-bar-fill');
if (skillBars.length) {
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.pct + '%';
        skillObs.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(b => skillObs.observe(b));
}

// ===== SEAT COUNTER (youth page) =====
const seatFill = document.getElementById('seat-fill');
if (seatFill) {
  setTimeout(() => {
    const pct = parseInt(seatFill.dataset.pct || 78);
    seatFill.style.width = pct + '%';
  }, 600);
}

// ===== COUNTDOWN TIMER (youth page) =====
function runCountdown() {
  const now = new Date();
  // Next Sunday at 11am
  const next = new Date(now);
  const day = now.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(11, 0, 0, 0);
  // If Sunday already passed today
  if (day === 0 && now.getHours() >= 11) {
    next.setDate(next.getDate() + 7);
  }

  function tick() {
    const diff = next - new Date();
    if (diff <= 0) { tick(); return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const setBox = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val).padStart(2, '0');
    };
    setBox('cd-days', d);
    setBox('cd-hours', h);
    setBox('cd-mins', m);
    setBox('cd-secs', s);
  }
  tick();
  setInterval(tick, 1000);
}
if (document.getElementById('cd-days')) runCountdown();

// ===== TYPING ANIMATION (index hero) =====
const typingEl = document.getElementById('typing-text');
if (typingEl) {
  const phrases = [
    'Meta Ads that actually convert.',
    'Instagram growth on autopilot.',
    'TikTok views — delivered fast.',
    'Facebook campaigns that scale.',
    'YouTube subscribers — real ones.',
    'Digital marketing, done right.'
  ];
  let pi = 0, ci = 0, deleting = false;
  function typeLoop() {
    const phrase = phrases[pi];
    if (!deleting) {
      typingEl.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
    } else {
      typingEl.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(typeLoop, deleting ? 45 : 80);
  }
  typeLoop();
}

// ===== STAGGER REVEAL ON SCROLL =====
document.querySelectorAll('.program-card, .vision-card, .how-step, .story-card, .tl-item, .skill-row').forEach((el, i) => {
  el.style.transitionDelay = (i % 4 * 0.08) + 's';
});
