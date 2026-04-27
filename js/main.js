document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavbar();
  initMobileMenu();
  initLayoutDemos();
  initLangSwitch();
});

/* ========== 滚动渐入动画 ========== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-up, .scale-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ========== 导航栏滚动效果 ========== */
function initNavbar() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      nav.style.background = 'rgba(0, 0, 0, 0.88)';
    } else {
      nav.style.background = 'rgba(0, 0, 0, 0.72)';
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // 高亮当前页面导航
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ========== 移动端菜单 ========== */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = '☰';
    });
  });
}

/* ========== 布局演示交互 ========== */
function initLayoutDemos() {
  document.querySelectorAll('.layout-demo').forEach(demo => {
    demo.addEventListener('mouseenter', () => {
      demo.querySelectorAll('.tile').forEach((tile, i) => {
        tile.style.transitionDelay = `${i * 50}ms`;
        tile.style.transform = 'scale(0.96)';
      });
    });

    demo.addEventListener('mouseleave', () => {
      demo.querySelectorAll('.tile').forEach(tile => {
        tile.style.transitionDelay = '0ms';
        tile.style.transform = 'scale(1)';
      });
    });
  });
}

/* ========== 语言切换 ========== */
function initLangSwitch() {
  const switcher = document.querySelector('.lang-switcher');
  if (!switcher) return;

  const btn = switcher.querySelector('.lang-switcher-btn');
  const dropdown = switcher.querySelector('.lang-dropdown');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    switcher.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    switcher.classList.remove('open');
  });

  dropdown.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const lang = link.dataset.lang;
    if (lang) localStorage.setItem('preferred-lang', lang);
  });

  autoDetectLang();
}

function autoDetectLang() {
  if (localStorage.getItem('preferred-lang')) {
    redirectToLang(localStorage.getItem('preferred-lang'));
    return;
  }

  const supported = ['zh', 'en', 'de', 'ja', 'es', 'ko', 'fr', 'pt'];
  const browserLangs = navigator.languages || [navigator.language];
  let matched = null;

  for (const bl of browserLangs) {
    const code = bl.split('-')[0].toLowerCase();
    if (supported.includes(code)) {
      matched = code;
      break;
    }
  }

  if (!matched) matched = 'en';

  localStorage.setItem('preferred-lang', matched);
  redirectToLang(matched);
}

function redirectToLang(lang) {
  const currentLang = document.documentElement.lang.split('-')[0].toLowerCase();
  if (lang === currentLang) return;

  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  const supported = ['en', 'de', 'ja', 'es', 'ko', 'fr', 'pt'];

  let basePath;
  if (supported.some(l => path.includes('/' + l + '/'))) {
    basePath = path.replace(/\/(en|de|ja|es|ko|fr|pt)\//, '/');
  } else {
    basePath = path;
  }

  let targetUrl;
  if (lang === 'zh') {
    targetUrl = basePath;
  } else {
    const dir = basePath.substring(0, basePath.lastIndexOf('/') + 1);
    targetUrl = dir + lang + '/' + page;
  }

  if (targetUrl !== path) {
    window.location.href = targetUrl;
  }
}

/* ========== 平滑滚动到锚点 ========== */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
