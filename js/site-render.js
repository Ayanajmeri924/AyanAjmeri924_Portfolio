/* ==========================================================================
   SITE RENDER
   Runs before main.js. Pulls the current site data (defaults + any Admin
   Panel overrides saved in this browser) and paints it onto the page.
   ========================================================================== */

(function () {

  function applyTheme(data) {
    document.documentElement.setAttribute('data-theme', data.theme || 'sunset');
  }

  function renderHero(data) {
    var roleA = document.querySelector('[data-field="hero-role-a"]');
    var roleB = document.querySelector('[data-field="hero-role-b"]');
    var tagline = document.querySelector('[data-field="hero-tagline"]');
    var photoSlot = document.querySelector('[data-field="hero-photo-slot"]');
    if (roleA) roleA.textContent = data.hero.roleA;
    if (roleB) roleB.textContent = data.hero.roleB;
    if (tagline) tagline.textContent = data.hero.tagline;
    if (photoSlot) {
      if (data.hero.photo) {
        photoSlot.innerHTML = '<img src="' + data.hero.photo + '" alt="Profile photo" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;">';
      } else if (!photoSlot.querySelector('svg')) {
        photoSlot.innerHTML = defaultPlaceholderSVG();
      }
    }
  }

  function defaultPlaceholderSVG() {
    return '<svg class="placeholder-figure" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder profile photo">' +
      '<rect width="400" height="500" fill="#e3dccb"/><circle cx="200" cy="190" r="78" fill="#c9c0aa"/>' +
      '<path d="M60 470 C60 350 140 300 200 300 C260 300 340 350 340 470 Z" fill="#c9c0aa"/>' +
      '<circle cx="200" cy="190" r="78" fill="none" stroke="#ff5a1f" stroke-width="2" stroke-dasharray="6 6" opacity="0.55"/></svg>';
  }

  function renderStats(data) {
    var els = document.querySelectorAll('[data-field="stat"]');
    els.forEach(function (el, i) {
      var s = data.stats[i];
      if (!s) return;
      var num = el.querySelector('[data-count-to]');
      var suffix = el.querySelector('.suffix');
      var label = el.querySelector('.stat-label');
      if (num) { num.setAttribute('data-count-to', s.value); num.textContent = '0'; }
      if (suffix) suffix.textContent = s.suffix;
      if (label) label.textContent = s.label;
    });
  }

  function serviceCardHTML(s, full) {
    var icon = SITE_ICONS[s.icon] || SITE_ICONS.backend;
    if (full) {
      return '<div class="service-full-card">' +
        '<div class="icon-badge">' + icon + '</div>' +
        '<h3>' + escapeHTML(s.title) + '</h3>' +
        '<p class="desc">' + escapeHTML(s.desc) + '</p>' +
        '<div class="price-row"><span class="price-label">Starting at</span><span class="price-value">' + escapeHTML(s.price) + '</span></div>' +
        '</div>';
    }
    return '<div class="service-card"><span class="icon">' + icon + '</span>' +
      '<h3>' + escapeHTML(s.title) + '</h3>' +
      '<p>' + escapeHTML(shorten(s.desc, 90)) + '</p></div>';
  }

  function renderServicesTeaser(data) {
    var grid = document.querySelector('[data-field="services-teaser-grid"]');
    if (!grid) return;
    grid.innerHTML = data.services.slice(0, 3).map(function (s) { return serviceCardHTML(s, false); }).join('');
  }

  function renderServicesFull(data) {
    var grid = document.querySelector('[data-field="services-full-grid"]');
    if (!grid) return;
    grid.innerHTML = data.services.map(function (s) { return serviceCardHTML(s, true); }).join('');
  }

  function awardCardHTML(a) {
    var icon = SITE_ICONS[a.icon] || SITE_ICONS.trophy;
    return '<div class="achievement-card">' +
      '<div class="badge-row"><div class="badge-icon">' + icon + '</div><span class="a-year">' + escapeHTML(a.year) + '</span></div>' +
      '<h3>' + escapeHTML(a.title) + '</h3>' +
      '<p class="a-source">' + escapeHTML(a.issuer) + '</p>' +
      '<p class="a-desc">' + escapeHTML(a.desc) + '</p></div>';
  }

  function renderAwards(data) {
    var grid = document.querySelector('[data-field="awards-grid"]');
    if (!grid) return;
    grid.innerHTML = data.awards.map(awardCardHTML).join('');
  }

  function thumbInner(p) {
    if (p.image) {
      return '<img src="' + p.image + '" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">';
    }
    var icon = SITE_ICONS[p.icon] || SITE_ICONS.tools;
    return icon.replace('<svg ', '<svg class="art-icon" ');
  }

  function projectCardHTML(p, forHome) {
    var thumbClass = 'thumb-' + (p.category === 'backend' ? 'backend' : (p.category === 'tools' ? 'tools' : 'fullstack'));
    if (forHome) {
      return '<div class="work-card">' +
        '<div class="thumb thumb-art ' + thumbClass + '">' + thumbInner(p) + '</div>' +
        '<div class="work-info"><p class="work-title">' + escapeHTML(p.title) + '</p><p class="work-tag">' + escapeHTML(p.catLabel) + '</p></div>' +
        '</div>';
    }
    return '<article class="project-card" data-category="' + escapeAttr(p.category) + '" data-title="' + escapeAttr(p.title) + '" data-cat-label="' + escapeAttr(p.catLabel) + '" data-desc="' + escapeAttr(p.desc) + '" data-stack="' + escapeAttr(p.stack) + '">' +
      '<div class="project-thumb">' + (p.featured ? '<span class="featured-tag">Main project</span>' : '') +
      '<div class="thumb-art ' + thumbClass + '">' + thumbInner(p) + '</div></div>' +
      '<div class="project-body"><h3>' + escapeHTML(p.title) + '</h3><p class="desc">' + escapeHTML(p.shortDesc) + '</p><p class="stack">' + escapeHTML(p.stack) + '</p></div>' +
      '</article>';
  }

  function renderHomeFeatured(data) {
    var grid = document.querySelector('[data-field="home-work-grid"]');
    if (!grid) return;
    grid.innerHTML = data.projects.slice(0, 6).map(function (p) { return projectCardHTML(p, true); }).join('');
  }

  function renderPortfolioGrid(data) {
    var grid = document.querySelector('[data-field="project-grid"]');
    if (!grid) return;
    grid.innerHTML = data.projects.map(function (p) { return projectCardHTML(p, false); }).join('');

    var counts = { all: data.projects.length, fullstack: 0, backend: 0, tools: 0 };
    data.projects.forEach(function (p) { if (counts[p.category] !== undefined) counts[p.category]++; });
    document.querySelectorAll('.filter-tab').forEach(function (tab) {
      var key = tab.getAttribute('data-filter');
      var countEl = tab.querySelector('.count');
      if (countEl && counts[key] !== undefined) countEl.textContent = '(' + counts[key] + ')';
    });
  }

  function renderAbout(data) {
    var paras = document.querySelectorAll('[data-field="story-paragraph"]');
    paras.forEach(function (el, i) {
      if (data.about.story[i]) el.textContent = data.about.story[i];
    });
    var skillRows = document.querySelectorAll('[data-field="skill-row"]');
    skillRows.forEach(function (el, i) {
      var s = data.about.skills[i];
      if (!s) return;
      var name = el.querySelector('.skill-name');
      var pct = el.querySelector('.skill-pct');
      var fill = el.querySelector('.skill-fill');
      if (name) name.textContent = s.name;
      if (pct) pct.textContent = s.pct + '%';
      if (fill) { fill.setAttribute('data-skill-percent', s.pct); fill.style.width = '0%'; }
    });
  }

  function renderContactAndSocials(data) {
    var c = data.contact;
    var waDigits = (c.whatsapp || '').replace(/[^\d]/g, '');

    document.querySelectorAll('[data-field="contact-email-link"]').forEach(function (el) {
      el.href = 'mailto:' + c.email;
      var text = el.querySelector('[data-field="contact-email-text"]');
      if (text) text.textContent = c.email; else if (!el.querySelector('svg')) el.textContent = c.email;
    });
    document.querySelectorAll('[data-field="contact-whatsapp-link"]').forEach(function (el) {
      el.href = 'https://wa.me/' + waDigits;
      var text = el.querySelector('[data-field="contact-whatsapp-text"]');
      if (text) text.textContent = 'WhatsApp: ' + c.whatsapp;
    });
    setHref('[data-field="social-instagram"]', c.instagram);
    setHref('[data-field="social-youtube"]', c.youtube);
    setHref('[data-field="social-github"]', c.github);
    setHref('[data-field="social-linkedin"]', c.linkedin);
    setHref('[data-field="social-leetcode"]', c.leetcode);
    document.querySelectorAll('[data-field="social-email"]').forEach(function (el) { el.href = 'mailto:' + c.email; });

    var form = document.querySelector('.contact-form');
    if (form) form.setAttribute('action', 'https://formsubmit.co/' + c.email);
  }

  function setHref(selector, url) {
    if (!url) return;
    document.querySelectorAll(selector).forEach(function (el) { el.href = url; });
  }

  function shorten(str, n) { return str.length > n ? str.slice(0, n - 1).trim() + '…' : str; }
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function escapeAttr(str) { return escapeHTML(str); }

  function renderAll() {
    var data = loadSiteData();
    applyTheme(data);
    renderHero(data);
    renderStats(data);
    renderServicesTeaser(data);
    renderServicesFull(data);
    renderAwards(data);
    renderHomeFeatured(data);
    renderPortfolioGrid(data);
    renderAbout(data);
    renderContactAndSocials(data);
    window.__siteDataRendered = true;
  }

  document.addEventListener('DOMContentLoaded', renderAll);

  // Live-update this page if the Admin Panel saves changes in another tab
  window.addEventListener('storage', function (e) {
    if (e.key === SITE_DATA_KEY) {
      location.reload();
    }
  });

})();
