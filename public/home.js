/* Jurix Home — interactions: scroll reveal, counters, nav, downloads */
(function(){
  "use strict";

  /* ---- nav solidify on scroll ---- */
  var nav = document.querySelector('.nav');
  function onScroll(){ if(nav) nav.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ---- mobile menu ---- */
  var burger = document.querySelector('.burger');
  var mmenu = document.querySelector('.mmenu');
  if(burger && mmenu){
    burger.addEventListener('click', function(){ mmenu.classList.toggle('open'); });
    mmenu.addEventListener('click', function(e){ if(e.target.tagName==='A'||e.target===mmenu) mmenu.classList.remove('open'); });
  }

  /* ---- number counter ---- */
  function fmt(n, decimals, sep){
    if(decimals>0) return n.toFixed(decimals);
    var s = Math.round(n).toString();
    return sep ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s;
  }
  function runCounter(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-dec')||'0',10);
    var sep = el.getAttribute('data-sep')==='1';
    var prefix = el.getAttribute('data-prefix')||'';
    var suffix = el.getAttribute('data-suffix')||'';
    var dur = 1500, start = null;
    function tick(ts){
      if(start===null) start = ts;
      var p = Math.min((ts-start)/dur,1);
      var eased = 1 - Math.pow(1-p,3);
      el.textContent = prefix + fmt(target*eased, decimals, sep) + suffix;
      if(p<1) requestAnimationFrame(tick);
      else el.textContent = prefix + fmt(target, decimals, sep) + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* stagger groups: assign --i to children of [data-stagger] */
  document.querySelectorAll('[data-stagger]').forEach(function(group){
    Array.prototype.forEach.call(group.children, function(child, i){
      if(child.classList.contains('reveal')) child.style.setProperty('--i', i);
    });
  });

  /* ---- intersection reveal ---- */
  function activate(el){
    if(el.classList.contains('in')) return;
    el.classList.add('in');
    if(el.hasAttribute('data-count') && !el.__done){ el.__done=true; runCounter(el); }
    el.querySelectorAll && el.querySelectorAll('[data-count]').forEach(function(c){
      if(!c.__done){ c.__done=true; runCounter(c); }
    });
  }
  var targets = Array.prototype.slice.call(document.querySelectorAll('.reveal,[data-count],.steps-row'));
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ activate(en.target); io.unobserve(en.target); }
    });
  }, {threshold:0.05, rootMargin:'0px 0px -6% 0px'});
  targets.forEach(function(el){ io.observe(el); });

  /* immediate pass: reveal anything already in (or above) the viewport so
     above-the-fold content is never stuck hidden if the observer is slow */
  function initialPass(){
    var vh = window.innerHeight || 800;
    targets.forEach(function(el){
      if(el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if(r.top < vh*0.92){ activate(el); io.unobserve(el); }
    });
  }
  requestAnimationFrame(initialPass);
  window.addEventListener('load', initialPass);
  setTimeout(initialPass, 400);
  /* ---- consumers: marketplace category switcher ---- */
  var catBtns = document.querySelectorAll('[data-cat]');
  if(catBtns.length){
    catBtns.forEach(function(b){
      b.addEventListener('click', function(){
        var id = b.getAttribute('data-cat');
        catBtns.forEach(function(x){ x.classList.toggle('active', x===b); });
        document.querySelectorAll('[data-panel]').forEach(function(p){
          p.hidden = p.getAttribute('data-panel') !== id;
        });
      });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function(it){
    var q = it.querySelector('.faq-q');
    if(q) q.addEventListener('click', function(){
      it.classList.toggle('open');
    });
  });
})();
