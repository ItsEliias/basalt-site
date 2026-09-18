/* Basalt site — theme toggle, scroll reveals, and the drifting basalt-column
   motif. All decorative behaviour degrades safely: with JS off you get a
   fully readable static page, just without the motif and reveals. */
(function () {
  'use strict';

  // ── Theme toggle (init already ran inline in <head> to avoid a flash) ──
  var root = document.documentElement;
  function currentTheme() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  var btn = document.querySelector('.theme-toggle');
  if (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('basalt-theme', next); } catch (e) {}
    });
  }

  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Scroll reveals ──────────────────────────────────────────────────────
  var reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { obs.observe(el); });
  }

  // ── The film: autoplay muted only when motion is allowed; otherwise the
  //    poster + controls stand on their own (reduced-motion is respected). ──
  var film = document.getElementById('film');
  if (film && !reduced) {
    film.muted = true;
    film.setAttribute('autoplay', '');
    var tryPlay = function () { var p = film.play(); if (p && p.catch) p.catch(function () {}); };
    if ('IntersectionObserver' in window) {
      var fo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { tryPlay(); } else { film.pause(); } });
      }, { threshold: 0.35 });
      fo.observe(film);
    } else {
      tryPlay();
    }
  }

  // ── Basalt-column motif: a drifting field of hexagons (column cross-
  //    sections), built here so the markup stays clean. Masked in CSS. ─────
  var host = document.querySelector('.colonnade');
  if (host) {
    var W = 1600, H = 1500, r = 62;                 // canvas + hex radius
    var dx = Math.sqrt(3) * r, dy = 1.5 * r;         // pointy-top spacing
    var polys = '';
    for (var row = 0, y = -r; y < H + r; y += dy, row++) {
      var offset = (row % 2) ? dx / 2 : 0;
      for (var x = -r + offset; x < W + r; x += dx) {
        var pts = [];
        for (var k = 0; k < 6; k++) {
          var a = Math.PI / 180 * (60 * k - 90);     // pointy-top
          pts.push((x + r * Math.cos(a)).toFixed(1) + ',' + (y + r * Math.sin(a)).toFixed(1));
        }
        polys += '<polygon class="hx" points="' + pts.join(' ') + '"/>';
      }
    }
    var g = reduced ? polys : '<g class="drift">' + polys + '</g>';
    host.innerHTML =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMin slice" aria-hidden="true">' +
      g + '</svg>';
  }
})();
