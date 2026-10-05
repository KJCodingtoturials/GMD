// ============================================
// GROWTH MATRIX DIGITAL - Enhanced Script
// ============================================

// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== Mobile hamburger menu =====
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
}

// Close menu when a simple nav-link (not dropdown trigger) is clicked
document.querySelectorAll('.nav-link:not(.nav-item > .nav-link)').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      document.getElementById('navLinks').classList.remove('open');
      document.getElementById('hamburger').classList.remove('active');
    }
  });
});

// Mobile: tap on nav-item trigger toggles dropdown
document.querySelectorAll('.nav-item > .nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const navItem = link.closest('.nav-item');
      navItem.classList.toggle('mobile-open');
    }
  });
});

// Mobile: tap on has-sub item toggles sub-dropdown
document.querySelectorAll('.dd-item.has-sub').forEach(item => {
  item.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.stopPropagation();
      item.classList.toggle('mobile-open');
    }
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  const navbar = document.getElementById('navbar');
  if (navbar && !navbar.contains(e.target)) {
    document.getElementById('navLinks')?.classList.remove('open');
    document.getElementById('hamburger')?.classList.remove('active');
  }
});

// ===== Smooth active nav link highlighting =====
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
  threshold: 0.3,
  rootMargin: '-80px 0px 0px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'var(--primary)';
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// ===== Counter Animation =====
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ===== Scroll reveal animation =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.service-card, .stat-card, .why-card, .testimonial-card, .platform-pill, .process-step, .faq-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

// ===== Cursor glow effect on hero =====
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    hero.style.setProperty('--mouse-x', `${x}px`);
    hero.style.setProperty('--mouse-y', `${y}px`);
  });
}

// ===== Tilt effect on service cards =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / rect.height) * 6;
    const rotateY = (x / rect.width) * 6;
    card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== FAQ Accordion =====
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  // Open clicked (toggle)
  if (!isOpen) {
    item.classList.add('open');
  }
}


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

// ===== CUSTOM CURSOR — removed, using default browser cursor =====

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

console.log('🚀 Growth Matrix Digital v2.0 Loaded!');

// ============================================
// ADVANCED AI PRO DEVELOPER FEATURES
// ============================================

// 1. Default browser cursor used — no custom cursor

// 2. Scroll Progress Bar
const scrollProgressBar2 = document.createElement('div');
scrollProgressBar2.className = 'scroll-progress-bar';
document.body.appendChild(scrollProgressBar2);

window.addEventListener('scroll', () => {
  const scrollTotal = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = (scrollTotal / height) * 100;
  scrollProgressBar2.style.width = scrollPercent + '%';
});

// 3. AI Flashlight Glow Effect on Cards
const glowCards = document.querySelectorAll('.service-card, .glass-card, .program-card, .vision-card, .cert-card, .stat-card');
glowCards.forEach(card => {
  card.classList.add('ai-glow-card');
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// 4. Magnetic Buttons (Pro effect)
const magnetics = document.querySelectorAll('.btn, .social-icon-btn, .fsocial-icon');
magnetics.forEach(btn => {
  // Wrap text to allow container to move but keep text stable (optional, simplified here)
  btn.addEventListener('mousemove', (e) => {
    if(window.innerWidth <= 768) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Move button slightly towards mouse
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = `translate(0px, 0px)`;
  });
});

// 5. 3D Tilt Effect on feature cards
const tiltCards = document.querySelectorAll('.program-card, .vision-card, .service-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if(window.innerWidth <= 768) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'none';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  });
});
