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
      var win = document.querySelector('.lib-window');                // la fenêtre (section 11) cache aussi des livres
      var covers = (lib.coverRects || []).concat(rectOf(lightSwitch), owl ? rectOf(owl) : [], win && !win.hidden ? rectOf(win) : [],
        Array.prototype.filter.call(document.querySelectorAll('.keepsake'), function(k){ return !k.hidden; }).map(rectOf));   // souvenirs (section 12)
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
      if (flame.closest('.candle').classList.contains('out')) radius = 0;    // bougie soufflée : noir complet
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
    'Touchez deux fois la bougie pour la souffler… et encore deux fois pour la rallumer.',
    'Sur la page Contact du livre, un tampon vous attend…',
    'Touchez-moi 5 fois de suite : un terminal secret s\u2019ouvrira…',
    "La pièce suit l'heure de votre horloge : rai de soleil le jour, lueur de la bougie la nuit.",
    "La pendule, en haut à droite, avance l'heure : aube, jour, soir, nuit… Un tour complet la remet à l'heure.",
    "Sur l'étagère, trois souvenirs du parcours de Hugo : l'haltère du coach sportif, le béret du militaire et le câble réseau de l'informatique.",
    'Je tiens un marque-page : à votre prochaine visite, je vous proposerai de reprendre au dernier chapitre lu.',
    'Touchez le bouton rond, sur la colonne de droite, pour entendre la bibliothèque : pages, bougie, hibou…',
    "Besoin d'un CV papier ? Touchez « Exporter en PDF », tout en bas."
  ] : [
    'Cliquez sur un livre pour lire mon CV.',
    'Maintenez le clic sur la bougie pour la prendre et la promener.',
    "Basculez l'interrupteur, à gauche : la bougie révèle des mots cachés…",
    'Dans un livre ouvert, les flèches ← → du clavier tournent les pages.',
    'Double-cliquez sur la bougie pour la souffler… et recommencez pour la rallumer.',
    'Sur la page Contact du livre, un tampon vous attend…',
    'Psst… tapez « sudo » au clavier, n\u2019importe où sur la page.',
    "La pièce suit l'heure de votre horloge : rai de soleil le jour, lueur de la bougie la nuit.",
    "La pendule, en haut à droite, avance l'heure : aube, jour, soir, nuit… Un tour complet la remet à l'heure.",
    "Sur l'étagère, trois souvenirs du parcours de Hugo : l'haltère du coach sportif, le béret du militaire et le câble réseau de l'informatique.",
    'Je tiens un marque-page : à votre prochaine visite, je vous proposerai de reprendre au dernier chapitre lu.',
    'Cliquez sur le bouton rond, sur la colonne de droite, pour entendre la bibliothèque : pages, bougie, hibou…',
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
    bubble.classList.remove('offer');                         // simple texte (voir le marque-page, idée 7)
    bubble.setAttribute('aria-hidden', 'true');
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
  // Un clic ailleurs ou Échap referme la bulle (le focus revient au hibou s'il était dans la bulle)
  window.addEventListener('pointerdown', function(ev){ if (!owl.contains(ev.target) && !bubble.contains(ev.target)) bubble.classList.remove('show'); });
  document.addEventListener('keydown', function(ev){
    if (ev.key !== 'Escape') return;
    if (bubble.contains(document.activeElement)) owl.focus();
    bubble.classList.remove('show');
  });

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
    var late = lib.getAttribute('data-heure') === 'nuit';      // voir l'idée 8
    say('Hou hou ! ' + (late ? 'Bonsoir, je' : 'Je') + ' suis le bibliothécaire. ' + (touchFirst ? 'Touchez-moi' : 'Cliquez sur moi') + ' pour une astuce.', false);
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

  // ===================== 4. Le mode terminal secret =====================
  // S'ouvre en tapant « sudo » (ou le code Konami) sur ordinateur, ou en touchant 5 fois le hibou.
  // Le contenu affiché est lu dans le CV de la page : il reste toujours à jour.
  var FILES = { 'profil.txt': 'profil', 'parcours.txt': 'experience', 'competences.txt': 'competences',
                'formations.txt': 'formation', 'langues.txt': 'langues', 'permis.txt': 'permis', 'contact.txt': 'contact' };
  var COMMANDS = ['help', 'ls', 'cat', 'whoami', 'neofetch', 'date', 'history', 'clear', 'exit'];
  var term = null, termOut, termInput, termHistory = [], historyPos = 0, termOpener = null;

  function clean(el){ return el.textContent.replace(/\s+/g, ' ').trim(); }

  // Une rubrique du CV mise en forme comme un fichier texte
  function fileText(id){
    var sec = document.getElementById('rub-' + id), title = clean(sec.querySelector('h2')).toUpperCase();
    var lines = [title, title.replace(/./g, '=')];
    Array.prototype.forEach.call(sec.querySelectorAll('.lead, .goal p, .sub-block, .chips, .kv, .contact-list'), function(el){
      if (el.matches('.sub-block')) {
        lines.push('', clean(el.querySelector('.block-date')) + ' — ' + clean(el.querySelector('.block-title')));
        var sub = el.querySelector('.block-sub');
        if (sub) lines.push('  ' + clean(sub));
        Array.prototype.forEach.call(el.querySelectorAll('li'), function(li){ lines.push('  • ' + clean(li)); });
      } else if (el.matches('.chips')) {
        lines.push('');
        Array.prototype.forEach.call(el.querySelectorAll('.chip'), function(c){ lines.push('• ' + clean(c)); });
      } else if (el.matches('.kv')) {
        lines.push('');
        Array.prototype.forEach.call(el.querySelectorAll('li'), function(li){
          lines.push((clean(li.querySelector('.k')) + '            ').slice(0, 12) + clean(li.querySelector('.v')));
        });
      } else if (el.matches('.contact-list')) {
        lines.push('');
        Array.prototype.forEach.call(el.querySelectorAll('li:not(.masked)'), function(li){
          var link = li.querySelector('a[href^="http"]');
          lines.push('• ' + (link ? link.href.replace(/^https?:\/\//, '') : clean(li)));
        });
      } else {
        lines.push('', clean(el));
      }
    });
    return lines.join('\n');
  }

  function print(text, cls){
    var line = document.createElement('div');
    line.className = 'term-line' + (cls ? ' ' + cls : '');
    line.textContent = text;
    termOut.appendChild(line);
    termOut.scrollTop = termOut.scrollHeight;
  }

  function run(raw){
    var input = raw.trim(), parts = input.split(/\s+/), cmd = parts[0].toLowerCase(), arg = parts.slice(1).join(' ');
    print('hugo@bibliotheque:~$ ' + raw, 'term-echo');
    if (!input) return;
    termHistory.push(input);
    historyPos = termHistory.length;
    if (cmd === 'help' || cmd === 'aide' || cmd === 'man') {
      print('Commandes disponibles :\n' +
        '  ls               liste les fichiers du CV\n' +
        '  cat <fichier>    affiche un fichier (ex. : cat profil.txt)\n' +
        '  whoami           qui suis-je ?\n' +
        '  neofetch         fiche technique\n' +
        '  date             date du jour\n' +
        '  history          commandes déjà tapées\n' +
        '  clear            efface l\'écran\n' +
        '  exit             retour à la bibliothèque (ou Échap)\n' +
        'Astuces : ↑ ↓ pour l\'historique, Tab pour compléter.');
    } else if (cmd === 'ls' || cmd === 'dir') {
      print(Object.keys(FILES).join('    '));
    } else if (cmd === 'cat' || cmd === 'more' || cmd === 'less') {
      var name = arg.replace(/^\.\//, '');
      if (!arg) print('cat : quel fichier ? (tapez ls pour la liste)', 'term-err');
      else if (!FILES[name] && FILES[name + '.txt']) print(fileText(FILES[name + '.txt']));
      else if (FILES[name]) print(fileText(FILES[name]));
      else print('cat : ' + arg + ' : fichier introuvable (tapez ls)', 'term-err');
    } else if (cmd === 'whoami') {
      print('hugo — ancien militaire et coach sportif, étudiant en BTS SIO SISR en alternance à Saint-Étienne,\nen route vers la cybersécurité.');
    } else if (cmd === 'neofetch') {
      print('   ,___,     hugo@bibliotheque\n' +
            '   (O,O)     -----------------\n' +
            '   /)  )     OS : BibliOS ' + new Date().getFullYear() + '\n' +
            '  --"-"--    Shell : cv-sh\n' +
            '             Uptime : 26 ans\n' +
            '             Formation : BTS SIO SISR (alternance)\n' +
            '             Objectif : cybersécurité\n' +
            '             Langues : français, anglais B2–C1');
    } else if (cmd === 'date') {
      print(new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    } else if (cmd === 'history') {
      print(termHistory.map(function(c, i){ return ('  ' + (i + 1)).slice(-3) + '  ' + c; }).join('\n'));
    } else if (cmd === 'clear' || cmd === 'cls') {
      termOut.textContent = '';
    } else if (cmd === 'exit' || cmd === 'quit' || cmd === 'logout') {
      closeTerminal();
    } else if (cmd === 'sudo') {
      print('[sudo] Bien essayé… Accès refusé : ce CV est en lecture seule.', 'term-err');
    } else if (cmd === 'rm') {
      print('rm : opération refusée — on ne supprime pas un CV aussi bien rangé.', 'term-err');
    } else if (cmd === 'cd') {
      print('cd : il n\'y a qu\'un dossier ici, et vous y êtes déjà.');
    } else {
      print(cmd + ' : commande introuvable (tapez help)', 'term-err');
    }
  }

  // Complétion avec Tab : commande, puis nom de fichier après « cat »
  function complete(){
    var value = termInput.value, m = value.match(/^(\s*cat\s+)(\S*)$/i);
    var pool = m ? Object.keys(FILES) : COMMANDS, start = m ? m[2] : value.trim();
    var hits = pool.filter(function(w){ return w.indexOf(start) === 0; });
    if (hits.length === 1) termInput.value = (m ? m[1] : '') + hits[0] + (m ? '' : ' ');
    else if (hits.length > 1) print(hits.join('    '));
  }

  function buildTerminal(){
    term = document.createElement('div');
    term.className = 'terminal';
    term.setAttribute('role', 'dialog');
    term.setAttribute('aria-modal', 'true');
    term.setAttribute('aria-label', 'Terminal secret');
    term.innerHTML =
      '<div class="term-bar"><span aria-hidden="true">hugo@bibliotheque — cv-sh</span>' +
        '<button type="button" class="term-close" aria-label="Fermer le terminal">×</button></div>' +
      '<div class="term-out" role="log" aria-live="polite"></div>' +
      '<form class="term-form"><label class="term-prompt" for="termInput">hugo@bibliotheque:~$</label>' +
        '<input id="termInput" class="term-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="send"></form>';
    termOut = term.querySelector('.term-out');
    termInput = term.querySelector('.term-input');
    term.querySelector('.term-form').addEventListener('submit', function(ev){
      ev.preventDefault();
      var value = termInput.value;
      termInput.value = '';
      run(value);
    });
    termInput.addEventListener('keydown', function(ev){
      if (ev.key === 'Tab' && !ev.shiftKey) { ev.preventDefault(); complete(); }
      else if (ev.key === 'ArrowUp' && historyPos > 0) { ev.preventDefault(); termInput.value = termHistory[--historyPos]; }
      else if (ev.key === 'ArrowDown') { ev.preventDefault(); historyPos = Math.min(termHistory.length, historyPos + 1); termInput.value = termHistory[historyPos] || ''; }
    });
    term.querySelector('.term-close').addEventListener('click', closeTerminal);
    term.addEventListener('keydown', function(ev){ if (ev.key === 'Escape') { ev.stopPropagation(); closeTerminal(); } });
    term.addEventListener('click', function(ev){ if (ev.target === term || ev.target === termOut) termInput.focus(); });
    document.body.appendChild(term);
    print('BibliOS ' + new Date().getFullYear() + ' — terminal de Hugo Largeron\n' +
          'Bienvenue, recruteur·se curieux·se ! Tapez help pour commencer, exit (ou Échap) pour revenir.\n');
  }

  function openTerminal(){
    if (term && !term.hidden) return;
    termOpener = document.activeElement;
    if (!term) buildTerminal();
    term.hidden = false;
    term.classList.remove('booting');
    void term.offsetWidth;
    if (!reduce) term.classList.add('booting');
    document.querySelector('main').inert = true;               // la bibliothèque est mise en pause
    termInput.focus();
    announce('Terminal ouvert. Tapez help pour la liste des commandes.');
  }
  function closeTerminal(){
    if (!term || term.hidden) return;
    term.hidden = true;
    document.querySelector('main').inert = false;
    if (termOpener && termOpener.focus) termOpener.focus();
    announce('Terminal fermé.');
  }

  // Déclencheurs : « sudo » ou code Konami au clavier (hors champ de saisie et livre fermé)…
  var typed = '', KONAMI = 'ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a', keys = [];
  document.addEventListener('keydown', function(ev){
    if (ev.ctrlKey || ev.metaKey || ev.altKey || (term && !term.hidden)) return;
    if (/^(input|textarea|select)$/i.test(ev.target.tagName) || !document.getElementById('viewer').hidden) return;
    keys = keys.concat(ev.key.length === 1 ? ev.key.toLowerCase() : ev.key).slice(-10);
    typed = (typed + (ev.key.length === 1 ? ev.key.toLowerCase() : ' ')).slice(-8);
    if (/sudo$/.test(typed) || keys.join(' ') === KONAMI) {
      ev.preventDefault();                                    // sinon la dernière lettre s'écrirait dans le terminal
      typed = '';
      keys = [];
      openTerminal();
    }
  });
  // …ou 5 touchers rapides sur le hibou
  var owlTaps = [];
  owl.addEventListener('click', function(){
    var now = Date.now();
    owlTaps = owlTaps.filter(function(t){ return now - t < 3000; }).concat(now);
    if (owlTaps.length >= 5) { owlTaps = []; openTerminal(); }
  });

  // ===================== 5. Souffler la bougie =====================
  // Double-clic (ou deux touchers rapides) sur la bougie : elle s'éteint dans un filet de fumée ;
  // recommencer la rallume. Un glissé (déplacement de la bougie) n'est pas compté comme un clic.
  var candleEl = document.querySelector('.candle');
  if (candleEl) {
    // On compare l'appui et le relâchement nous-mêmes : à la souris, la bougie est « prise en main »
    // dès l'appui et déplacée dans la page, si bien que le navigateur ne lui envoie pas de « click »
    var downAt = null, lastTap = 0;
    candleEl.addEventListener('pointerdown', function(ev){ downAt = { x: ev.clientX, y: ev.clientY, id: ev.pointerId }; });
    window.addEventListener('pointerup', function(ev){
      if (!downAt || ev.pointerId !== downAt.id) return;
      var moved = Math.hypot(ev.clientX - downAt.x, ev.clientY - downAt.y) > 8;
      downAt = null;
      if (moved) { lastTap = 0; return; }                       // un glissé n'est pas un clic
      var now = Date.now();
      if (now - lastTap < 400) { lastTap = 0; toggleCandle(); }
      else lastTap = now;
    });
  }

  function toggleCandle(){
    var out = !candleEl.classList.contains('out');
    candleEl.classList.toggle('out', out);
    candleEl.classList.remove('relit');
    if (out) {
      if (!reduce) puffOfSmoke();
      if (lib.classList.contains('lights-off')) {
        say('Hou ! Qui a soufflé la bougie ? Il fait tout noir… ' +
            (touchFirst ? 'Touchez-la deux fois' : 'Double-cliquez dessus') + ' pour la rallumer.', true);
      }
    } else if (!reduce) {
      void candleEl.offsetWidth;
      candleEl.classList.add('relit');                       // petit éclat, comme une allumette
      window.setTimeout(function(){ candleEl.classList.remove('relit'); }, 600);
    }
  }

  // Un filet de fumée qui monte en ondulant, puis disparaît
  function puffOfSmoke(){
    var smoke = document.createElement('span');
    smoke.className = 'smoke';
    smoke.setAttribute('aria-hidden', 'true');
    smoke.innerHTML = '<i></i><i></i><i></i><i></i><i></i>';
    candleEl.appendChild(smoke);
    window.setTimeout(function(){ if (smoke.parentNode) smoke.parentNode.removeChild(smoke); }, 3500);
  }

  // ===================== 6. Les livres vivants =====================
  // Les livres frémissent au survol (extras.css) et, de temps en temps, l'un d'eux bouge tout seul.
  // Un nuage de poussière s'échappe du livre quand on l'ouvre, et de l'étagère quand on le range.
  // Tout est décoratif (aria-hidden, sans pointeur) et coupé en mouvement réduit.
  var row = document.querySelector('.books-row');
  var openbookEl = document.querySelector('.openbook');
  var viewerEl = document.getElementById('viewer') || document.querySelector('.viewer');
  if (row && openbookEl && viewerEl && !reduce) {
    var shelfBooks = Array.prototype.slice.call(row.querySelectorAll('.book'));
    var litBook = null;

    // Un nuage de poussière : des grains partent d'une zone et s'envolent en ralentissant
    function dust(parent, x, y, w, h, count, spread){
      var cloud = document.createElement('span');
      cloud.className = 'dust';
      cloud.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < count; i++) {
        var grain = document.createElement('i');
        var gx = x + Math.random() * w, gy = y + Math.random() * h;
        var angle = -Math.PI / 2 + (Math.random() - .5) * spread;          // surtout vers le haut
        var dist = 30 + Math.random() * 70;
        grain.style.cssText = 'left:' + gx.toFixed(1) + 'px;top:' + gy.toFixed(1) + 'px;' +
          '--dx:' + (Math.cos(angle) * dist).toFixed(1) + 'px;--dy:' + (Math.sin(angle) * dist).toFixed(1) + 'px;' +
          '--s:' + (1.5 + Math.random() * 2.5).toFixed(1) + 'px;' +
          'animation-delay:' + Math.round(Math.random() * 260) + 'ms;animation-duration:' + Math.round(1300 + Math.random() * 900) + 'ms';
        cloud.appendChild(grain);
      }
      parent.appendChild(cloud);
      window.setTimeout(function(){ if (cloud.parentNode) cloud.parentNode.removeChild(cloud); }, 2700);
    }

    // On retient le livre allumé (celui qu'on a ouvert, ou le chapitre en cours)
    new MutationObserver(function(){
      litBook = row.querySelector('.book.lit') || litBook;
    }).observe(row, { subtree: true, attributes: true, attributeFilter: ['class'] });

    new MutationObserver(function(){
      var cls = openbookEl.classList;
      if (cls.contains('open') && !openbookEl.dataset.dusted) {
        // Ouverture : la poussière s'échappe du haut et du bas du livre quand la couverture se soulève
        openbookEl.dataset.dusted = '1';
        window.setTimeout(function(){
          if (!openbookEl.classList.contains('open')) return;
          var r = openbookEl.getBoundingClientRect();
          dust(viewerEl, r.left + r.width * .1, r.top - 6, r.width * .8, 12, 22, 1.8);
          dust(viewerEl, r.left + r.width * .15, r.bottom - 10, r.width * .7, 10, 14, 2.6);
        }, 320);
      } else if (cls.contains('closing') && openbookEl.dataset.dusted) {
        // Fermeture : le livre reprend sa place, un peu de poussière se soulève de l'étagère
        delete openbookEl.dataset.dusted;
        var book = litBook;
        window.setTimeout(function(){
          if (!book || openbookEl.classList.contains('open')) return;
          var b = book.getBoundingClientRect(), l = lib.getBoundingClientRect();
          dust(lib, b.left - l.left - 6, b.top - l.top - 4, b.width + 12, 8, 12, 2.2);
          dust(lib, b.left - l.left - 10, b.bottom - l.top - 6, b.width + 20, 6, 10, 2.8);
        }, 450);
      }
    }).observe(openbookEl, { attributes: true, attributeFilter: ['class'] });

    // De temps en temps, un livre frémit tout seul (jamais pendant la lecture ni sur un onglet caché)
    function shiverSoon(){
      window.setTimeout(function(){
        if (!document.hidden && viewerEl.hidden) {
          var free = shelfBooks.filter(function(b){ return !b.matches(':hover') && b !== document.activeElement; });
          var b = free[Math.floor(Math.random() * free.length)];
          if (b) {
            b.classList.add('shiver');
            b.addEventListener('animationend', function done(ev){
              if (ev.target !== b || ev.pseudoElement) return;
              b.classList.remove('shiver');
              b.removeEventListener('animationend', done);
            });
          }
        }
        shiverSoon();
      }, 9000 + Math.random() * 9000);
    }
    shiverSoon();
  }

  // ===================== 7. Le marque-page =====================
  // Le dernier chapitre lu est retenu dans le navigateur du visiteur (et nulle part ailleurs) :
  // un ruban dépasse du livre correspondant et, à la visite suivante, le hibou propose de reprendre
  // la lecture. La proposition est discrète : elle ne prend pas le focus et disparaît d'elle-même.
  var MARK_KEY = 'cv-marque-page', MARK_DAYS = 30;
  var markRow = document.querySelector('.books-row');
  if (markRow) {
    var ribbon = document.createElement('span');
    ribbon.className = 'shelf-ribbon';
    ribbon.setAttribute('aria-hidden', 'true');
    var ribbonNote = document.createElement('span');          // précisé aux lecteurs d'écran sur le livre marqué
    ribbonNote.className = 'sr-only';
    ribbonNote.id = 'marque-page-note';
    ribbonNote.textContent = 'Marque-page : dernier chapitre lu';
    lib.appendChild(ribbonNote);

    var readMark = function(){
      try {
        var mark = JSON.parse(window.localStorage.getItem(MARK_KEY) || 'null');
        if (mark && markRow.querySelector('.book[data-rub="' + mark.rub + '"]') &&
            Date.now() - mark.t < MARK_DAYS * 864e5) return mark;
        window.localStorage.removeItem(MARK_KEY);             // trop ancien ou invalide : on l'oublie
      } catch (e) { /* stockage indisponible : pas de marque-page */ }
      return null;
    };
    var placeRibbon = function(book){
      var old = markRow.querySelector('[aria-describedby="marque-page-note"]');
      if (old) old.removeAttribute('aria-describedby');
      book.appendChild(ribbon);
      book.setAttribute('aria-describedby', 'marque-page-note');
    };
    var chapterName = function(book){
      return 'chapitre ' + book.querySelector('.bnum').textContent + ', « ' + book.querySelector('.btitle').textContent + ' »';   // espaces insécables
    };

    // Chaque chapitre affiché devient le nouveau marque-page
    var lastMarked = null;
    new MutationObserver(function(){
      var book = markRow.querySelector('.book.lit');
      if (!book || book === lastMarked) return;
      lastMarked = book;
      placeRibbon(book);
      if (bubble.classList.contains('offer')) bubble.classList.remove('show');   // on lit déjà : proposition inutile
      try { window.localStorage.setItem(MARK_KEY, JSON.stringify({ rub: book.getAttribute('data-rub'), t: Date.now() })); }
      catch (e) { /* stockage indisponible : tant pis */ }
    }).observe(markRow, { subtree: true, attributes: true, attributeFilter: ['class'] });

    // Visite suivante : le ruban est déjà en place, et le hibou propose de reprendre
    var saved = readMark();
    if (saved) {
      var markedBook = markRow.querySelector('.book[data-rub="' + saved.rub + '"]');
      placeRibbon(markedBook);
      greeted = true;                                         // pas de présentation : il nous connaît déjà
      window.setTimeout(function(){
        if (!document.getElementById('viewer').hidden || document.querySelector('.terminal:not([hidden])')) return;
        offerToResume(markedBook);
      }, 1800);
    }
  }

  function offerToResume(book){
    var text = 'Hou hou ! Bon retour parmi nous. Vous lisiez le ' + chapterName(book) + '.';
    bubble.textContent = '';
    var p = document.createElement('p');
    p.className = 'offer-text';
    p.textContent = text;
    var yes = document.createElement('button'), no = document.createElement('button');
    yes.type = no.type = 'button';
    yes.className = 'offer-btn offer-yes';
    no.className = 'offer-btn';
    yes.textContent = 'Reprendre la lecture';
    no.textContent = 'Non merci';
    yes.addEventListener('click', function(){ bubble.classList.remove('show'); book.click(); });
    no.addEventListener('click', function(){ bubble.classList.remove('show'); owl.focus({ preventScroll: true }); });
    var actions = document.createElement('p');
    actions.className = 'offer-actions';
    actions.appendChild(yes);
    actions.appendChild(no);
    bubble.appendChild(p);
    bubble.appendChild(actions);
    bubble.classList.add('show', 'offer');
    bubble.removeAttribute('aria-hidden');
    placeBubble();
    announce(text + ' Le bouton « Reprendre la lecture » se trouve après le hibou.');
    window.clearTimeout(bubbleTimer);
    bubbleTimer = window.setTimeout(function(){
      if (!bubble.contains(document.activeElement)) bubble.classList.remove('show');
    }, 15000);
  }

  // ===================== 8. L'ambiance selon l'heure =====================
  // La pièce suit l'horloge du visiteur : le jour, un rai de soleil entre par une fenêtre (hors champ) ;
  // à l'aube et au soir, il est bas et orangé ; la nuit, la pièce s'assombrit et la bougie l'éclaire.
  // Ce calque reste sous la plaque et les livres : leurs contrastes ne changent pas.
  var ambiance = document.createElement('div');
  ambiance.className = 'ambiance';
  ambiance.setAttribute('aria-hidden', 'true');
  var beam = document.createElement('div');
  beam.className = 'sunbeam';
  for (var g = 0; g < 9; g++) {                             // poussière qui danse dans la lumière
    var speck = document.createElement('i');
    speck.style.cssText = 'left:' + (18 + Math.random() * 64).toFixed(0) + '%;top:' + (8 + Math.random() * 70).toFixed(0) + '%;' +
      'animation-delay:-' + (Math.random() * 12).toFixed(1) + 's';
    beam.appendChild(speck);
  }
  ambiance.appendChild(beam);
  lib.insertBefore(ambiance, document.querySelector('.plaque-wrap'));

  var clockHour = null;                                     // heure choisie sur la pendule (idée 10), sinon l'heure réelle
  function period(hour){
    if (hour >= 21 || hour < 6) return 'nuit';
    if (hour < 8) return 'aube';
    if (hour < 18) return 'jour';
    return 'soir';
  }
  function setPeriod(){
    var p = period(clockHour === null ? new Date().getHours() : clockHour);
    if (lib.getAttribute('data-heure') === p) return;
    lib.setAttribute('data-heure', p);
    nightGlow();
  }

  // La nuit, la lueur de la bougie perce l'ombre et la suit quand on la déplace
  var glowLoop = 0, candleBox = document.querySelector('.candle');
  function placeGlow(){
    var f = flame && flame.getBoundingClientRect(), room = lib.getBoundingClientRect();
    if (!f) return;
    ambiance.style.setProperty('--gx', Math.round(f.left - room.left) + 'px');
    ambiance.style.setProperty('--gy', Math.round(f.top - room.top - 8) + 'px');
  }
  function nightGlow(){
    window.cancelAnimationFrame(glowLoop);
    placeGlow();
    ambiance.classList.toggle('candle-out', !!candleBox && candleBox.classList.contains('out'));
    if (lib.getAttribute('data-heure') === 'nuit' && candleBox &&
        (candleBox.classList.contains('held') || candleBox.classList.contains('loose'))) {
      glowLoop = window.requestAnimationFrame(nightGlow);  // seulement pendant que la bougie bouge
    }
  }
  if (candleBox) new MutationObserver(nightGlow).observe(candleBox, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('resize', placeGlow);
  lib.addEventListener('bookcasedrawn', placeGlow);

  setPeriod();
  window.setInterval(setPeriod, 60000);                    // le soir tombe aussi pendant la visite

  // ===================== 9. Les sons discrets =====================
  // Coupés par défaut. Un bouton sur la colonne de droite les active (choix retenu dans le navigateur).
  // Tous les sons sont fabriqués à la volée avec la Web Audio API : aucun fichier à télécharger.
  // Le son ne démarre jamais sans un geste du visiteur (le navigateur l'exige aussi).
  var SOUND_KEY = 'cv-sons';
  var soundOn = false, actx = null, master = null, noiseBuf = null;
  try { soundOn = window.localStorage.getItem(SOUND_KEY) === '1'; } catch (e) { /* stockage indisponible */ }

  var soundSwitch = document.createElement('button');
  soundSwitch.type = 'button';
  soundSwitch.className = 'sound-switch';
  soundSwitch.setAttribute('aria-label', 'Sons de la bibliothèque');
  soundSwitch.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M4 9h4l5-4v14l-5-4H4Z" fill="currentColor"/>' +
      '<path class="snd-waves" d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
      '<path class="snd-mute" d="M16.5 9.5l5 5M21.5 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
    '</svg>';
  lib.appendChild(soundSwitch);
  function showSoundState(){
    soundSwitch.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    soundSwitch.title = soundOn ? 'Couper les sons' : 'Activer les sons';
    soundSwitch.classList.toggle('on', soundOn);
  }
  showSoundState();

  // Le contexte audio n'est créé qu'au premier geste du visiteur, et seulement si les sons sont activés
  function audio(){
    if (!soundOn) return null;
    if (!actx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      actx = new AC();
      master = actx.createGain();
      master.gain.value = .35;                              // discret
      master.connect(actx.destination);
      noiseBuf = actx.createBuffer(1, actx.sampleRate, actx.sampleRate);
      var data = noiseBuf.getChannelData(0);
      for (var i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  // Un souffle de bruit filtré (papier, souffle, grésillement)
  function noise(delay, dur, o){
    var c = audio(); if (!c) return;
    var t = c.currentTime + delay, src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = noiseBuf;
    f.type = o.type || 'bandpass';
    f.Q.value = o.q || 1;
    f.frequency.setValueAtTime(o.f0, t);
    if (o.f1) f.frequency.exponentialRampToValueAtTime(o.f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.gain, t + (o.attack || .005));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t, Math.random() * .5); src.stop(t + dur + .02);
  }
  // Une note qui glisse (hululement, choc sourd, carillon)
  function tone(delay, dur, o){
    var c = audio(); if (!c) return;
    var t = c.currentTime + delay, osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f0, t);
    if (o.f1) osc.frequency.exponentialRampToValueAtTime(o.f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.gain, t + (o.attack || .01));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + dur + .02);
  }
  var SOUNDS = {
    page: function(){ noise(0, .3, { f0: 1600, f1: 4200, q: .8, gain: .5, attack: .06 }); noise(.17, .16, { f0: 2600, f1: 1500, q: 1.2, gain: .25 }); },
    open: function(){ tone(0, .2, { f0: 110, f1: 55, gain: .7 }); SOUNDS.page(); },
    close: function(){ tone(0, .22, { f0: 95, f1: 50, gain: .8 }); noise(0, .1, { type: 'lowpass', f0: 700, gain: .4 }); },
    hoot: function(){
      tone(0, .3, { f0: 420, f1: 380, gain: .3, attack: .06 });
      tone(.4, .55, { f0: 410, f1: 340, gain: .3, attack: .08 });
    },
    crackle: function(){
      var n = 1 + Math.floor(Math.random() * 3);
      for (var i = 0; i < n; i++) noise(i * (.03 + Math.random() * .08), .015 + Math.random() * .02, { type: 'highpass', f0: 2400, gain: .1 + Math.random() * .15 });
    },
    blow: function(){ noise(0, .5, { type: 'lowpass', f0: 1100, f1: 260, gain: .45, attack: .08 }); },
    relight: function(){ noise(0, .18, { f0: 3200, f1: 1200, q: .7, gain: .5, attack: .01 }); SOUNDS.crackle(); },
    click: function(){ noise(0, .02, { type: 'highpass', f0: 3000, gain: .6 }); tone(0, .03, { f0: 1700, gain: .08 }); },
    stamp: function(){ tone(0, .14, { f0: 150, f1: 70, gain: .9 }); noise(0, .09, { type: 'lowpass', f0: 600, gain: .5 }); },
    hello: function(){ tone(0, .22, { f0: 660, gain: .12 }); tone(.12, .35, { f0: 990, gain: .1 }); }
  };
  function play(name){ if (soundOn) SOUNDS[name](); }

  soundSwitch.addEventListener('click', function(){
    soundOn = !soundOn;
    try { window.localStorage.setItem(SOUND_KEY, soundOn ? '1' : '0'); } catch (e) { /* tant pis */ }
    showSoundState();
    if (soundOn) play('hello');
    else if (actx) actx.suspend();
    announce(soundOn ? 'Sons activés.' : 'Sons coupés.');
  });

  // Les sons suivent ce qui se passe dans la page, sans rien modifier au reste du code
  var shelfRow = document.querySelector('.books-row'), bookEl = document.querySelector('.openbook');
  var soundLit = null;
  if (shelfRow) new MutationObserver(function(){
    var lit = shelfRow.querySelector('.book.lit');
    if (lit && soundLit && lit !== soundLit) play('page');     // on tourne les pages vers un autre chapitre
    soundLit = lit;
  }).observe(shelfRow, { subtree: true, attributes: true, attributeFilter: ['class'] });
  // (on compare l'état d'avant le premier changement à l'état final : une ouverture retire puis remet des classes)
  if (bookEl) new MutationObserver(function(records){
    var was = records[0].oldValue || '', now = bookEl.className;
    if (/\bopen\b/.test(now) && !/\bopen\b/.test(was)) play('open');
    if (/\bclosing\b/.test(now) && !/\bclosing\b/.test(was)) play('close');
  }).observe(bookEl, { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
  owl.addEventListener('click', function(){ play('hoot'); });
  if (flame) lightSwitch.addEventListener('click', function(){ play('click'); });
  document.addEventListener('click', function(ev){                // phase de capture : le livre ouvert
    if (ev.target.closest && ev.target.closest('.stamp-tool')) play('stamp');   // arrête la remontée des clics
  }, true);
  if (candleBox) new MutationObserver(function(records){
    var was = /\bout\b/.test(records[0].oldValue || ''), now = candleBox.classList.contains('out');
    if (now && !was) play('blow');
    if (!now && was) play('relight');
  }).observe(candleBox, { attributes: true, attributeFilter: ['class'], attributeOldValue: true });

  // La bougie crépite doucement de temps en temps (seulement sons activés, onglet visible, flamme allumée)
  (function crackleLater(){
    window.setTimeout(function(){
      if (soundOn && actx && actx.state === 'running' && !document.hidden && candleBox && !candleBox.classList.contains('out')) play('crackle');
      crackleLater();
    }, 2500 + Math.random() * 5000);
  })();

  // ===================== 10. La pendule =====================
  // En haut à droite, une petite pendule donne l'heure réelle du visiteur. Chaque clic l'avance
  // à la période suivante (aube, jour, soir, nuit) et l'ambiance (idée 8) suit ; le tour complet
  // la remet à l'heure. Rien n'est mémorisé : à chaque visite, elle est de nouveau à l'heure.
  var PERIODS = ['aube', 'jour', 'soir', 'nuit'];
  var PERIOD_HOUR = { aube: 7, jour: 12, soir: 19, nuit: 23 };
  var PERIOD_NAME = { aube: "l'aube", jour: 'le jour', soir: 'le soir', nuit: 'la nuit' };
  var clock = document.createElement('button');
  clock.type = 'button';
  clock.className = 'clock';
  var ticks = '';
  for (var k = 0; k < 12; k++) {
    ticks += '<line x1="20" y1="' + (k % 3 ? 7 : 6) + '" x2="20" y2="9" transform="rotate(' + k * 30 + ' 20 20)"/>';
  }
  clock.innerHTML =
    '<svg viewBox="0 0 40 58" aria-hidden="true" focusable="false">' +
      '<g class="clock-pendulum"><line x1="20" y1="34" x2="20" y2="50"/><circle cx="20" cy="51" r="4"/></g>' +
      '<circle class="clock-rim" cx="20" cy="20" r="18.5"/><circle class="clock-face" cx="20" cy="20" r="15.5"/>' +
      '<g class="clock-ticks">' + ticks + '</g>' +
      '<line class="clock-hour" x1="20" y1="21.5" x2="20" y2="11.5"/>' +
      '<line class="clock-minute" x1="20" y1="22.5" x2="20" y2="7.5"/>' +
      '<circle class="clock-pin" cx="20" cy="20" r="1.6"/>' +
    '</svg>';
  lib.appendChild(clock);
  SOUNDS.chime = function(){ tone(0, .9, { f0: 1047, gain: .12 }); tone(0, 1.1, { f0: 2094, gain: .04 }); };   // petit tintement
  var hourHand = clock.querySelector('.clock-hour'), minuteHand = clock.querySelector('.clock-minute');
  var shownMinutes = null;                                   // minutes depuis minuit, cumulées : les aiguilles avancent toujours

  function spoken(h, m){ return h + ' h' + (m ? ' ' + (m < 10 ? '0' : '') + m : ''); }
  function showTime(){
    var now = new Date();
    var h = clockHour === null ? now.getHours() : clockHour, m = clockHour === null ? now.getMinutes() : 0;
    var target = h * 60 + m;
    if (shownMinutes === null) shownMinutes = target;
    else shownMinutes += ((target - shownMinutes) % 1440 + 1440) % 1440;    // en avant, jamais à reculons
    hourHand.style.transform = 'rotate(' + (shownMinutes / 2) + 'deg)';      // 360° en 12 h
    minuteHand.style.transform = 'rotate(' + (shownMinutes * 6) + 'deg)';    // 360° en 1 h
    var label = 'Pendule : ' + spoken(h, m) + (clockHour === null ? ", l'heure réelle" : ', avancée') +
                ". Avancer l'heure pour changer l'ambiance";
    clock.setAttribute('aria-label', label);
    clock.title = clockHour === null ? "Avancer l'heure (ambiance)" : "Avancer l'heure : un tour complet la remet à l'heure";
    clock.classList.toggle('set', clockHour !== null);
    return { h: h, m: m };
  }

  clock.addEventListener('click', function(){
    var realPeriod = period(new Date().getHours());
    var next = PERIODS[(PERIODS.indexOf(lib.getAttribute('data-heure')) + 1) % PERIODS.length];
    clockHour = next === realPeriod ? null : PERIOD_HOUR[next];   // le tour complet ramène l'heure réelle
    setPeriod();
    play('chime');                                          // si les sons sont activés (idée 9)
    var t = showTime();
    announce(clockHour === null
      ? "Pendule remise à l'heure : " + spoken(t.h, t.m) + ", c'est " + PERIOD_NAME[realPeriod] + '.'
      : 'Pendule avancée à ' + spoken(t.h, 0) + ' : voici ' + PERIOD_NAME[next] + '.');
  });
  showTime();
  window.requestAnimationFrame(function(){ clock.classList.add('ready'); });   // pas d'animation au chargement
  window.setInterval(showTime, 30000);                     // à l'heure réelle, les aiguilles tournent

  // ===================== 11. La fenêtre =====================
  // Une haute fenêtre en arc, entre la colonne de gauche et la plaque : son ciel suit l'ambiance
  // (idée 8 et pendule) et le rai de soleil part d'elle. Masquée quand la place manque (téléphone).
  var STARS = [[18, 14], [72, 10], [40, 26], [84, 34], [12, 44], [58, 40], [30, 58], [78, 60], [48, 70], [20, 80], [66, 84], [88, 76]];
  var libWindow = document.createElement('div');
  libWindow.className = 'lib-window';
  libWindow.setAttribute('aria-hidden', 'true');
  libWindow.innerHTML =
    '<div class="win-glass">' +
      '<div class="win-sky sky-jour"><i class="cloud c1"></i><i class="cloud c2"></i></div>' +
      '<div class="win-sky sky-aube"><i class="sun-low"></i></div>' +
      '<div class="win-sky sky-soir"><i class="sun-low"></i></div>' +
      '<div class="win-sky sky-nuit"><i class="moon"></i>' +
        STARS.map(function(s, i){ return '<i class="star" style="left:' + s[0] + '%;top:' + s[1] + '%;animation-delay:-' + (i * .7).toFixed(1) + 's"></i>'; }).join('') +
      '</div>' +
      '<div class="win-bars"></div>' +
    '</div>' +
    '<div class="win-sill"></div>';
  lib.insertBefore(libWindow, document.querySelector('.plaque-wrap'));

  // Centrée dans l'espace libre entre la colonne et la plaque ; le rai de soleil part de la fenêtre
  function placeWindow(){
    var pillar = document.querySelector('.pillar-l'), plaque = document.querySelector('.plaque');
    if (!pillar || !plaque) return;
    var room = lib.getBoundingClientRect(), p = pillar.getBoundingClientRect(), q = plaque.getBoundingClientRect();
    var gap = q.left - p.right, w = Math.min(150, gap - 48);
    libWindow.hidden = w < 84;
    if (libWindow.hidden) { beam.style.left = beam.style.top = beam.style.width = ''; return; }
    var left = p.right - room.left + (gap - w) / 2, top = 34, h = Math.round(w * 1.55);
    libWindow.style.cssText = 'left:' + Math.round(left) + 'px;top:' + top + 'px;width:' + Math.round(w) + 'px;height:' + h + 'px';
    beam.style.left = Math.round(left - w * .2) + 'px';
    beam.style.top = Math.round(top + h * .35 - lib.clientHeight * .18) + 'px';
    beam.style.width = Math.round(w * 1.5) + 'px';
  }
  placeWindow();
  window.addEventListener('resize', placeWindow);
  lib.addEventListener('bookcasedrawn', placeWindow, true);   // avant les mots secrets, qui l'évitent
  if (lib.bookSpines) lib.dispatchEvent(new CustomEvent('bookcasedrawn'));

  // ===================== 12. Les souvenirs du parcours =====================
  // Trois objets posés sur l'étagère racontent le parcours avant même d'ouvrir un livre :
  // l'haltère du coach sportif, le béret du militaire (troupes de marine), le câble réseau de l'informatique.
  // Placés en JavaScript dans la place libre de l'étagère ; masqués s'il n'y en a pas (téléphone).
  var KEEPSAKES = [
    { cls: 'ks-beret', side: 'left', w: 70, h: 26, tag: 'Ancien militaire',
      svg: '<path d="M4 20Q6 6 36 5Q66 6 68 18Q60 23 36 23Q12 23 4 20Z" fill="url(#ksBeret)"/>' +
           '<path d="M7 20.5Q36 25.5 65 19" fill="none" stroke="#2a1a10" stroke-width="3" stroke-linecap="round"/>' +
           '<path d="M36 5l1.5-3" stroke="#14203a" stroke-width="2" stroke-linecap="round"/>' +
           '<circle cx="18" cy="14" r="5" fill="#d9b04a" stroke="#7a5a1e" stroke-width=".8"/>' +
           '<path d="M18 10.5v6.5M16 11.8h4M15.2 15.2q2.8 3.2 5.6 0" fill="none" stroke="#5d4412" stroke-width="1.1" stroke-linecap="round"/>' +
           '<defs><linearGradient id="ksBeret" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34497a"/><stop offset="1" stop-color="#16213d"/></linearGradient></defs>' },
    { cls: 'ks-dumbbell', side: 'left', w: 64, h: 26, tag: 'Coach sportif',
      svg: '<rect x="14" y="11" width="36" height="4" rx="1.5" fill="url(#ksBar)"/>' +
           '<path d="M26 11v4M29 11v4M32 11v4M35 11v4M38 11v4" stroke="#4d4d4d" stroke-width=".7"/>' +
           '<rect x="4" y="2" width="9" height="22" rx="2" fill="#2b2b2e"/><rect x="12" y="5" width="4" height="16" rx="1.5" fill="#3b3b40"/>' +
           '<rect x="51" y="2" width="9" height="22" rx="2" fill="#2b2b2e"/><rect x="48" y="5" width="4" height="16" rx="1.5" fill="#3b3b40"/>' +
           '<path d="M6 4h5M53 4h5" stroke="rgba(255,255,255,.25)" stroke-width="1.2" stroke-linecap="round"/>' +
           '<defs><linearGradient id="ksBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8d8d8"/><stop offset="1" stop-color="#7a7a7a"/></linearGradient></defs>' },
    { cls: 'ks-cable', side: 'right', w: 60, h: 36, tag: 'Informatique',
      svg: '<g fill="none" stroke="#2f7fd1" stroke-width="3"><ellipse cx="25" cy="25" rx="20" ry="9"/><ellipse cx="25" cy="23" rx="16" ry="7"/><ellipse cx="25" cy="21" rx="12" ry="5"/></g>' +
           '<path d="M41 19Q46 12 50 13" fill="none" stroke="#2f7fd1" stroke-width="3" stroke-linecap="round"/>' +
           '<rect x="48" y="8" width="10" height="9" rx="1.5" fill="rgba(225,238,255,.7)" stroke="#9fb3c8" stroke-width=".8"/>' +
           '<path d="M50 9.5v3M52 9.5v3M54 9.5v3M56 9.5v3" stroke="#d9b04a" stroke-width=".8"/>' }
  ];
  var shelfZone = document.querySelector('.shelf-zone');
  var keepsakes = shelfZone ? KEEPSAKES.map(function(k){
    var el = document.createElement('div');
    el.className = 'shelf-decor keepsake ' + k.cls;
    el.setAttribute('aria-hidden', 'true');
    el.style.width = k.w + 'px';
    el.style.height = k.h + 'px';
    el.innerHTML = '<svg viewBox="0 0 ' + k.w + ' ' + k.h + '" focusable="false">' + k.svg + '</svg><span class="keepsake-tag">' + k.tag + '</span>';
    el.hidden = true;
    shelfZone.appendChild(el);
    // Au doigt, un toucher montre l'étiquette quelques secondes
    var tagTimer = 0;
    el.addEventListener('pointerdown', function(ev){
      if (ev.pointerType === 'mouse') return;
      el.classList.add('tag-on');
      window.clearTimeout(tagTimer);
      tagTimer = window.setTimeout(function(){ el.classList.remove('tag-on'); }, 2500);
    });
    return { el: el, k: k };
  }) : [];

  // À gauche de la bougie : le béret contre la bougie, l'haltère avant lui ; à droite des livres couchés : le câble
  function placeKeepsakes(){
    var board = document.querySelector('.shelf-board'), home = document.querySelector('.candle-home') || document.querySelector('.candle');
    var stack = document.querySelector('.stack'), books = document.querySelectorAll('.books-row .book');
    if (!board || !home || !books.length) return;
    var z = shelfZone.getBoundingClientRect(), b = board.getBoundingClientRect(), hm = home.getBoundingClientRect();
    var rightEdge = stack && stack.offsetParent ? stack.getBoundingClientRect().right : books[books.length - 1].getBoundingClientRect().right;
    var x = { left: hm.left - 16, right: rightEdge + 18 };
    var limit = { left: b.left + 10, right: b.right - 10 };
    keepsakes.forEach(function(o){
      var k = o.k, start = k.side === 'left' ? x.left - k.w : x.right;
      var fits = k.side === 'left' ? start >= limit.left : start + k.w <= limit.right;
      o.el.hidden = !fits;
      if (!fits) return;
      o.el.style.left = Math.round(start - z.left) + 'px';
      if (k.side === 'left') x.left = start - 12; else x.right = start + k.w + 12;
    });
  }
  if (keepsakes.length) {
    placeKeepsakes();
    window.addEventListener('resize', placeKeepsakes);
    lib.addEventListener('bookcasedrawn', placeKeepsakes, true);  // avant les mots secrets, qui les évitent
    if (lib.bookSpines) lib.dispatchEvent(new CustomEvent('bookcasedrawn'));
  }
})();
