// CV « bibliothèque » : petits plaisirs chargés après la page (voir extras.css).
// Rien ici n'est indispensable : le CV reste lisible et utilisable sans ce fichier.
(function(){
  'use strict';

  var lib = document.querySelector('.lib');
  var statusEl = document.getElementById('status');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!lib) return;

  function announce(text){ statusEl.textContent = text; }

  // ===================== 1. Explorer à la lueur de la bougie =====================
  // Un interrupteur éteint la pièce ; seul le halo de la bougie éclaire encore,
  // et révèle des titres écrits à l'encre secrète sur les étagères du fond.
  // Mots tirés du CV ; ceux qui ne trouvent pas de livre assez grand et visible ne s'affichent pas
  var SECRETS = [
    // compétences
    'Linux', 'Ubuntu', 'Windows', 'Bash', 'Python', 'C++', 'C#', 'TCP/IP', 'OSI', 'Réseaux',
    'Hack The Box', 'TryHackMe', 'Cybersécurité',
    // formations et diplômes
    'BTS SIO', 'SISR', 'CFAI', 'Alternance', 'STAPS', 'APAS', 'Haltérophilie', 'Jean Monnet',
    'BNSSA', 'PSE1', 'Sauvetage', 'Bac S', 'SVT',
    // expériences
    'CHU', 'Coach sportif', 'Bodysculpt', 'Aquabike', 'Natation', 'SEAM', 'ASPTT', 'Sport-étude',
    'Secouriste', 'BTP', 'Manutention', 'Transpalette', 'Infanterie', '21e RIMa', 'Fréjus',
    'Transmissions', "Chef d'équipe",
    // langues, permis et qualités
    'Anglais B2', 'Permis B', 'Permis A1', 'CACES 1A', 'Rigueur', "Esprit d'équipe", 'Pédagogie'
  ];
  var flame = document.querySelector('.flame-lean');
  if (flame) {
    var night = document.createElement('div');            // obscurité percée par le halo
    night.className = 'night';
    night.setAttribute('aria-hidden', 'true');
    var ink = document.createElement('div');              // encre secrète
    ink.className = 'secret-ink';
    ink.setAttribute('aria-hidden', 'true');
    SECRETS.forEach(function(text){
      var word = document.createElement('span');
      word.textContent = text;
      word.hidden = true;                                   // placé sur un livre par placeWords()
      ink.appendChild(word);
    });
    var lightSwitch = document.createElement('button');
    lightSwitch.type = 'button';
    lightSwitch.className = 'light-switch';
    lightSwitch.innerHTML = '<span class="lever" aria-hidden="true"></span>';
    lib.appendChild(ink);
    lib.appendChild(night);
    lib.appendChild(lightSwitch);

    var dark = false, loop = 0;
    function setLabel(){
      var label = dark ? 'Rallumer la lumière' : 'Éteindre la lumière';
      lightSwitch.setAttribute('aria-label', label);
      lightSwitch.title = label;
    }
    var words = Array.prototype.slice.call(ink.children);

    // Plus longue portion d'une tranche que rien ne cache (plaque, livres, colonnes…), de haut en bas
    function freeSegment(b, covers){
      var gaps = [[b.y + 4, b.y + b.h - 4]];
      covers.forEach(function(z){
        if (b.x >= z.r || b.x + b.w <= z.l) return;                   // ne passe pas devant ce livre
        gaps = gaps.reduce(function(out, g){
          if (z.b <= g[0] || z.t >= g[1]) return out.concat([g]);
          if (z.t > g[0]) out.push([g[0], z.t]);
          if (z.b < g[1]) out.push([z.b, g[1]]);
          return out;
        }, []);
      });
      return gaps.reduce(function(best, g){ return !best || g[1] - g[0] > best[1] - best[0] ? g : best; }, null);
    }

    // Chaque mot est écrit sur la tranche d'un livre du fond, dans une portion visible assez grande
    // pour le contenir ; les mots, du plus long au plus court, sont répartis le plus loin possible
    function placeWords(){
      var owl = document.querySelector('.owl');
      var covers = (lib.coverRects || []).concat(rectOf(lightSwitch), owl ? rectOf(owl) : []);
      var spines = (lib.bookSpines || []).filter(function(b){ return b.w >= 11; }).map(function(b){
        var seg = freeSegment(b, covers);
        return seg && { x: b.x + b.w / 2, top: seg[0], len: seg[1] - seg[0], size: Math.max(9, Math.min(13, b.w * .75)) };
      }).filter(Boolean);
      var chosen = [];
      words.slice().sort(function(a, b){ return b.textContent.length - a.textContent.length; }).forEach(function(word){
        var best = null, bestScore = -Infinity;
        spines.forEach(function(s){
          if (chosen.indexOf(s) !== -1) return;
          var need = word.textContent.length * s.size * .78 + 8;
          if (s.len < need) return;                                      // le mot doit tenir sur la partie visible
          var cy = s.top + s.len / 2;
          var score = chosen.length ? Math.min.apply(null, chosen.map(function(c){
            return Math.hypot(c.x - s.x, c.top + c.len / 2 - cy);
          })) : -(s.x + cy);
          if (score > bestScore) { best = s; bestScore = score; }
        });
        word.hidden = !best;                                // aucune place assez grande : le mot reste caché
        if (!best) return;
        chosen.push(best);
        word.style.left = Math.round(best.x) + 'px';
        word.style.top = Math.round(best.top + best.len / 2) + 'px';
        word.style.fontSize = best.size.toFixed(1) + 'px';
      });
    }
    function rectOf(el){
      var r = el.getBoundingClientRect(), room = lib.getBoundingClientRect();
      return { l: r.left - room.left - 4, t: r.top - room.top - 4, r: r.right - room.left + 4, b: r.bottom - room.top + 4 };
    }
    placeWords();
    lib.addEventListener('bookcasedrawn', placeWords);

    // Le halo suit la flamme à chaque image, qu'on déplace la bougie ou qu'elle revienne à sa place ;
    // chaque mot secret ne s'illumine que s'il est assez près de la flamme
    function follow(now){
      var room = lib.getBoundingClientRect(), f = flame.getBoundingClientRect();
      var lx = f.left - room.left, ly = f.top - room.top - 8;
      var radius = reduce ? 230 : 230 + Math.sin(now / 90) * 6 + Math.sin(now / 37) * 4;
      night.style.setProperty('--lx', Math.round(lx) + 'px');
      night.style.setProperty('--ly', Math.round(ly) + 'px');
      night.style.setProperty('--lr', radius.toFixed(1) + 'px');
      words.forEach(function(word){
        var d = Math.hypot(word.offsetLeft - lx, word.offsetTop - ly);
        word.style.opacity = Math.max(0, Math.min(1, (radius * .75 - d) / (radius * .4))).toFixed(2);
      });
      if (dark) loop = window.requestAnimationFrame(follow);
    }
    lightSwitch.addEventListener('click', function(){
      dark = !dark;
      lib.classList.toggle('lights-off', dark);
      setLabel();
      window.cancelAnimationFrame(loop);
      if (dark) {
        loop = window.requestAnimationFrame(follow);
        announce('Lumière éteinte : déplacez la bougie pour explorer la bibliothèque.');
      } else {
        announce('Lumière rallumée.');
      }
    });
    setLabel();
  }

  // ===================== 2. Le hibou bibliothécaire =====================
  // Perché sur la pile de livres (sur le livre « Contact » sur téléphone), il suit le pointeur
  // des yeux, cligne de temps en temps et donne une astuce quand on clique dessus.
  var touchFirst = window.matchMedia('(hover: none)').matches;
  // Téléphone tenu en portrait : seul cas où l'astuce « mode paysage » a un sens
  var portraitPhone = window.matchMedia('(max-width: 640px) and (orientation: portrait)');
  var LANDSCAPE_TIP = "Tournez votre téléphone en mode paysage : le livre s'ouvre alors sur deux pages, " +
                      'comme sur ordinateur, avec le sommaire à gauche pour aller directement à un chapitre.';
  var TIPS = touchFirst ? [
    'Touchez un livre pour lire mon CV.',
    LANDSCAPE_TIP,
    'Gardez le doigt sur la bougie pour la prendre et la promener.',
    "Basculez l'interrupteur, à gauche : la bougie révèle des mots cachés…",
    'Dans un livre ouvert, glissez le doigt à gauche ou à droite pour tourner les pages.',
    'Sur la page Contact du livre, un tampon vous attend…',
    "Besoin d'un CV papier ? Touchez « Exporter en PDF », tout en bas."
  ] : [
    'Cliquez sur un livre pour lire mon CV.',
    'Maintenez le clic sur la bougie pour la prendre et la promener.',
    "Basculez l'interrupteur, à gauche : la bougie révèle des mots cachés…",
    'Dans un livre ouvert, les flèches ← → du clavier tournent les pages.',
    'Sur la page Contact du livre, un tampon vous attend…',
    "Besoin d'un CV papier ? « Exporter en PDF », tout en bas."
  ];
  var OWL_SVG =
    '<svg viewBox="0 0 60 70" aria-hidden="true" focusable="false">' +
      '<g class="owl-body">' +
        '<path d="M13 16 17 2 25 12Z" fill="#553a20"/><path d="M47 16 43 2 35 12Z" fill="#553a20"/>' +
        '<ellipse cx="30" cy="40" rx="22" ry="26" fill="#6b4a2b"/>' +
        '<ellipse cx="30" cy="48" rx="13" ry="16" fill="#c9a77a"/>' +
        '<path d="M23 44q3.5 3 7 0q3.5 3 7 0M21 51q3 3 6 0q3 3 6 0q3 3 6 0M24 58q3 2.5 6 0q3 2.5 6 0" fill="none" stroke="#8a6a44" stroke-width="1.2"/>' +
        '<ellipse cx="10" cy="45" rx="6" ry="15" fill="#553a20" transform="rotate(12 10 45)"/>' +
        '<ellipse cx="50" cy="45" rx="6" ry="15" fill="#553a20" transform="rotate(-12 50 45)"/>' +
        '<circle cx="21" cy="25" r="10" fill="#e8d5b0"/><circle cx="39" cy="25" r="10" fill="#e8d5b0"/>' +
      '</g>' +
      '<circle class="owl-eye" cx="21" cy="25" r="6.5"/><circle class="owl-eye" cx="39" cy="25" r="6.5"/>' +
      '<g class="owl-pupil"><circle cx="21" cy="25" r="3.3"/><circle class="owl-shine" cx="22.2" cy="23.8" r="1"/></g>' +
      '<g class="owl-pupil"><circle cx="39" cy="25" r="3.3"/><circle class="owl-shine" cx="40.2" cy="23.8" r="1"/></g>' +
      '<rect class="owl-lid" x="14" y="18" width="14" height="14" rx="7"/><rect class="owl-lid" x="32" y="18" width="14" height="14" rx="7"/>' +
      '<path class="owl-beak" d="M27 31h6l-3 6Z" fill="#e0a43a"/>' +
      '<path class="owl-feet" d="M22 64l-2 4M25 64v5M28 64l2 4M32 64l-2 4M35 64v5M38 64l2 4" stroke="#e0a43a" stroke-width="2" stroke-linecap="round"/>' +
    '</svg>';

  var owl = document.createElement('button');
  owl.type = 'button';
  owl.className = 'owl';
  owl.setAttribute('aria-label', 'Hibou bibliothécaire : donner une astuce');
  owl.title = 'Hibou bibliothécaire';
  owl.innerHTML = OWL_SVG;
  var bubble = document.createElement('div');                 // bulle (le texte est aussi annoncé)
  bubble.className = 'owl-bubble';
  bubble.setAttribute('aria-hidden', 'true');
  lib.appendChild(owl);
  lib.appendChild(bubble);

  var eyes = owl.querySelectorAll('.owl-eye'), pupils = owl.querySelectorAll('.owl-pupil');
  var tipIndex = 0, bubbleTimer = 0, greeted = false, look = null, lookFrame = 0;

  // Perché sur la pile de livres couchés, ou sur le dernier livre quand la pile est masquée
  function perch(){
    var stack = document.querySelector('.stack'), books = document.querySelectorAll('.book');
    var base = stack && stack.offsetParent ? stack : books[books.length - 1];
    var r = base.getBoundingClientRect(), room = lib.getBoundingClientRect();
    owl.style.left = Math.round(r.left - room.left + r.width / 2 - owl.offsetWidth / 2) + 'px';
    owl.style.top = Math.round(r.top - room.top - owl.offsetHeight + 3) + 'px';
    if (bubble.classList.contains('show')) placeBubble();
  }
  function placeBubble(){
    var o = owl.getBoundingClientRect(), room = lib.getBoundingClientRect();
    var width = bubble.offsetWidth, cx = o.left - room.left + o.width / 2;
    var left = Math.max(8, Math.min(lib.clientWidth - width - 8, cx - width / 2));
    bubble.style.left = Math.round(left) + 'px';
    bubble.style.top = Math.round(o.top - room.top - bubble.offsetHeight - 12) + 'px';
    bubble.style.setProperty('--tail', Math.round(cx - left) + 'px');   // la pointe vise le hibou
  }
  function say(text, aloud){
    bubble.textContent = text;
    bubble.classList.add('show');
    placeBubble();
    if (aloud) announce(text);
    window.clearTimeout(bubbleTimer);
    bubbleTimer = window.setTimeout(function(){ bubble.classList.remove('show'); }, 7000);
  }

  // Un clic : il sautille, hulule et donne l'astuce suivante
  owl.addEventListener('click', function(){
    greeted = true;
    owl.classList.remove('hoot');
    void owl.offsetWidth;
    owl.classList.add('hoot');
    var tips = TIPS.filter(function(tip){ return tip !== LANDSCAPE_TIP || portraitPhone.matches; });
    tipIndex %= tips.length;
    say('Hou hou ! ' + tips[tipIndex], true);
    tipIndex = (tipIndex + 1) % tips.length;
  });
  // Un clic ailleurs ou Échap referme la bulle
  window.addEventListener('pointerdown', function(ev){ if (!owl.contains(ev.target)) bubble.classList.remove('show'); });
  document.addEventListener('keydown', function(ev){ if (ev.key === 'Escape') bubble.classList.remove('show'); });

  // Les yeux suivent la souris (ou le dernier endroit touché)
  function aimEyes(){
    lookFrame = 0;
    Array.prototype.forEach.call(eyes, function(eye, i){
      var r = eye.getBoundingClientRect(), dx = look.x - (r.left + r.width / 2), dy = look.y - (r.top + r.height / 2);
      var d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 120) * 2.6 / d;
      pupils[i].setAttribute('transform', 'translate(' + (dx * k).toFixed(2) + ' ' + (dy * k).toFixed(2) + ')');
    });
  }
  function watch(ev){
    look = { x: ev.clientX, y: ev.clientY };
    if (!lookFrame) lookFrame = window.requestAnimationFrame(aimEyes);
  }
  window.addEventListener('pointermove', watch);
  window.addEventListener('pointerdown', watch);

  // Un clignement de temps en temps
  function blink(){
    owl.classList.add('blink');
    window.setTimeout(function(){ owl.classList.remove('blink'); }, 140);
    window.setTimeout(blink, 2500 + Math.random() * 4000);
  }
  if (!reduce) window.setTimeout(blink, 3000);

  // Il se présente une fois, quelques secondes après l'arrivée (si personne ne l'a encore sollicité)
  window.setTimeout(function(){
    if (greeted || !document.getElementById('viewer').hidden) return;
    say('Hou hou ! Je suis le bibliothécaire. ' + (touchFirst ? 'Touchez-moi' : 'Cliquez sur moi') + ' pour une astuce.', false);
  }, 4000);

  // Toujours perché au bon endroit, avant que les mots secrets ne soient replacés (phase de capture)
  lib.addEventListener('bookcasedrawn', perch, true);
  perch();
  if (lib.bookSpines) lib.dispatchEvent(new CustomEvent('bookcasedrawn'));   // les mots évitent le hibou

  // ===================== 3. Le tampon « Bon pour un entretien » =====================
  // Sur la page Contact du livre ouvert : un tampon encreur à apposer d'un clic.
  // L'empreinte est mémorisée dans le navigateur du visiteur (simple confort, sans conséquence si indisponible).
  var leafR = document.getElementById('leafR');
  var STAMP_KEY = 'cv-tampon';
  var STAMP_TOOL =
    '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">' +
      '<circle cx="20" cy="9" r="6" fill="#7a5028"/><rect x="17" y="13" width="6" height="9" fill="#5a3a1c"/>' +
      '<rect x="8" y="21" width="24" height="9" rx="2" fill="#6b4422"/><rect x="9" y="30" width="22" height="4" rx="1" fill="#b3261e"/>' +
    '</svg>';

  function stampedBefore(){
    try { return window.localStorage.getItem(STAMP_KEY) === '1'; } catch (e) { return false; }
  }
  function rememberStamp(){
    try { window.localStorage.setItem(STAMP_KEY, '1'); } catch (e) { /* stockage indisponible : tant pis */ }
  }
  function makeMark(fresh){
    var mark = document.createElement('div');
    mark.className = 'stamp-mark' + (fresh && !reduce ? ' fresh' : '');
    mark.setAttribute('aria-hidden', 'true');
    mark.style.setProperty('--rot', (-3 - Math.random() * 7).toFixed(1) + 'deg');   // un peu de travers, jamais pareil
    mark.style.setProperty('--dx', (Math.random() * 24 - 12).toFixed(0) + 'px');
    // Daté de l'année en cours : en 2027, le tampon indiquera 2027
    mark.innerHTML = '<span>Bon pour</span><strong>un entretien</strong><small>H. Largeron · ' + new Date().getFullYear() + '</small>';
    return mark;
  }

  // Ajoute la zone du tampon chaque fois que la page Contact s'affiche dans le livre
  function addStampZone(){
    if (!leafR.querySelector('.contact-list') || leafR.querySelector('.stamp-zone')) return;
    var zone = document.createElement('div');
    zone.className = 'stamp-zone';
    zone.innerHTML =
      '<button type="button" class="stamp-tool">' + STAMP_TOOL + '<span>Apposer le tampon</span></button>' +
      '<div class="stamp-area"><span class="stamp-hint" aria-hidden="true">Réservé au recruteur</span></div>';
    var area = zone.querySelector('.stamp-area'), tool = zone.querySelector('.stamp-tool');
    tool.setAttribute('aria-label', 'Apposer le tampon « Bon pour un entretien »');
    if (stampedBefore()) area.insertBefore(makeMark(false), area.firstChild);   // avant l'indication, qu'il masque
    tool.addEventListener('click', function(){
      var old = area.querySelector('.stamp-mark');
      if (old) area.removeChild(old);
      area.insertBefore(makeMark(true), area.firstChild);
      tool.classList.remove('pressed');
      void tool.offsetWidth;
      tool.classList.add('pressed');
      if (!reduce) {                                          // la page tressaute sous le coup de tampon
        var page = leafR.parentNode;
        page.classList.remove('thump');
        void page.offsetWidth;
        page.classList.add('thump');
      }
      rememberStamp();
      announce('Tampon apposé : bon pour un entretien !');
    });
    leafR.appendChild(zone);
  }
  if (leafR && window.MutationObserver) {
    new MutationObserver(addStampZone).observe(leafR, { childList: true });
    addStampZone();
  }

  // Export PDF : le tampon est imprimé en bas de la colonne de gauche (mise en page dans print.css).
  // app.js crée les colonnes juste avant (son écouteur est enregistré en premier) et les retire après.
  window.addEventListener('beforeprint', function(){
    var side = document.querySelector('.print-side') || document.getElementById('cv-text');
    if (!side || side.querySelector('.print-stamp')) return;
    var holder = document.createElement('div');
    holder.className = 'print-stamp';
    holder.setAttribute('aria-hidden', 'true');
    var mark = makeMark(false);
    mark.style.setProperty('--rot', '-6deg');
    mark.style.setProperty('--dx', '0px');
    holder.appendChild(mark);
    side.appendChild(holder);
  });
  window.addEventListener('afterprint', function(){
    var holder = document.querySelector('.print-stamp');
    if (holder) holder.parentNode.removeChild(holder);
  });
})();
