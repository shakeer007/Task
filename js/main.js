// ===== MAIN JS (FIXED VERSION) =====

// Run app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

// Also support componentsLoaded if used elsewhere
document.addEventListener('componentsLoaded', initApp);

/**
 * Initialize the application
 */
function initApp() {
  initCustomCursor();
  setupMobileMenu();      // <-- uses event delegation, safe to call multiple times
  highlightActiveNavLink();
  setupContactForms();
  setupScrollAnimations();
  setupDownloadResume();
  initParallax();
  initSkillBars();
  initSmoothScroll();
}

/**
 * Custom cursor effect
 */
function initCustomCursor() {
  const cursorDot = document.createElement('div');
  const cursorOutline = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  cursorOutline.className = 'cursor-outline';
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorOutline);

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.2;
    outlineY += (mouseY - outlineY) * 0.2;
    cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
    requestAnimationFrame(animateOutline);
  }
  animateOutline();
}

function setupMobileMenu() {
  if (!window._menuToggleAttached) {
    // 1. Toggle menu when clicking the hamburger button
    document.addEventListener('click', function(e) {
      const toggle = e.target.closest('.menu-toggle');
      if (!toggle) return;

      const navLinks = document.querySelector('.nav-links');
      if (navLinks) {
        const isOpen = navLinks.classList.contains('open');
        navLinks.classList.toggle('open');

        // Toggle icon
        const icon = toggle.querySelector('img');
        if (icon) {
          icon.src = isOpen
            ? icon.src.replace('close.svg', 'menu.svg')
            : icon.src.replace('menu.svg', 'close.svg');
        }

        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? '' : 'hidden';
      }
    });

    // 2. Close menu when a nav link is clicked
    document.addEventListener('click', function(e) {
      const link = e.target.closest('.nav-links a');
      if (!link) return;

      const navLinks = document.querySelector('.nav-links');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
        // Reset icon back to menu
        const toggle = document.querySelector('.menu-toggle');
        if (toggle) {
          const icon = toggle.querySelector('img');
          if (icon) icon.src = icon.src.replace('close.svg', 'menu.svg');
        }
      }
    });

    // 3. Close menu when clicking outside (anywhere not inside .nav-links and not the toggle)
    document.addEventListener('click', function(e) {
      const navLinks = document.querySelector('.nav-links');
      if (!navLinks || !navLinks.classList.contains('open')) return;

      const isInsideMenu = e.target.closest('.nav-links');
      const isToggle = e.target.closest('.menu-toggle');
      if (!isInsideMenu && !isToggle) {
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
        // Reset icon
        const toggle = document.querySelector('.menu-toggle');
        if (toggle) {
          const icon = toggle.querySelector('img');
          if (icon) icon.src = icon.src.replace('close.svg', 'menu.svg');
        }
      }
    });

    window._menuToggleAttached = true;
  }
}

/**
 * Highlight active nav link
 */
function highlightActiveNavLink() {
  const pageName = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === pageName);
  });
}

/**
 * Contact form
 */
function setupContactForms() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Form submitted!');
      form.reset();
    });
  });
}

/**
 * Scroll animation (staggered)
 */
function setupScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (elements.length === 0) return;

  // Remove any existing observer to avoid duplicates
  if (window._scrollObserver) {
    window._scrollObserver.disconnect();
  }

  // Function to mark elements that are currently in the viewport
  function markVisible() {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });
  }

  // Mark visible elements after a short delay to ensure layout is stable
  setTimeout(markVisible, 150);

  // Set up Intersection Observer for future scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
  window._scrollObserver = observer;
}

/**
 * Resume button
 */
function setupDownloadResume() {
  const btn = document.getElementById('downloadResumeBtn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Resume download demo');
    });
  }
}

/**
 * Parallax
 */
function initParallax() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    hero.style.backgroundPositionY = window.scrollY * 0.3 + 'px';
  });
}

/**
 * Skill bars animation
 */
function initSkillBars() {
  const bars = document.querySelectorAll('.progress div');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
          bar.style.width = width;
        }, 200);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
}

/**
 * Smooth scroll
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

window.addEventListener('scroll', () => {
  const header = document.querySelector('.main-header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Project filter (if .filter-btn exists)
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}