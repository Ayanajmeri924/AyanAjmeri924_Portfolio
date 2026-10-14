// ---------- Mobile nav toggle ----------
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Scroll-triggered animated counters ----------
  var counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var animateCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
      var duration = 1600;

      if (reduceMotion) {
        el.textContent = target.toFixed(decimals);
        return;
      }

      var start = null;
      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        var current = target * eased;
        el.textContent = current.toFixed(decimals);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toFixed(decimals);
        }
      }
      requestAnimationFrame(step);
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  // ---------- Portfolio: scroll-triggered staggered card reveal ----------
  var cards = document.querySelectorAll('.project-card');
  if (cards.length) {
    var cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
          setTimeout(function () { el.classList.add('is-visible'); }, delay);
          cardObserver.unobserve(el);
        }
      });
    }, { threshold: 0.15 });
    cards.forEach(function (el, i) {
      el.setAttribute('data-reveal-delay', String((i % 6) * 90));
      cardObserver.observe(el);
    });
  }

  // ---------- Portfolio: filter tabs ----------
  var filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    var tabs = filterBar.querySelectorAll('.filter-tab');
    var applyFilter = function (category) {
      cards.forEach(function (card) {
        var matches = category === 'all' || card.getAttribute('data-category') === category;
        card.classList.toggle('is-hidden-filter', !matches);
      });
    };
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');
        applyFilter(tab.getAttribute('data-filter'));
      });
    });
  }

  // ---------- Portfolio: lightbox ----------
  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lbArt = lightbox.querySelector('.thumb-art');
    var lbCat = lightbox.querySelector('.lightbox-cat');
    var lbTitle = lightbox.querySelector('.lightbox-title');
    var lbDesc = lightbox.querySelector('.lightbox-desc');
    var lbStack = lightbox.querySelector('.lightbox-stack');
    var lastFocused = null;

    var openLightbox = function (card) {
      lastFocused = document.activeElement;
      lbArt.className = 'thumb-art ' + card.querySelector('.thumb-art').classList[1];
      lbCat.textContent = card.getAttribute('data-cat-label');
      lbTitle.textContent = card.getAttribute('data-title');
      lbDesc.textContent = card.getAttribute('data-desc');
      lbStack.textContent = card.getAttribute('data-stack');
      lightbox.classList.add('is-open');
      lightbox.querySelector('.lightbox-close').focus();
      document.body.style.overflow = 'hidden';
    };
    var closeLightbox = function () {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    };

    cards.forEach(function (card) {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('click', function () { openLightbox(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(card); }
      });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  // ---------- About: timeline reveal ----------
  var timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length) {
    var tlObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var i = Array.prototype.indexOf.call(timelineItems, el);
          setTimeout(function () { el.classList.add('is-visible'); }, (i % 8) * 110);
          tlObserver.unobserve(el);
        }
      });
    }, { threshold: 0.25 });
    timelineItems.forEach(function (el) { tlObserver.observe(el); });
  }

  // ---------- About: animated skill bars ----------
  var skillBars = document.querySelectorAll('.skill-fill');
  if (skillBars.length) {
    var skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var pct = el.getAttribute('data-skill-percent') || '0';
          requestAnimationFrame(function () { el.style.width = pct + '%'; });
          skillObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    skillBars.forEach(function (el) { skillObserver.observe(el); });
  }

  // ---------- Generic staggered scroll reveal (services, achievements) ----------
  var revealGroups = [
    { selector: '.service-full-card', stagger: 110 },
    { selector: '.achievement-card', stagger: 100 }
  ];
  revealGroups.forEach(function (group) {
    var items = document.querySelectorAll(group.selector);
    if (!items.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var i = Array.prototype.indexOf.call(items, el);
          setTimeout(function () { el.classList.add('is-visible'); }, i * group.stagger);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });
    items.forEach(function (el) { obs.observe(el); });
  });

  // ---------- Contact form: reveal + real email submission (FormSubmit.co) ----------
  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    var formObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          formObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    formObs.observe(contactForm);

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = contactForm.querySelector('.form-note');
      var submitBtn = contactForm.querySelector('.form-submit');
      var endpoint = contactForm.getAttribute('action');
      if (!endpoint) {
        // site-render.js sets this from the saved contact email; fall back if it hasn't run
        endpoint = 'https://formsubmit.co/workwithayan26@gmail.com';
      }
      // use the AJAX endpoint variant so we can show an inline result instead of navigating away
      var ajaxEndpoint = endpoint.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');

      var formData = new FormData(contactForm);
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch(ajaxEndpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          if (result.ok) {
            note.textContent = 'Message sent — thanks! I\'ll get back to you soon.';
            note.classList.add('is-success');
            contactForm.reset();
          } else {
            throw new Error('Submit failed');
          }
        })
        .catch(function () {
          note.innerHTML = 'Something went wrong sending that. You can also email me directly at <a href="mailto:workwithayan26@gmail.com">workwithayan26@gmail.com</a>.';
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        });
    });
  }
});
