/* ==========================================================================
   SITE DATA LAYER
   Single source of truth for editable content. The Admin Panel writes here;
   every public page reads from here on load (site-render.js) so edits show
   up immediately in this browser. See admin/README inside the panel for
   the honest explanation of what this can and can't do without a server.
   ========================================================================== */

var SITE_DATA_KEY = 'ayanSiteData_v1';

var SITE_ICONS = {
  backend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><circle cx="7" cy="7" r="0.8" fill="currentColor" stroke="none"/><circle cx="7" cy="17" r="0.8" fill="currentColor" stroke="none"/></svg>',
  fullstack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="3" width="20" height="14" rx="1.5"/><path d="M8 21h8M12 17v4"/></svg>',
  database: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>',
  testing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 11l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>',
  tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="7" width="18" height="12" rx="1.5"/><path d="M3 11h18M8 15h2"/><path d="M8 7V5.5A1.5 1.5 0 019.5 4h5A1.5 1.5 0 0116 5.5V7"/></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="11" width="18" height="7" rx="1.5"/><path d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11"/><circle cx="7.5" cy="18" r="1.4"/><circle cx="16.5" cy="18" r="1.4"/></svg>',
  weather: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M17.5 19a4 4 0 000-8 5.5 5.5 0 00-10.6-1.7A4 4 0 007 17"/><path d="M7 17h10.5"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4z"/><path d="M7 6H4a3 3 0 003 3M17 6h3a3 3 0 01-3 3"/></svg>',
  medal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="5"/><path d="M8 13l-2 8 6-3 6 3-2-8"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>',
  cert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>'
};

