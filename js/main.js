document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavbar();
  initMobileMenu();
  initLayoutDemos();
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
