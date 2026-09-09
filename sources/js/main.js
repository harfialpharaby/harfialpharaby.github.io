/* harfialpharaby.github.io — theme, typewriter, reveal, shell.
   Everything here is progressive enhancement: the page is complete without it. */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── storage helpers (private mode / blocked cookies throw) ───────── */
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }

  /* ── theme ───────────────────────────────────────────────────────── */
  var sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  var btn = document.getElementById('theme-toggle');
  var label = document.getElementById('theme-label');

  function current() {
    var set = root.getAttribute('data-theme');
    if (set === 'dark' || set === 'light') return set;
    return (sysDark && sysDark.matches) ? 'dark' : 'light';
  }
  function paint() {
    var now = current();
    if (btn) btn.setAttribute('aria-pressed', String(now === 'dark'));
    if (label) label.textContent = 'theme --set ' + (now === 'dark' ? 'light' : 'dark');
    if (btn) btn.setAttribute('aria-label', 'Switch to ' + (now === 'dark' ? 'light' : 'dark') + ' theme');
  }
  function setTheme(next) {
    root.setAttribute('data-theme', next);
    write('theme', next);
    paint();
  }
  if (btn) btn.addEventListener('click', function () {
    setTheme(current() === 'dark' ? 'light' : 'dark');
  });
  if (sysDark && sysDark.addEventListener) {
    sysDark.addEventListener('change', function () { if (!read('theme')) paint(); });
  }
  paint();

  /* ── typewriter ──────────────────────────────────────────────────── */
  var typed = [].slice.call(document.querySelectorAll('[data-type]'));
  if (typed.length && !reduced) {
    var queue = typed.map(function (el) {
      var html = el.innerHTML;
      var text = el.textContent;
      // reserve the rendered height first so clearing the text cannot shift the page
      el.style.minHeight = el.getBoundingClientRect().height + 'px';
      el.textContent = '';
      return { el: el, html: html, text: text };
    });
    var qi = 0;
    (function runOne() {
      if (qi >= queue.length) return;
      var job = queue[qi++];
      var el = job.el, i = 0;
      el.classList.add('typing');
      (function tick() {
        if (i <= job.text.length) {
          el.textContent = job.text.slice(0, i++);
          setTimeout(tick, i < 3 ? 90 : 26);
        } else {
          el.innerHTML = job.html;   // restore inline markup once complete
          el.style.minHeight = '';
          el.classList.remove('typing');
          setTimeout(runOne, 120);
        }
      })();
    })();
  }

  /* ── reveal on scroll ────────────────────────────────────────────── */
  var toReveal = [].slice.call(document.querySelectorAll('.reveal'));
  if (!toReveal.length) { /* nothing */ }
  else if (reduced || !('IntersectionObserver' in window)) {
    toReveal.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    toReveal.forEach(function (el) { io.observe(el); });
  }

  /* ── fortune ─────────────────────────────────────────────────────── */
  var FORTUNES = [
    ['Whatever you do, enjoy it to the fullest. That is the secret of life.', 'Rider'],
    ['By learning and gaining experience, we gained the wisdom to achieve the unachievable.', 'Sora'],
    ['Remember the lesson, not the disappointment.', 'Holo the Wise Wolf'],
    ['No matter how hard or impossible it is, never lose sight of your goal.', 'Monkey D. Luffy']
  ];
  var fq = document.getElementById('fortune');
  function rollFortune() {
    if (!fq) return '';
    var f = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    fq.querySelector('p').textContent = f[0];
    fq.querySelector('cite').textContent = '— ' + f[1];
    return f[0] + ' — ' + f[1];
  }
  rollFortune();

  /* ── image modal ─────────────────────────────────────────────────── */
  (function () {
    var modal = document.getElementById('img-modal');
    var img = document.getElementById('img-modal-img');
    var caption = document.getElementById('img-modal-caption');
    var triggers = [].slice.call(document.querySelectorAll('.proj__zoom'));
    if (!modal || !img || !triggers.length) return;

    var lastFocus = null;

    function openModal(trigger) {
      lastFocus = document.activeElement;
      img.src = trigger.getAttribute('data-full') || trigger.querySelector('img').src;
      img.alt = trigger.querySelector('img') ? trigger.querySelector('img').alt : '';
      caption.textContent = trigger.getAttribute('data-caption') || img.alt;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      modal.querySelector('.imodal__close').focus();
    }
    function closeModal() {
      modal.hidden = true;
      img.src = '';
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    triggers.forEach(function (t) {
      t.addEventListener('click', function () { openModal(t); });
    });
    [].slice.call(modal.querySelectorAll('[data-imodal-close]')).forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); closeModal(); }
    });
  })();

  /* ── the floating terminal ───────────────────────────────────────
     A draggable window summoned by the FAB. Minimise keeps the session,
     close throws it away. Everything here is progressive enhancement:
     with JS off, neither the button nor the window ever appears.        */
  var fab   = document.getElementById('term-fab');
  var win   = document.getElementById('term-win');
  var bar   = document.getElementById('term-bar');
  var out   = document.getElementById('term-out');
  var input = document.getElementById('term-input');
  if (!fab || !win || !bar || !out || !input) return;

  var narrow = window.matchMedia('(max-width: 640px)');
  var EDGE = 8;
  var pos = null, greeted = false;

  try { pos = JSON.parse(read('term-pos') || 'null'); } catch (e) { pos = null; }

  function docked() { return narrow.matches; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function place(x, y) {
    if (docked()) { win.style.left = ''; win.style.top = ''; return; }
    var r = win.getBoundingClientRect();
    x = clamp(x, EDGE, Math.max(EDGE, window.innerWidth  - r.width  - EDGE));
    y = clamp(y, EDGE, Math.max(EDGE, window.innerHeight - r.height - EDGE));
    win.style.left = x + 'px';
    win.style.top  = y + 'px';
    pos = { x: x, y: y };
  }
  function savePos() {
    try { write('term-pos', pos ? JSON.stringify(pos) : ''); } catch (e) {}
  }
  /* belt-and-braces: if the window ever does change size, pull it back on screen */
  function keepInView() {
    if (win.hidden || docked()) return;
    var r = win.getBoundingClientRect();
    place(r.left, r.top);
  }

  function say(text, cls) {
    var p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = text;
    out.appendChild(p);
    out.scrollTop = out.scrollHeight;
  }

  function show() {
    win.hidden = false;
    fab.hidden = true;
    fab.setAttribute('aria-expanded', 'true');
    if (!greeted) { say('type `help` for the list of commands.', 'echo'); greeted = true; }
    if (docked()) { win.style.left = ''; win.style.top = ''; }
    else if (pos) { place(pos.x, pos.y); }
    else {
      var r = win.getBoundingClientRect();
      place(window.innerWidth - r.width - 24, window.innerHeight - r.height - 24);
    }
    input.focus();
  }
  function dismiss(reset) {
    win.hidden = true;
    fab.hidden = false;
    fab.setAttribute('aria-expanded', 'false');
    if (reset) { out.innerHTML = ''; greeted = false; pos = null; savePos(); }
    fab.focus();
  }

  fab.addEventListener('click', show);
  bar.querySelector('[data-act="min"]').addEventListener('click', function () { dismiss(false); });
  bar.querySelector('[data-act="close"]').addEventListener('click', function () { dismiss(true); });
  win.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.stopPropagation(); dismiss(false); }
  });

  /* drag by the title bar */
  var grab = null;
  bar.addEventListener('pointerdown', function (e) {
    if (docked() || e.target.closest('button')) return;
    var r = win.getBoundingClientRect();
    grab = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    win.classList.add('is-drag');
    try { bar.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  });
  bar.addEventListener('pointermove', function (e) {
    if (grab) place(e.clientX - grab.dx, e.clientY - grab.dy);
  });
  function drop(e) {
    if (!grab) return;
    grab = null;
    win.classList.remove('is-drag');
    try { bar.releasePointerCapture(e.pointerId); } catch (err) {}
    savePos();
  }
  bar.addEventListener('pointerup', drop);
  bar.addEventListener('pointercancel', drop);

  /* and by keyboard, so dragging is not mouse-only */
  bar.addEventListener('keydown', function (e) {
    if (docked()) return;
    var r = win.getBoundingClientRect(), step = e.shiftKey ? 24 : 6, moved = true;
    if (e.key === 'ArrowLeft')       place(r.left - step, r.top);
    else if (e.key === 'ArrowRight') place(r.left + step, r.top);
    else if (e.key === 'ArrowUp')    place(r.left, r.top - step);
    else if (e.key === 'ArrowDown')  place(r.left, r.top + step);
    else moved = false;
    if (moved) { e.preventDefault(); savePos(); }
  });

  /* keep it on screen when the viewport changes */
  window.addEventListener('resize', function () {
    if (win.hidden) return;
    if (docked()) { win.style.left = ''; win.style.top = ''; return; }
    var r = win.getBoundingClientRect();
    place(r.left, r.top);
  });

  /* ── commands ────────────────────────────────────────────────────── */
  var SITES = {
    linkedin: 'https://www.linkedin.com/in/harfialfaraby/',
    github: 'https://github.com/harfialpharaby',
    behance: 'https://www.behance.net/harfialfaraby',
    instagram: 'https://www.instagram.com/harfialfaraby/',
    facebook: 'https://web.facebook.com/harfialfaraby',
    mail: 'mailto:harfialpharaby@gmail.com'
  };
  var SECTIONS = ['about', 'work', 'projects', 'stack', 'education', 'contact'];
  var ALIASES  = { edu: 'education' };   // old anchor still works

  var HELP = [
    'whoami           who is this',
    'ls [work|stack]  list roles or skills',
    'cd <section>     jump to about | work | projects | stack | education | contact',
    'open <site>      linkedin | github | behance | instagram | facebook | mail',
    'theme [d|l]      toggle or set the colour theme',
    'fortune          roll a new quote',
    'clear            wipe this log',
    'exit             close the terminal'
  ];

  function run(line) {
    var parts = line.trim().split(/\s+/);
    var cmd = (parts[0] || '').toLowerCase();
    var arg = (parts[1] || '').toLowerCase();
    if (!cmd) return;

    switch (cmd) {
      case 'help': case '?':
        HELP.forEach(function (l) { say(l); }); break;

      case 'whoami':
        say('Ainur Harfi Alfaraby', 'ok');
        say('Frontend Web Developer @ Sekolahmu — Sidoarjo, East Java, Indonesia');
        say('6+ years of Vue.js, Nuxt.js, design systems and accessible interfaces.');
        break;

      case 'ls':
        if (arg === 'stack') {
          say('vue.js  nuxt.js  javascript  html  css  design-systems');
          say('api-design  server-logic  databases  google-gemini  ai-integration');
        } else {
          say('2020.03 → now      sekolahmu/                    Frontend Web Developer');
          say('2023.02 → 2023.08  perjalanan-menembus-galaksi/  Frontend Web Developer');
          say('2020.07 → 2021.02  abersoft-technologies/        Fullstack JS Developer');
          say('2017.11 → 2019.10  indodev-niaga-internet/       Implementor Consultant');
        }
        break;

      case 'cd':
        var dest = ALIASES[arg] || arg;
        if (SECTIONS.indexOf(dest) === -1) { say('cd: no such section: ' + (arg || '?'), 'err'); break; }
        say('→ /' + dest, 'ok');
        var t = document.getElementById(dest);
        if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        break;

      case 'open':
        if (!SITES[arg]) { say('open: unknown target: ' + (arg || '?'), 'err'); break; }
        say('opening ' + arg + '…', 'ok');
        window.open(SITES[arg], '_blank', 'noopener');
        break;

      case 'theme':
        var next = arg === 'd' || arg === 'dark' ? 'dark'
                 : arg === 'l' || arg === 'light' ? 'light'
                 : (current() === 'dark' ? 'light' : 'dark');
        setTheme(next);
        say('theme → ' + next, 'ok');
        break;

      case 'fortune': say(rollFortune()); break;

      case 'clear': out.innerHTML = ''; break;

      case 'sudo':
        say('nice try. ' + String.fromCharCode(9731), 'err'); break;

      case 'exit':
        say('bye.', 'ok');
        setTimeout(function () { dismiss(true); }, 260);
        break;

      default:
        say(cmd + ': command not found — try `help`', 'err');
    }
  }

  var history = [], hIdx = -1;

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var line = input.value;
      if (!line.trim()) return;
      say('$ ' + line, 'echo');
      history.push(line); hIdx = history.length;
      input.value = '';
      run(line);
      keepInView();
    } else if (e.key === 'ArrowUp') {
      if (!history.length) return;
      e.preventDefault();
      hIdx = Math.max(0, hIdx - 1);
      input.value = history[hIdx];
    } else if (e.key === 'ArrowDown') {
      if (!history.length) return;
      e.preventDefault();
      hIdx = Math.min(history.length, hIdx + 1);
      input.value = hIdx === history.length ? '' : history[hIdx];
    }
  });
})();
