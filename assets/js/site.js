/* ============================================================
   INTERMEDIATE ASIA — shared behaviour
   Scroll reveal, mobile nav, scroll-to-top.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll reveal ─────────────────────────────────────── */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    // Failsafe: if anything stalls the observer (hidden tab, headless
    // render, a thrown error elsewhere), show everything rather than
    // shipping a blank section.
    window.setTimeout(function () {
      revealables.forEach(function (el) { el.classList.add("is-visible"); });
    }, 2500);

    revealables.forEach(function (el) {
      // Stagger siblings inside a grid or list
      var parent = el.parentElement;
      if (parent && !el.style.getPropertyValue('--reveal-delay')) {
        var siblings = Array.prototype.filter.call(parent.children, function (c) {
          return c.classList.contains('reveal');
        });
        if (siblings.length > 1) {
          var i = siblings.indexOf(el);
          el.style.setProperty('--reveal-delay', (i * 0.09).toFixed(2) + 's');
        }
      }
      observer.observe(el);
    });
  }

  /* ── Mobile navigation ─────────────────────────────────── */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') &&
          !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ── Header: frosted state once the page leaves the top ── */
  var header = document.querySelector('.site-header');
  if (header) {
    var headerTicking = false;
    var syncHeader = function () {
      if (headerTicking) return;
      headerTicking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle('is-stuck', window.scrollY > 24);
        headerTicking = false;
      });
    };
    window.addEventListener('scroll', syncHeader, { passive: true });
    syncHeader();
  }

  /* ── Scroll to top ─────────────────────────────────────── */
  var scrollTop = document.getElementById('scroll-top');
  if (scrollTop) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        scrollTop.classList.toggle('is-visible', window.scrollY > 500);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    scrollTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

})();
