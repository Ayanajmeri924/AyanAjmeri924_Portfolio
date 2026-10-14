/* ==========================================================================
   ADMIN PANEL LOGIC
   ========================================================================== */

var DEFAULT_ADMIN = { username: 'AyanAjmeri', password: '@Aditi' };
var CREDS_KEY = 'ayanAdminCreds_v1';
var AUTH_KEY = 'ayanAdminAuth_v1';

function getAdminCreds() {
  try {
    var raw = localStorage.getItem(CREDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEFAULT_ADMIN;
}

var THEME_LIST = [
  { id: 'sunset', name: 'Sunset Studio', colors: ['#efeae1', '#ff5a1f', '#0057ff'] },
  { id: 'midnight', name: 'Midnight Blueprint', colors: ['#14151a', '#ff6a33', '#4d84ff'] },
  { id: 'coral', name: 'Coral Reef', colors: ['#fbf3ec', '#ff6f5e', '#17a398'] },
  { id: 'mono', name: 'Mono Ink', colors: ['#f0efec', '#ff5a1f', '#5b5b60'] }
];

/* ---------- Image compression (keeps localStorage usage sane) ---------- */
function compressImageFile(file, maxWidth, quality, callback) {
  var reader = new FileReader();
  reader.onload = function (e) {
    var img = new Image();
    img.onload = function () {
      var scale = Math.min(1, maxWidth / img.width);
      var canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

/* ==========================================================================
   LOGIN PAGE
   ========================================================================== */
(function () {
  var form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var u = document.getElementById('username').value.trim();
    var p = document.getElementById('password').value;
    var creds = getAdminCreds();
    var err = document.getElementById('login-error');

    if (u === creds.username && p === creds.password) {
      sessionStorage.setItem(AUTH_KEY, '1');
      window.location.href = 'dashboard.html';
    } else {
      err.classList.add('is-shown');
    }
  });
})();

/* ==========================================================================
   DASHBOARD
   ========================================================================== */
(function () {
  var nav = document.getElementById('admin-nav');
  if (!nav) return;

  // ---- Auth guard ----
  if (sessionStorage.getItem(AUTH_KEY) !== '1') {
    window.location.href = 'index.html';
    return;
  }
  document.getElementById('logout-btn').addEventListener('click', function () {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.href = 'index.html';
  });

  // ---- Sidebar tab switching ----
  nav.querySelectorAll('button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      nav.querySelectorAll('button').forEach(function (b) { b.classList.remove('is-active'); });
      document.querySelectorAll('.admin-panel').forEach(function (p) { p.classList.remove('is-active'); });
      btn.classList.add('is-active');
      document.getElementById(btn.getAttribute('data-target')).classList.add('is-active');
    });
  });

  // ---- Working data (loaded once, mutated in memory, written back on Save) ----
  var data = loadSiteData();

  function flashSaved(id) {
    var note = document.getElementById(id);
    if (!note) return;
    note.classList.add('is-shown');
    setTimeout(function () { note.classList.remove('is-shown'); }, 2200);
  }

  function persist() {
    var ok = saveSiteData(data);
    updateStorageUsage();
    return ok;
  }

  /* ---------------- HOME ---------------- */
  document.getElementById('home-role-a').value = data.hero.roleA;
  document.getElementById('home-role-b').value = data.hero.roleB;
  document.getElementById('home-tagline').value = data.hero.tagline;

  function renderHeroPhotoPreview() {
    var preview = document.getElementById('home-photo-preview');
    preview.innerHTML = data.hero.photo ? '<img src="' + data.hero.photo + '">' : 'No photo uploaded';
  }
  renderHeroPhotoPreview();

  document.getElementById('home-photo-input').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;
    compressImageFile(file, 700, 0.82, function (dataUrl) {
      data.hero.photo = dataUrl;
      renderHeroPhotoPreview();
    });
  });
  document.getElementById('home-photo-clear').addEventListener('click', function () {
    data.hero.photo = null;
    renderHeroPhotoPreview();
  });

  function renderStatsForm() {
    var list = document.getElementById('stats-list');
    list.innerHTML = data.stats.map(function (s, i) {
      return '<div class="a-row-3" style="margin-bottom:14px;">' +
        '<div class="a-field" style="margin-bottom:0;"><label>Value</label><input type="number" data-stat="' + i + '" data-k="value" value="' + s.value + '"></div>' +
        '<div class="a-field" style="margin-bottom:0;"><label>Suffix</label><input type="text" data-stat="' + i + '" data-k="suffix" value="' + s.suffix + '"></div>' +
        '<div class="a-field" style="margin-bottom:0;"><label>Label</label><input type="text" data-stat="' + i + '" data-k="label" value="' + s.label.replace(/"/g, '&quot;') + '"></div>' +
        '</div>';
    }).join('');
  }
  renderStatsForm();

  document.getElementById('save-home').addEventListener('click', function () {
    data.hero.roleA = document.getElementById('home-role-a').value;
    data.hero.roleB = document.getElementById('home-role-b').value;
    data.hero.tagline = document.getElementById('home-tagline').value;
    document.querySelectorAll('#stats-list input').forEach(function (input) {
      var i = parseInt(input.getAttribute('data-stat'), 10);
      var k = input.getAttribute('data-k');
      data.stats[i][k] = (k === 'value') ? parseFloat(input.value) : input.value;
    });
    persist();
    flashSaved('note-home');
  });

  /* ---------------- PORTFOLIO PROJECTS ---------------- */
  function renderProjectsList() {
    var list = document.getElementById('projects-list');
    list.innerHTML = data.projects.map(function (p, i) {
      return '<div class="a-card" data-project="' + i + '">' +
        '<div class="a-card-top"><span class="a-card-title">Project ' + (i + 1) + '</span>' +
        '<button class="a-remove-btn" data-remove-project="' + i + '">Remove</button></div>' +
        '<div class="a-field"><label>Thumbnail image</label>' +
        '<div class="a-thumb-preview" data-project-preview="' + i + '">' + (p.image ? '<img src="' + p.image + '">' : 'No image uploaded — using icon placeholder') + '</div>' +
        '<input type="file" accept="image/*" data-project-image="' + i + '"></div>' +
        '<div class="a-row-2">' +
        '<div class="a-field"><label>Title</label><input type="text" data-project-field="title" data-i="' + i + '" value="' + escAttr(p.title) + '"></div>' +
        '<div class="a-field"><label>Category</label><select data-project-field="category" data-i="' + i + '">' +
        catOption('fullstack', 'Full-Stack Systems', p.category) + catOption('backend', 'Backend & APIs', p.category) + catOption('tools', 'Tools & Utilities', p.category) +
        '</select></div></div>' +
        '<div class="a-field"><label>Short description (shown on card)</label><input type="text" data-project-field="shortDesc" data-i="' + i + '" value="' + escAttr(p.shortDesc) + '"></div>' +
        '<div class="a-field"><label>Full description (shown in lightbox)</label><textarea data-project-field="desc" data-i="' + i + '">' + escHTML(p.desc) + '</textarea></div>' +
        '<div class="a-field"><label>Tech stack</label><input type="text" data-project-field="stack" data-i="' + i + '" value="' + escAttr(p.stack) + '"></div>' +
        '<div class="a-field"><label><input type="checkbox" data-project-field="featured" data-i="' + i + '" ' + (p.featured ? 'checked' : '') + ' style="width:auto; margin-right:8px;">Mark as featured / main project</label></div>' +
        '</div>';
    }).join('');

    list.querySelectorAll('[data-project-image]').forEach(function (input) {
      input.addEventListener('change', function (e) {
        var i = parseInt(input.getAttribute('data-project-image'), 10);
        var file = e.target.files[0];
        if (!file) return;
        compressImageFile(file, 700, 0.8, function (dataUrl) {
          data.projects[i].image = dataUrl;
          var prev = list.querySelector('[data-project-preview="' + i + '"]');
          if (prev) prev.innerHTML = '<img src="' + dataUrl + '">';
        });
      });
    });
    list.querySelectorAll('[data-remove-project]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        data.projects.splice(parseInt(btn.getAttribute('data-remove-project'), 10), 1);
        renderProjectsList();
      });
    });
  }
  renderProjectsList();

  document.getElementById('add-project-btn').addEventListener('click', function () {
    data.projects.push({ category: 'fullstack', catLabel: 'Full-Stack Systems', title: 'New Project', shortDesc: 'One-line description.', desc: 'Full project description.', stack: 'Tech stack here', icon: 'tools', featured: false, image: null });
    renderProjectsList();
  });

  document.getElementById('save-projects').addEventListener('click', function () {
    document.querySelectorAll('[data-project-field]').forEach(function (el) {
      var i = parseInt(el.getAttribute('data-i'), 10);
      var field = el.getAttribute('data-project-field');
      var val = el.type === 'checkbox' ? el.checked : el.value;
      data.projects[i][field] = val;
      if (field === 'category') {
        var labels = { fullstack: 'Full-Stack Systems', backend: 'Backend & APIs', tools: 'Tools & Utilities' };
        data.projects[i].catLabel = labels[val];
        data.projects[i].icon = val === 'backend' ? 'weather' : (val === 'tools' ? 'tools' : 'fullstack');
      }
    });
    persist();
    flashSaved('note-projects');
  });

  /* ---------------- ABOUT ---------------- */
  document.getElementById('about-p0').value = data.about.story[0] || '';
  document.getElementById('about-p1').value = data.about.story[1] || '';
  document.getElementById('about-p2').value = data.about.story[2] || '';

  function renderSkillsForm() {
    var list = document.getElementById('skills-list');
    list.innerHTML = data.about.skills.map(function (s, i) {
      return '<div class="a-row-2" style="margin-bottom:14px;">' +
        '<div class="a-field" style="margin-bottom:0;"><label>Skill name</label><input type="text" data-skill="' + i + '" data-k="name" value="' + escAttr(s.name) + '"></div>' +
        '<div class="a-field" style="margin-bottom:0;"><label>Proficiency %</label><input type="number" min="0" max="100" data-skill="' + i + '" data-k="pct" value="' + s.pct + '"></div>' +
        '</div>';
    }).join('');
  }
  renderSkillsForm();

  document.getElementById('save-about').addEventListener('click', function () {
    data.about.story[0] = document.getElementById('about-p0').value;
    data.about.story[1] = document.getElementById('about-p1').value;
    data.about.story[2] = document.getElementById('about-p2').value;
    document.querySelectorAll('#skills-list input').forEach(function (input) {
      var i = parseInt(input.getAttribute('data-skill'), 10);
      var k = input.getAttribute('data-k');
      data.about.skills[i][k] = (k === 'pct') ? parseInt(input.value, 10) : input.value;
    });
    persist();
    flashSaved('note-about');
  });

  /* ---------------- SERVICES ---------------- */
  function renderServicesList() {
    var list = document.getElementById('services-list');
    list.innerHTML = data.services.map(function (s, i) {
      return '<div class="a-card">' +
        '<div class="a-card-top"><span class="a-card-title">Service ' + (i + 1) + '</span>' +
        '<button class="a-remove-btn" data-remove-service="' + i + '">Remove</button></div>' +
        '<div class="a-row-2">' +
        '<div class="a-field"><label>Title</label><input type="text" data-svc-field="title" data-i="' + i + '" value="' + escAttr(s.title) + '"></div>' +
        '<div class="a-field"><label>Icon</label><select data-svc-field="icon" data-i="' + i + '">' +
        iconOption('backend', s.icon) + iconOption('fullstack', s.icon) + iconOption('database', s.icon) + iconOption('testing', s.icon) + iconOption('tools', s.icon) +
        '</select></div></div>' +
        '<div class="a-field"><label>Description</label><textarea data-svc-field="desc" data-i="' + i + '">' + escHTML(s.desc) + '</textarea></div>' +
        '<div class="a-field"><label>Starting price</label><input type="text" data-svc-field="price" data-i="' + i + '" value="' + escAttr(s.price) + '"></div>' +
        '</div>';
    }).join('');
    list.querySelectorAll('[data-remove-service]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        data.services.splice(parseInt(btn.getAttribute('data-remove-service'), 10), 1);
        renderServicesList();
      });
    });
  }
  renderServicesList();

  document.getElementById('add-service-btn').addEventListener('click', function () {
    data.services.push({ icon: 'backend', title: 'New Service', desc: 'Describe what this service covers.', price: 'Custom quote' });
    renderServicesList();
  });

  document.getElementById('save-services').addEventListener('click', function () {
    document.querySelectorAll('[data-svc-field]').forEach(function (el) {
      var i = parseInt(el.getAttribute('data-i'), 10);
      data.services[i][el.getAttribute('data-svc-field')] = el.value;
    });
    persist();
    flashSaved('note-services');
  });

  /* ---------------- AWARDS ---------------- */
  function renderAwardsList() {
    var list = document.getElementById('awards-list');
    list.innerHTML = data.awards.map(function (a, i) {
      return '<div class="a-card">' +
        '<div class="a-card-top"><span class="a-card-title">Achievement ' + (i + 1) + '</span>' +
        '<button class="a-remove-btn" data-remove-award="' + i + '">Remove</button></div>' +
        '<div class="a-row-2">' +
        '<div class="a-field"><label>Award name</label><input type="text" data-award-field="title" data-i="' + i + '" value="' + escAttr(a.title) + '"></div>' +
        '<div class="a-field"><label>Year</label><input type="text" data-award-field="year" data-i="' + i + '" value="' + escAttr(a.year) + '"></div></div>' +
        '<div class="a-field"><label>Given by</label><input type="text" data-award-field="issuer" data-i="' + i + '" value="' + escAttr(a.issuer) + '"></div>' +
        '<div class="a-field"><label>Why it matters</label><textarea data-award-field="desc" data-i="' + i + '">' + escHTML(a.desc) + '</textarea></div>' +
        '<div class="a-field"><label>Icon</label><select data-award-field="icon" data-i="' + i + '">' +
        iconOption('trophy', a.icon) + iconOption('medal', a.icon) + iconOption('rocket', a.icon) + iconOption('cert', a.icon) + iconOption('star', a.icon) + iconOption('car', a.icon) +
        '</select></div>' +
        '</div>';
    }).join('');
    list.querySelectorAll('[data-remove-award]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        data.awards.splice(parseInt(btn.getAttribute('data-remove-award'), 10), 1);
        renderAwardsList();
      });
    });
  }
  renderAwardsList();

  document.getElementById('add-award-btn').addEventListener('click', function () {
    data.awards.push({ icon: 'star', year: '2026', title: 'New Achievement', issuer: 'Issuer name', desc: 'Why this one matters.' });
    renderAwardsList();
  });

  document.getElementById('save-awards').addEventListener('click', function () {
    document.querySelectorAll('[data-award-field]').forEach(function (el) {
      var i = parseInt(el.getAttribute('data-i'), 10);
      data.awards[i][el.getAttribute('data-award-field')] = el.value;
    });
    persist();
    flashSaved('note-awards');
  });

  /* ---------------- CONTACT + SOCIAL ---------------- */
  document.getElementById('contact-email').value = data.contact.email;
  document.getElementById('contact-whatsapp').value = data.contact.whatsapp;
  document.getElementById('save-contact').addEventListener('click', function () {
    data.contact.email = document.getElementById('contact-email').value.trim();
    data.contact.whatsapp = document.getElementById('contact-whatsapp').value.trim();
    persist();
    flashSaved('note-contact');
  });

  document.getElementById('social-instagram').value = data.contact.instagram;
  document.getElementById('social-youtube').value = data.contact.youtube;
  document.getElementById('social-github').value = data.contact.github;
  document.getElementById('social-linkedin').value = data.contact.linkedin;
  document.getElementById('social-leetcode').value = data.contact.leetcode;
  document.getElementById('save-social').addEventListener('click', function () {
    data.contact.instagram = document.getElementById('social-instagram').value.trim();
    data.contact.youtube = document.getElementById('social-youtube').value.trim();
    data.contact.github = document.getElementById('social-github').value.trim();
    data.contact.linkedin = document.getElementById('social-linkedin').value.trim();
    data.contact.leetcode = document.getElementById('social-leetcode').value.trim();
    persist();
    flashSaved('note-social');
  });

  /* ---------------- IMAGES & MEDIA ---------------- */
  function updateStorageUsage() {
    var raw = localStorage.getItem(SITE_DATA_KEY) || '';
    var kb = Math.round((raw.length * 2) / 1024); // rough UTF-16 byte estimate
    var pct = Math.min(100, Math.round((kb / 5120) * 100)); // most browsers cap ~5MB/origin
    document.getElementById('storage-usage').textContent =
      'Using roughly ' + kb + ' KB of this browser\'s ~5 MB storage limit (' + pct + '%). If uploads stop saving, remove an image or two — the limit is per-browser, not a hosting limit.';
  }
  updateStorageUsage();

  document.getElementById('clear-images-btn').addEventListener('click', function () {
    if (!confirm('Remove the profile photo and all project thumbnail images?')) return;
    data.hero.photo = null;
    data.projects.forEach(function (p) { p.image = null; });
    persist();
    renderHeroPhotoPreview();
    renderProjectsList();
  });

  /* ---------------- THEMES ---------------- */
  function renderThemeGrid() {
    var grid = document.getElementById('theme-grid');
    grid.innerHTML = THEME_LIST.map(function (t) {
      var selected = data.theme === t.id ? ' is-selected' : '';
      var swatches = t.colors.map(function (c) { return '<span style="background:' + c + '"></span>'; }).join('');
      return '<div class="theme-swatch' + selected + '" data-theme-id="' + t.id + '">' +
        '<div class="swatch-preview">' + swatches + '</div>' +
        '<div class="swatch-label">' + t.name + '</div></div>';
    }).join('');
    grid.querySelectorAll('.theme-swatch').forEach(function (el) {
      el.addEventListener('click', function () {
        data.theme = el.getAttribute('data-theme-id');
        document.documentElement.setAttribute('data-theme', data.theme);
        persist();
        renderThemeGrid();
      });
    });
  }
  document.documentElement.setAttribute('data-theme', data.theme);
  renderThemeGrid();

  /* ---------------- SETTINGS: export / import / reset ---------------- */
  document.getElementById('export-btn').addEventListener('click', function () {
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'ayan-portfolio-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('import-input').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (evt) {
      try {
        var imported = JSON.parse(evt.target.result);
        data = imported;
        saveSiteData(data);
        alert('Backup imported. The dashboard will now reload.');
        location.reload();
      } catch (err) {
        alert('That file could not be read as a valid backup.');
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('reset-btn').addEventListener('click', function () {
    if (!confirm('This clears every Admin Panel edit and restores the original site content. Continue?')) return;
    resetSiteData();
    location.reload();
  });

  /* ---------------- ACCOUNT ---------------- */
  document.getElementById('save-account').addEventListener('click', function () {
    var creds = getAdminCreds();
    var current = document.getElementById('acc-current').value;
    var newUser = document.getElementById('acc-username').value.trim();
    var newPass = document.getElementById('acc-password').value;
    var confirmPass = document.getElementById('acc-password-confirm').value;

    if (current !== creds.password) { alert('Current password is incorrect.'); return; }
    if (!newUser || !newPass) { alert('Fill in both the new username and new password.'); return; }
    if (newPass !== confirmPass) { alert('New password and confirmation don\'t match.'); return; }

    localStorage.setItem(CREDS_KEY, JSON.stringify({ username: newUser, password: newPass }));
    flashSaved('note-account');
    document.getElementById('acc-current').value = '';
    document.getElementById('acc-password').value = '';
    document.getElementById('acc-password-confirm').value = '';
  });

  /* ---------------- helpers ---------------- */
  function escAttr(str) { return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }
  function escHTML(str) { return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function catOption(val, label, current) { return '<option value="' + val + '"' + (val === current ? ' selected' : '') + '>' + label + '</option>'; }
  function iconOption(val, current) { return '<option value="' + val + '"' + (val === current ? ' selected' : '') + '>' + val.charAt(0).toUpperCase() + val.slice(1) + '</option>'; }

})();
