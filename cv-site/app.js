// CV « bibliothèque » : ouverture des livres, sommaire, pages qui tournent
// et dessin de la bibliothèque du fond. Chargé en defer depuis index.html.
(function(){
  'use strict';

  var books = Array.prototype.slice.call(document.querySelectorAll('.book'));
  var viewer = document.getElementById('viewer');
  var openbook = document.getElementById('openbook');
  var backdrop = document.getElementById('backdrop');
  var leafL = document.getElementById('leafL');
  var leafR = document.getElementById('leafR');
  var closeBtn = document.getElementById('viewerClose');
  var statusEl = document.getElementById('status');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Éléments rendus inertes pendant la lecture d'un livre (fenêtre modale)
  var background = Array.prototype.slice.call(document.querySelectorAll('.skip-link, .plaque-wrap, #shelf, .lib-foot'));

  function setBackgroundInert(on){
    background.forEach(function(el){
      if (on) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
      else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
    });
  }

  // Icônes gravées de la page de gauche (tracés SVG 24×24)
  var ICONS = {
    profil:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    experience:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    competences:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m6 9 4 3-4 3"/><path d="M12 15h6"/>',
    formation:'<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    langues:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    permis:'<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><path d="M3 12h18"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5"/>',
    contact:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'
  };

  var RUBS = {
    profil:    { num:'I',   chap:'Chapitre I',    page:1, title:'Profil',         short:'Profil' },
    experience:{ num:'II',  chap:'Chapitre II',   page:2, title:'Parcours',       short:'Parcours' },
    competences:{num:'III', chap:'Chapitre III',  page:3, title:"Compétences techniques en cours d'acquisition", short:'Compétences' },
    formation: { num:'IV',  chap:'Chapitre IV',   page:4, title:'Formations',     short:'Formations' },
    langues:   { num:'V',   chap:'Chapitre V',    page:5, title:'Langues',        short:'Langues' },
    permis:    { num:'VI',  chap:'Chapitre VI',   page:6, title:'Permis & CACES', short:'Permis & CACES' },
    contact:   { num:'VII', chap:'Chapitre VII',  page:7, title:'Contact',        short:'Contact' }
  };
  var ORDER = Object.keys(RUBS);
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var flip = document.getElementById('flip');
  var narrow = window.matchMedia('(max-width: 640px)');
  var turning = false;
  var turnTimer = 0;

  var openRub = null;
  var lastBook = null;

  function bookFor(rub){
    return document.querySelector('.book[data-rub="' + rub + '"]');
  }

  // Page gauche : numéro, icône et sommaire cliquable
  function renderLeft(rub){
    var cfg = RUBS[rub];
    var toc = ORDER.map(function(id){
      var c = RUBS[id];
      return '<li><button type="button" class="toc-item" data-rub="' + id + '"' + (id === rub ? ' aria-current="true"' : '') + '>' +
        '<span class="toc-num">' + c.num + '</span><span class="toc-name">' + c.short + '</span>' +
        '<span class="toc-dots" aria-hidden="true"></span><span class="toc-page">' + c.page + '</span></button></li>';
    }).join('');
    leafL.innerHTML =
      '<div class="ll-inner">' +
        '<div class="ll-head" aria-hidden="true">' +
          '<span class="ll-seal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + ICONS[rub] + '</svg></span>' +
          '<span class="ll-titles"><span class="ll-num">' + cfg.num + '</span><span class="ll-label">' + cfg.short + '</span></span>' +
        '</div>' +
        '<span class="vs-ornament" aria-hidden="true"></span>' +
        '<nav class="toc" aria-label="Sommaire"><p class="toc-title">Sommaire</p><ol>' + toc + '</ol></nav>' +
        '<span class="ll-folio" aria-hidden="true">' + cfg.chap + ' · p. ' + cfg.page + '</span>' +
      '</div>';
  }

  // Page droite : copie de la rubrique (sans ses id, pour éviter les doublons dans la page)
  function renderRight(rub){
    leafR.innerHTML = document.getElementById('rub-' + rub).innerHTML;
    Array.prototype.forEach.call(leafR.querySelectorAll('[id]'), function(el){
      el.removeAttribute('id');
    });
    leafR.scrollTop = 0;
  }

  function setTurnButton(btn, rub){
    btn.hidden = !rub;
    if (!rub) return;
    btn.setAttribute('data-rub', rub);
    btn.querySelector('.turn-label').textContent = RUBS[rub].num + ' · ' + RUBS[rub].short;
  }

  // Ce qui suit le chapitre affiché : couleur du livre, livre allumé, boutons
  function applyChapter(rub){
    var cfg = RUBS[rub], btn = bookFor(rub), i = ORDER.indexOf(rub);
    openRub = rub;
    lastBook = btn;
    openbook.setAttribute('aria-label', 'Livre ouvert — ' + cfg.chap + ' : ' + cfg.title);

    // Le livre ouvert reprend la couleur du cuir du livre correspondant
    var spine = window.getComputedStyle(btn);
    openbook.style.setProperty('--cover', spine.getPropertyValue('--leath').trim());
    openbook.style.setProperty('--cover-hi', spine.getPropertyValue('--leath-hi').trim());

    books.forEach(function(b){
      b.classList.toggle('lit', b === btn);
    });
    setTurnButton(prevBtn, ORDER[i - 1]);
    setTurnButton(nextBtn, ORDER[i + 1]);
  }

  function openViewer(rub){
    applyChapter(rub);
    renderLeft(rub);
    renderRight(rub);
    statusEl.textContent = 'Livre ouvert : ' + RUBS[rub].title;

    viewer.hidden = false;
    setBackgroundInert(true);
    openbook.classList.remove('open', 'closing');
    void viewer.offsetWidth;
    viewer.classList.add('active');
    openbook.classList.add('open');
    leafR.focus({preventScroll:true});
  }

  // Tourner les pages jusqu'à un autre chapitre
  function turnTo(rub, fromToc){
    if (!openRub || turning || !RUBS[rub] || rub === openRub) return;
    var forward = ORDER.indexOf(rub) > ORDER.indexOf(openRub);
    applyChapter(rub);
    statusEl.textContent = RUBS[rub].chap + ' : ' + RUBS[rub].title;

    function finish(){
      turning = false;
      var active = document.activeElement;
      if (!openbook.contains(active) || active.hidden) {
        var target = fromToc ? leafL.querySelector('.toc-item[aria-current]') : null;
        (target || leafR).focus({preventScroll:true});
      }
    }

    // Mouvement réduit ou petit écran (une seule page) : simple glissement
    if (reduce || narrow.matches) {
      renderLeft(rub);
      renderRight(rub);
      if (!reduce) {
        leafR.classList.remove('swap-next', 'swap-prev');
        void leafR.offsetWidth;
        leafR.classList.add(forward ? 'swap-next' : 'swap-prev');
      }
      finish();
      return;
    }

    // La page qui tourne porte l'ancien contenu au recto ; le nouveau est déjà dessous
    turning = true;
    var oldPage = forward ? leafR : leafL;
    flip.innerHTML =
      '<div class="flip-face"><div class="' + (forward ? 'flip-r' : 'flip-l') + '" style="margin-top:' + (-oldPage.scrollTop) + 'px">' +
        oldPage.innerHTML + '</div></div><div class="flip-back"></div>';
    flip.className = 'flip ' + (forward ? 'flip-next' : 'flip-prev');
    if (forward) renderRight(rub); else renderLeft(rub);

    turnTimer = window.setTimeout(function(){
      if (forward) renderLeft(rub); else renderRight(rub);
      flip.className = 'flip';
      flip.innerHTML = '';
      finish();
    }, 700);
  }

  function closeViewer(){
    if (!openRub) return;
    openRub = null;
    // Interrompt une page en train de tourner
    window.clearTimeout(turnTimer);
    turning = false;
    flip.className = 'flip';
    flip.innerHTML = '';
    books.forEach(function(b){
      b.classList.remove('lit');
    });
    setBackgroundInert(false);
    statusEl.textContent = 'Livre refermé';
    openbook.classList.remove('open');
    openbook.classList.add('closing');
    viewer.classList.remove('active');
    window.setTimeout(function(){
      viewer.hidden = true;
      openbook.classList.remove('closing');
      if (lastBook) lastBook.focus();
    }, reduce ? 0 : 560);
  }

  books.forEach(function(btn){
    btn.addEventListener('click', function(){
      openViewer(btn.getAttribute('data-rub'));
    });
  });

  prevBtn.addEventListener('click', function(){ turnTo(prevBtn.getAttribute('data-rub')); });
  nextBtn.addEventListener('click', function(){ turnTo(nextBtn.getAttribute('data-rub')); });
  leafL.addEventListener('click', function(ev){
    var item = ev.target.closest('.toc-item');
    if (item) turnTo(item.getAttribute('data-rub'), true);
  });

  backdrop.addEventListener('click', closeViewer);
  closeBtn.addEventListener('click', closeViewer);

  openbook.addEventListener('click', function(ev){ ev.stopPropagation(); });
  leafR.addEventListener('click', function(ev){ ev.stopPropagation(); });

  document.addEventListener('keydown', function(ev){
    if (viewer.hidden) return;
    if (ev.key === 'Escape') { closeViewer(); return; }
    // Flèches gauche / droite : chapitre précédent / suivant
    if ((ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') && !ev.altKey && !ev.ctrlKey && !ev.metaKey) {
      var turnBtn = ev.key === 'ArrowRight' ? nextBtn : prevBtn;
      if (!turnBtn.hidden) { ev.preventDefault(); turnTo(turnBtn.getAttribute('data-rub')); }
      return;
    }
    // Garde le focus clavier à l'intérieur du livre ouvert
    if (ev.key === 'Tab') {
      var focusables = Array.prototype.slice.call(
        openbook.querySelectorAll('a[href], button, [tabindex="0"]')
      ).filter(function(el){
        return !el.hidden && el.offsetParent !== null; // ignore les boutons masqués (et la page gauche sur mobile)
      });
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      var inside = openbook.contains(document.activeElement);
      if (ev.shiftKey && (document.activeElement === first || !inside)) {
        ev.preventDefault(); last.focus();
      } else if (!ev.shiftKey && (document.activeElement === last || !inside)) {
        ev.preventDefault(); first.focus();
      }
    }
  });

  document.getElementById('pdfBtn').addEventListener('click', function(){ window.print(); });

  // --- Bibliothèques du fond : dessinées une seule fois dans un canvas ---
  var lib = document.querySelector('.lib');
  var bookcase = document.getElementById('bookcase');
  var bcx = bookcase.getContext && bookcase.getContext('2d');
  var LEATHERS = ['#4a1f23','#2f4659','#4a4a22','#5c2118','#3d2342','#2f4a2f','#4a3320','#6e3338',
                  '#5b3a2b','#233a3f','#5a4a2a','#3b2a1a','#702d24','#2b3550'];
  var drawnW = 0, drawnH = 0;

  // Générateur pseudo-aléatoire à graine fixe : la bibliothèque est toujours la même
  function seeded(seed){
    return function(){
      seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function shade(hex, f){
    var n = parseInt(hex.slice(1), 16);
    return 'rgb(' + Math.min(255, (n >> 16) * f | 0) + ',' + Math.min(255, (n >> 8 & 255) * f | 0) + ',' + Math.min(255, (n & 255) * f | 0) + ')';
  }
  function drawSpine(x, y, w, h, col, f, rand){
    var g = bcx.createLinearGradient(x, 0, x + w, 0);
    g.addColorStop(0, shade(col, f * .45));
    g.addColorStop(.35, shade(col, f * 1.2));
    g.addColorStop(.65, shade(col, f));
    g.addColorStop(1, shade(col, f * .4));
    bcx.fillStyle = g;
    bcx.fillRect(x, y, w, h);
    bcx.fillStyle = 'rgba(236,206,108,' + (.25 + rand() * .35).toFixed(2) + ')';
    bcx.fillRect(x + 1, y + h * (.07 + rand() * .05), w - 2, 1.5);
    bcx.fillRect(x + 1, y + h * (.86 + rand() * .05), w - 2, 1.5);
    if (rand() < .3) {                                  // étiquette de titre
      bcx.fillStyle = 'rgba(236,206,108,.16)';
      bcx.fillRect(x + w * .22, y + h * .3, w * .56, h * .22);
    }
  }
  function drawBookcase(){
    var W = lib.clientWidth, H = lib.clientHeight;
    if (Math.abs(W - drawnW) < 30 && Math.abs(H - drawnH) < 80) return;
    drawnW = W; drawnH = H;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    bookcase.width = Math.round(W * dpr);
    bookcase.height = Math.round(H * dpr);
    bcx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var rand = seeded(7);
    var rowH = Math.max(140, Math.min(190, H / 5));
    var sections = Math.max(2, Math.round(W / 300));
    var secW = W / sections, post = 16, plank = 12;

    for (var top = 16; top < H; top += rowH) {
      var floor = top + rowH - plank;
      var back = bcx.createLinearGradient(0, top, 0, floor);  // fond de la niche
      back.addColorStop(0, '#070301');
      back.addColorStop(.3, '#1b0f07');
      back.addColorStop(1, '#26160a');
      bcx.fillStyle = back;
      bcx.fillRect(0, top, W, rowH - plank);

      for (var s = 0; s < sections; s++) {
        var x = s * secW + post / 2 + 3, end = (s + 1) * secW - post / 2 - 3;
        while (x < end - 8) {
          var r = rand();
          if (r < .05) { x += 10 + rand() * 24; continue; }   // espace vide
          var w = 9 + rand() * 12, h = (rowH - plank - 16) * (.6 + rand() * .36);
          var col = LEATHERS[rand() * LEATHERS.length | 0], f = .75 + rand() * .45;
          if (r > .965 && x + w + h * .25 < end) {             // livre penché
            bcx.save();
            bcx.translate(x, floor);
            bcx.rotate(.2);
            drawSpine(0, -h, w, h, col, f, rand);
            bcx.restore();
            x += w + h * .2 + 1;
            continue;
          }
          if (x + w > end) break;
          drawSpine(x, floor - h, w, h, col, f, rand);
          x += w + (rand() < .3 ? 1 : 0);
        }
      }
      var shadow = bcx.createLinearGradient(0, top, 0, top + 42); // ombre de la planche du dessus
      shadow.addColorStop(0, 'rgba(0,0,0,.7)');
      shadow.addColorStop(1, 'rgba(0,0,0,0)');
      bcx.fillStyle = shadow;
      bcx.fillRect(0, top, W, 42);
      var board = bcx.createLinearGradient(0, floor, 0, floor + plank);
      board.addColorStop(0, '#7a5028');
      board.addColorStop(.25, '#4a2f16');
      board.addColorStop(1, '#1f1209');
      bcx.fillStyle = board;
      bcx.fillRect(0, floor, W, plank);
    }
    for (var p = 0; p <= sections; p++) {                       // montants verticaux
      var px = p * secW - post / 2, wood = bcx.createLinearGradient(px, 0, px + post, 0);
      wood.addColorStop(0, '#160c05');
      wood.addColorStop(.5, '#553719');
      wood.addColorStop(1, '#160c05');
      bcx.fillStyle = wood;
      bcx.fillRect(px, 0, post, H);
    }
    var dark = bcx.createRadialGradient(W / 2, H * .38, Math.min(W, H) * .2, W / 2, H * .38, Math.max(W, H) * .8);
    dark.addColorStop(0, 'rgba(0,0,0,0)');
    dark.addColorStop(1, 'rgba(0,0,0,.6)');
    bcx.fillStyle = dark;
    bcx.fillRect(0, 0, W, H);
    document.documentElement.classList.add('has-bookcase');
  }
  if (bcx) {
    // Dessin hors du chemin critique, puis seulement si la taille change vraiment
    (window.requestIdleCallback || function(cb){ return window.setTimeout(cb, 200); })(drawBookcase);
    var pending = 0;
    window.addEventListener('resize', function(){
      window.cancelAnimationFrame(pending);
      pending = window.requestAnimationFrame(drawBookcase);
    });
  }

  // --- Bougie : on la prend au clic maintenu (souris) ou à l'appui long (doigt),
  //     puis on la promène dans toute la pièce, halo compris ---
  var candle = document.querySelector('.candle');
  if (candle && window.PointerEvent) {
    var holding = null;          // déplacement en cours
    var press = null;            // appui long en attente (tactile)
    var flameBox = candle.querySelector('.flame-lean');
    var sway = { angle: 0, speed: 0, running: false };   // inclinaison de la flamme (ressort amorti)
    var gustTimer = 0;
    var lastMouse = null;
    var activeId = null;         // pointeur (souris ou doigt) qui tient la bougie

    function clampPosition(left, top){
      var maxLeft = lib.clientWidth - candle.offsetWidth;
      var maxTop = lib.clientHeight - candle.offsetHeight;
      return [Math.max(0, Math.min(maxLeft, left)), Math.max(20, Math.min(maxTop, top))];
    }
    // Petit ressort amorti : la flamme ploie sous une poussée, oscille puis se redresse
    function swayStep(){
      sway.speed += -0.05 * sway.angle - 0.09 * sway.speed;
      sway.angle = Math.max(-35, Math.min(35, sway.angle + sway.speed));
      if (Math.abs(sway.angle) < 0.05 && Math.abs(sway.speed) < 0.05) {
        sway.angle = sway.speed = 0;
        sway.running = false;
      }
      candle.style.setProperty('--lean', sway.angle.toFixed(1) + 'deg');
      if (sway.running) window.requestAnimationFrame(swayStep);
    }
    function pushFlame(impulse){
      if (reduce) return;                                // mouvement réduit : flamme immobile
      sway.speed = Math.max(-6, Math.min(6, sway.speed + impulse));
      if (!sway.running) { sway.running = true; window.requestAnimationFrame(swayStep); }
      // Un souffle un peu fort fait aussi vaciller la flamme
      if (Math.abs(impulse) > .6) {
        candle.classList.add('gust');
        window.clearTimeout(gustTimer);
        gustTimer = window.setTimeout(function(){ candle.classList.remove('gust'); }, 450);
      }
    }
    function pickUp(x, y){
      if (!candle.classList.contains('loose')) {
        // Première prise : la bougie quitte l'étagère pour être placée dans la pièce
        var zone = candle.offsetParent.getBoundingClientRect(), room = lib.getBoundingClientRect();
        candle.style.left = (zone.left - room.left + candle.offsetLeft) + 'px';
        candle.style.top = (zone.top - room.top + candle.offsetTop) + 'px';
        candle.classList.add('loose');
        lib.appendChild(candle);
        // Déplacer l'élément dans la page fait perdre la capture du pointeur : on la reprend
        try { candle.setPointerCapture(activeId); } catch (e) {}
      }
      holding = { x: x, y: y, left: candle.offsetLeft, top: candle.offsetTop, lastX: x, lastT: performance.now() };
      candle.classList.add('held');
      if (navigator.vibrate) navigator.vibrate(12);
    }
    function moveTo(x, y){
      var pos = clampPosition(holding.left + x - holding.x, holding.top + y - holding.y);
      candle.style.left = pos[0] + 'px';
      candle.style.top = pos[1] + 'px';
      // La bougie fend l'air : la flamme part à l'opposé du mouvement
      var now = performance.now(), speed = (x - holding.lastX) / Math.max(8, now - holding.lastT);
      pushFlame(-speed * 3);
      holding.lastX = x;
      holding.lastT = now;
    }
    function release(){
      if (press) window.clearTimeout(press.timer);
      press = null;
      activeId = null;
      candle.classList.remove('pressing');
      if (!holding) return;
      holding = null;
      candle.classList.remove('held');
    }

    // Souffle de la souris : en passant près de la flamme, la souris déplace l'air
    // et la flamme ploie dans le sens du mouvement, d'autant plus que la souris est proche et rapide
    window.addEventListener('pointermove', function(ev){
      if (ev.pointerType !== 'mouse' || holding) { lastMouse = null; return; }
      var now = performance.now();
      if (lastMouse && now - lastMouse.t < 100) {
        var box = flameBox.getBoundingClientRect();
        var dist = Math.hypot(ev.clientX - box.left, ev.clientY - (box.top - 10));
        var reach = 170;                                 // portée du souffle, en pixels
        if (dist < reach) {
          var vx = (ev.clientX - lastMouse.x) / Math.max(8, now - lastMouse.t);
          pushFlame(vx * 4.5 * (1 - dist / reach));
        }
      }
      lastMouse = { x: ev.clientX, y: ev.clientY, t: now };
    });

    candle.addEventListener('pointerdown', function(ev){
      if (ev.button !== 0 || activeId !== null) return;
      activeId = ev.pointerId;
      candle.setPointerCapture(ev.pointerId);
      if (ev.pointerType === 'mouse') {
        ev.preventDefault();
        pickUp(ev.clientX, ev.clientY);
        return;
      }
      // Doigt ou stylet : il faut maintenir l'appui un court instant
      candle.classList.add('pressing');
      press = { x: ev.clientX, y: ev.clientY };
      press.timer = window.setTimeout(function(){
        candle.classList.remove('pressing');
        if (press) pickUp(press.x, press.y);
        press = null;
      }, 400);
    });
    // Écoute sur toute la fenêtre : le pointeur peut quitter la bougie pendant le geste
    window.addEventListener('pointermove', function(ev){
      if (ev.pointerId !== activeId) return;
      if (holding) { moveTo(ev.clientX, ev.clientY); return; }
      if (press) {
        // Le doigt a bougé avant la fin de l'appui long : on annule
        if (Math.abs(ev.clientX - press.x) > 10 || Math.abs(ev.clientY - press.y) > 10) release();
        else { press.x = ev.clientX; press.y = ev.clientY; }
      }
    });
    ['pointerup', 'pointercancel'].forEach(function(type){
      window.addEventListener(type, function(ev){
        if (ev.pointerId === activeId) release();
      });
    });
    candle.addEventListener('contextmenu', function(ev){ ev.preventDefault(); });
    window.addEventListener('resize', function(){
      if (!candle.classList.contains('loose')) return;
      var pos = clampPosition(candle.offsetLeft, candle.offsetTop);
      candle.style.left = pos[0] + 'px';
      candle.style.top = pos[1] + 'px';
    });
  }

})();
