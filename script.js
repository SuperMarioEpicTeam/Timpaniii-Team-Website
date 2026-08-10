(function () {
  'use strict';

  /* ==========================================================
     1) Désactivation du zoom / dézoom, sous toutes ses formes
     ========================================================== */
  // Pincement (Safari iOS déclenche des évènements "gesture*")
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (evt) {
    document.addEventListener(evt, function (e) { e.preventDefault(); }, { passive: false });
  });

  // Pincement à deux doigts sur navigateurs standards (Chrome Android, etc.)
  document.addEventListener('touchmove', function (e) {
    if (e.touches && e.touches.length > 1) e.preventDefault();
  }, { passive: false });

  // Double-tap zoom (sécurité en plus de touch-action: manipulation en CSS)
  var lastTouchEnd = 0;
  document.addEventListener('touchend', function (e) {
    var now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });

  // Ctrl/Cmd + molette (zoom navigateur desktop)
  document.addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.metaKey) e.preventDefault();
  }, { passive: false });

  // Raccourcis clavier Ctrl/Cmd + '+' / '-' / '=' / '0'
  document.addEventListener('keydown', function (e) {
    var key = e.key;
    if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].indexOf(key) !== -1) {
      e.preventDefault();
    }
  }, { passive: false });

  /* ==========================================================
     2) Interactions sur Timpani
     ========================================================== */
  var timpani   = document.getElementById('timpani');
  var wingLeft  = document.getElementById('wingLeft');
  var wingRight = document.getElementById('wingRight');
  var face      = document.getElementById('timpaniFace');
  var handRight = document.getElementById('handLeft');
  var mouth     = document.getElementById('timpaniMouth');

  // 4) Clic sur une barrette papillon -> battement d'ailes accéléré
  var flapTimeout = null;
  function speedUpWings() {
    wingLeft.classList.add('wing--fast');
    wingRight.classList.add('wing--fast');
    clearTimeout(flapTimeout);
    flapTimeout = setTimeout(function () {
      wingLeft.classList.remove('wing--fast');
      wingRight.classList.remove('wing--fast');
    }, 2200);
  }
  if (wingLeft)  wingLeft.addEventListener('click', speedUpWings);
  if (wingRight) wingRight.addEventListener('click', speedUpWings);

  // 5) Clic sur le visage -> salut de la main + bouche qui s'ouvre
  function waveHello() {
    if (handRight && !handRight.classList.contains('wave')) {
      handRight.classList.add('wave');
    }
    if (mouth && !mouth.classList.contains('talk')) {
      mouth.classList.add('talk');
    }
  }
  if (handRight) {
    handRight.addEventListener('animationend', function (e) {
      if (e.animationName === 'waveHand') handRight.classList.remove('wave');
    });
  }
  if (mouth) {
    mouth.addEventListener('animationend', function (e) {
      if (e.animationName === 'mouthTalk') mouth.classList.remove('talk');
    });
  }
  if (face) face.addEventListener('click', waveHello);

  /* ==========================================================
     3) Easter egg : petit sursaut aléatoire pendant l'attente
     ========================================================== */
  if (timpani) {
    timpani.addEventListener('animationend', function (e) {
      if (e.animationName === 'timpaniEgg') timpani.classList.remove('timpani--egg');
    });

    function maybeTriggerEasterEgg() {
      if (!timpani.classList.contains('timpani--egg') && Math.random() < 0.35) {
        timpani.classList.add('timpani--egg');
      }
      var next = 14000 + Math.random() * 18000; // entre 14s et 32s
      setTimeout(maybeTriggerEasterEgg, next);
    }
    setTimeout(maybeTriggerEasterEgg, 12000 + Math.random() * 8000);
  }
})();
