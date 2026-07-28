(function () {
  "use strict";

  /* ---------------------------------------------------------
     NAVBAR: blur + background on scroll
  --------------------------------------------------------- */
  var navbar = document.getElementById("navbar");

  function updateNavbarState() {
    if (window.scrollY > 24) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  }
  updateNavbarState();
  window.addEventListener("scroll", updateNavbarState, { passive: true });

  /* ---------------------------------------------------------
     MOBILE MENU TOGGLE
  --------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  function closeMobileMenu() {
    mobileMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  function toggleMobileMenu() {
    var isOpen = mobileMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", toggleMobileMenu);

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileMenu();
    });
  }

  /* ---------------------------------------------------------
     FAQ ACCORDION
  --------------------------------------------------------- */
  var faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(function (item) {
    var question = item.querySelector(".faq-item__question");
    var answer = item.querySelector(".faq-item__answer");

    question.addEventListener("click", function () {
      var isOpen = question.getAttribute("aria-expanded") === "true";

      // Close all other items (accordion behavior)
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.querySelector(".faq-item__question").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-item__answer").style.maxHeight = null;
        }
      });

      if (isOpen) {
        question.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = null;
      } else {
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------------------------------------------------------
     SMOOTH-SCROLL OFFSET FOR STICKY NAV (anchor links)
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href").slice(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = navbar ? navbar.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });
})();