var DEFAULT_SITE_DATA = {
  theme: 'sunset',

  hero: {
    roleA: 'Engineer',
    roleB: 'Visualizer',
    tagline: "I engineer ideas and visualize what they become — precise where it counts, striking where it matters.",
    photo: null
  },

  stats: [
    { value: 5, suffix: '+', decimals: 0, label: 'Projects completed' },
    { value: 10, suffix: '+', decimals: 0, label: 'Tools & technologies' },
    { value: 2, suffix: '+', decimals: 0, label: 'Years of hands-on practice' },
    { value: 100, suffix: '%', decimals: 0, label: 'Committed to every build' }
  ],

  services: [
    { icon: 'backend', title: 'Backend Development', desc: 'Designing and building backend systems with Spring Boot and Hibernate — clean, modular REST APIs backed by solid business logic, ready to plug into any frontend.', price: 'Custom quote' },
    { icon: 'fullstack', title: 'Full-Stack Web Applications', desc: 'End-to-end web apps — from database design through the backend to a responsive, functional frontend — built and tested as one connected system rather than disjointed pieces.', price: 'Custom quote' },
    { icon: 'database', title: 'Database Design & Integration', desc: 'Structuring MySQL databases and wiring them into your application through Hibernate or JDBC, so your data stays consistent, fast, and easy to reason about as the app grows.', price: 'Custom quote' },
    { icon: 'testing', title: 'API Testing & Debugging', desc: 'Validating endpoints and request/response payloads in Postman and covering business logic with JUnit test suites, so issues get caught before they reach real users.', price: 'Custom quote' }
  ],

  awards: [
    { icon: 'trophy', year: '2025', title: '1st Runner Up — TechFest Coding Competition', issuer: 'TechFest', desc: "Placed 1st Runner Up against other student competitors in a timed coding competition — a solid early test of building under pressure." },
    { icon: 'trophy', year: '2026', title: '2nd Runner Up — TechFest Coding Competition', issuer: 'TechFest', desc: "Followed up the previous year's result with another podium finish at TechFest's coding competition." },
    { icon: 'medal', year: '2023', title: '1st Position — Novice Nexus Project Competition', issuer: 'Pandora Club of DESH', desc: "Won 1st place at the Novice Nexus Project Competition, organized by the Pandora Club of DESH — my first competition win." },
    { icon: 'rocket', year: '2024', title: 'Hackathon Participant', issuer: 'Smart India Hackathon & HackFest State Level', desc: "Competed in Smart India Hackathon 2024 and HackFest State Level, building and pitching under real time constraints alongside other student teams." },
    { icon: 'cert', year: '2024', title: 'Software Engineering Virtual Simulation', issuer: 'Electronic Arts, via Forage', desc: "Completed EA's Software Engineering virtual job simulation on Forage in September 2024, working through a real-world style engineering task set." },
    { icon: 'car', year: 'Nov–Dec 2024', title: 'Java Development Internship', issuer: 'Cognifyz Technologies', desc: "Developed and optimized core backend modules and collaborated on scalable application workflows during a remote internship — first real-world engineering experience." }
  ],

  projects: [
    { category: 'fullstack', catLabel: 'Full-Stack Systems', title: 'Car Rental System', shortDesc: 'Built the booking, inventory, and admin management flow end-to-end.', desc: "An end-to-end car rental platform handling vehicle inventory, bookings, and admin-side fleet management — my main project and the one I'm most proud of.", stack: 'Java · Spring Boot · Hibernate · MySQL · REST APIs', icon: 'car', featured: true, image: null },
    { category: 'fullstack', catLabel: 'Full-Stack Systems', title: 'Hospital Management System', shortDesc: 'Modular REST APIs to manage patient records and appointment scheduling.', desc: "Backend services built with Spring Boot and Hibernate ORM to manage patient records and appointment scheduling through modular RESTful APIs, with endpoints validated in Postman and covered by JUnit test suites.", stack: 'Java · Spring Boot · Hibernate · REST APIs · Postman · JUnit · MySQL', icon: 'testing', featured: false, image: null },
    { category: 'backend', catLabel: 'Backend & APIs', title: 'Weather Sphere', shortDesc: 'Dynamic weather web app with live forecasts and condition-based UI themes.', desc: "A Java Servlet-driven web app fetching real-time weather metrics, hourly forecasts, and city suggestions via external REST APIs, with a responsive frontend built using asynchronous JavaScript (Fetch API) that shifts its theme based on live conditions.", stack: 'Java Servlets · REST APIs · HTML5 · CSS3 · JavaScript', icon: 'weather', featured: false, image: null },
    { category: 'tools', catLabel: 'Tools & Utilities', title: 'Bank Management System', shortDesc: 'Desktop banking simulator with secure authentication and JDBC persistence.', desc: "A desktop banking application simulating core ATM transactions — deposits, withdrawals, and PIN management — built on robust OOP principles, with the Java backend linked to MySQL via JDBC for secure authentication and transactional consistency.", stack: 'Core Java · MySQL · JDBC · OOP', icon: 'tools', featured: false, image: null }
  ],

  about: {
    story: [
      "My path into engineering started with curiosity about how software actually works — not just using it, but building it. Over the course of my Computer Science degree, I built a foundation in Core Java, object-oriented design, and backend architecture with Spring Boot, and turned that curiosity into real, working systems through coursework, internships, and my own projects.",
      "What I focus on isn't just writing code that runs — it's how a system is structured underneath: clean RESTful APIs, dependable data flow between the backend and a database, and logic that holds up under real use and testing. From backend services that manage patient records to a full car rental platform built from the ground up, I combine strong fundamentals with a growing instinct for what makes software genuinely reliable.",
      "My goal is to keep building systems that solve real problems, and to grow from a final-year Computer Science student into an engineer that teams can hand their hardest backend problems to."
    ],
    skills: [
      { name: 'Java & Object-Oriented Programming', pct: 90 },
      { name: 'Spring Boot & REST APIs', pct: 85 },
      { name: 'Databases — MySQL, Hibernate & JDBC', pct: 82 },
      { name: 'Testing — JUnit & Postman', pct: 78 },
      { name: 'Git, GitHub & Dev Tooling', pct: 88 }
    ]
  },

  contact: {
    email: 'workwithayan26@gmail.com',
    whatsapp: '+917584095175',
    instagram: 'https://www.instagram.com/ayan_ajmeri_09/',
    youtube: 'https://www.youtube.com/@KAFU69',
    github: 'https://github.com/Ayanajmeri924',
    linkedin: 'https://www.linkedin.com/in/ayan-ajmeri/',
    leetcode: 'https://leetcode.com/u/Ayan_Ajmeri/'
  }
};

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function loadSiteData() {
  try {
    var raw = localStorage.getItem(SITE_DATA_KEY);
    if (!raw) return deepClone(DEFAULT_SITE_DATA);
    var stored = JSON.parse(raw);
    // shallow-merge top level so new default fields introduced later don't break old saves
    var merged = deepClone(DEFAULT_SITE_DATA);
    for (var key in stored) { if (stored.hasOwnProperty(key)) merged[key] = stored[key]; }
    return merged;
  } catch (e) {
    console.warn('Site data failed to load, using defaults.', e);
    return deepClone(DEFAULT_SITE_DATA);
  }
}

function saveSiteData(data) {
  try {
    localStorage.setItem(SITE_DATA_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Site data failed to save (likely storage full — try smaller/fewer images).', e);
    return false;
  }
}

function resetSiteData() {
  localStorage.removeItem(SITE_DATA_KEY);
}
