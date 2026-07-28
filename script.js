(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- loader ---------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('is-hidden'), 350);
  });
  // fallback in case load event is delayed
  setTimeout(() => loader && loader.classList.add('is-hidden'), 2200);

  /* ---------------- nav scroll state ---------------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- mobile menu ---------------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
  }

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---------------- smooth scroll for hero indicator ---------------- */
  document.querySelectorAll('[data-scroll-to]').forEach(el => {
    el.addEventListener('click', () => {
      const target = document.querySelector(el.getAttribute('data-scroll-to'));
      if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------------- scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------- cursor glow (desktop / fine pointer only) ---------------- */
  const cursorGlow = document.querySelector('.cursor-glow');
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (cursorGlow && hasFinePointer && !reduceMotion) {
    let raf = null;
    window.addEventListener('mousemove', (e) => {
      cursorGlow.classList.add('active');
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      });
    }, { passive: true });
    window.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  }

  /* ---------------- button ripple ---------------- */
  document.querySelectorAll('.btn--ripple').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.remove('is-rippling');
      // force reflow to restart animation
      void btn.offsetWidth;
      btn.classList.add('is-rippling');
      setTimeout(() => btn.classList.remove('is-rippling'), 550);
    });
  });

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', !isOpen);
      q.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------------- registration modal ---------------- */
  const modal = document.getElementById('modal');
  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeMobileMenu();
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-open-modal]').forEach(el => {
    el.addEventListener('click', openModal);
  });
  document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  /* simple focus trap within modal */
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !modal.classList.contains('is-open')) return;
    const focusable = modal.querySelectorAll('button, a[href]');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();