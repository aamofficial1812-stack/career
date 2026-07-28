/* ============================================================
   Debate & Dialogue Club — Professional Development Series 2026
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('is-hidden'), 300);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => preloader && preloader.classList.add('is-hidden'), 1500);

  /* ---------- Sticky navbar shadow ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 12) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Smooth scrolling for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = navbar.offsetHeight;
          const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i % 4 * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Registration modal ---------- */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const openTriggers = [
    document.getElementById('navRegisterBtn'),
    document.getElementById('heroRegisterBtn'),
    document.getElementById('feeRegisterBtn')
  ];
  const form = document.getElementById('registrationForm');
  let lastFocused = null;

  const openModal = () => {
    lastFocused = document.activeElement;
    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const firstInput = document.getElementById('fullName');
    setTimeout(() => firstInput && firstInput.focus(), 350);
  };

  const closeModal = () => {
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  openTriggers.forEach(btn => btn && btn.addEventListener('click', openModal));
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) closeModal();
  });

  /* ---------- File input labels ---------- */
  ['paymentScreenshot', 'photograph'].forEach(id => {
    const input = document.getElementById(id);
    const nameEl = document.getElementById('name-' + id);
    input.addEventListener('change', () => {
      const group = input.closest('.form-group');
      if (input.files && input.files[0]) {
        nameEl.textContent = input.files[0].name;
        group.classList.remove('has-error');
        document.getElementById('err-' + id).textContent = '';
      } else {
        nameEl.textContent = '';
      }
    });
  });

  /* ---------- Contact number: digits only ---------- */
  const contactInput = document.getElementById('contactNumber');
  contactInput.addEventListener('input', () => {
    contactInput.value = contactInput.value.replace(/\D/g, '').slice(0, 10);
  });

  /* ---------- Frontend-only validation ---------- */
  const setError = (fieldId, message) => {
    const errEl = document.getElementById('err-' + fieldId);
    const input = document.getElementById(fieldId);
    const group = input.closest('.form-group');
    if (errEl) errEl.textContent = message;
    if (group) group.classList.toggle('has-error', Boolean(message));
  };

  const validators = {
    fullName: () => {
      const v = document.getElementById('fullName').value.trim();
      if (!v) return 'Please enter your full name.';
      if (v.length < 3) return 'Name looks too short.';
      return '';
    },
    department: () => {
      const v = document.getElementById('department').value;
      if (!v) return 'Please select your department.';
      return '';
    },
    rollNumber: () => {
      const v = document.getElementById('rollNumber').value.trim();
      if (!v) return 'Please enter your roll number.';
      return '';
    },
    contactNumber: () => {
      const v = document.getElementById('contactNumber').value.trim();
      if (!v) return 'Please enter your contact number.';
      if (!/^\d{10}$/.test(v)) return 'Enter a valid 10-digit number.';
      return '';
    },
    transactionId: () => {
      const v = document.getElementById('transactionId').value.trim();
      if (!v) return 'Please enter your transaction ID.';
      if (v.length < 4) return 'Transaction ID looks too short.';
      return '';
    },
    paymentScreenshot: () => {
      const f = document.getElementById('paymentScreenshot').files;
      if (!f || !f.length) return 'Please upload your payment screenshot.';
      return '';
    },
    photograph: () => {
      const f = document.getElementById('photograph').files;
      if (!f || !f.length) return 'Please upload a recent photograph.';
      return '';
    },
    paymentConfirm: () => {
      const checked = document.getElementById('paymentConfirm').checked;
      if (!checked) return 'Please confirm your payment to continue.';
      return '';
    }
  };

  // Live validation as user interacts
  Object.keys(validators).forEach(id => {
    const el = document.getElementById(id);
    const evt = (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'file') ? 'change' : 'input';
    el.addEventListener(evt, () => setError(id, validators[id]()));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let firstInvalid = null;
    let hasError = false;

    Object.keys(validators).forEach(id => {
      const message = validators[id]();
      if (id === 'paymentConfirm') {
        const errEl = document.getElementById('err-paymentConfirm');
        if (errEl) errEl.textContent = message;
      } else {
        setError(id, message);
      }
      if (message && !hasError) {
        firstInvalid = document.getElementById(id);
      }
      if (message) hasError = true;
    });

    if (hasError) {
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => firstInvalid.focus(), 300);
      }
      return;
    }

    // No backend — simulate a successful submission.
    form.classList.add('is-submitted');
    document.getElementById('formSuccess').style.display = 'block';

    setTimeout(() => {
      closeModal();
      setTimeout(() => {
        form.reset();
        form.classList.remove('is-submitted');
        document.getElementById('formSuccess').style.display = 'none';
        document.querySelectorAll('.file-drop-name').forEach(el => el.textContent = '');
        Object.keys(validators).forEach(id => setError(id, ''));
      }, 500);
    }, 2600);
  });

});