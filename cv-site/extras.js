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
      var covers = (lib.coverRects || []).concat(rectOf(lightSwitch));
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
})();
