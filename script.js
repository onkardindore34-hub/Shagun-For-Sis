/* ==============================================================
   APP LOGIC — you shouldn't need to edit this file.
   All personal details live in config.js (or admin.html)
   ============================================================== */

(function(){

  // ---------- LOAD THE RIGHT PROFILE ----------
  // Supports ?to=<profileKey> in the URL for multi-brother setups.
  const active = rbGetActiveProfile();
  const PROFILE = active.profile || {};
  const NGO = active.ngo || { enabled: false };

  const screens = {
    welcome: document.getElementById('screen-welcome'),
    hero:   document.getElementById('screen-hero'),
    quiz:   document.getElementById('screen-quiz'),
    shagun: document.getElementById('screen-shagun'),
    reveal: document.getElementById('screen-reveal'),
  };

  function goTo(name){
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    window.scrollTo({top:0, behavior:'smooth'});
  }

  // ---------- WELCOME / BEST WISHES SCREEN ----------
  document.getElementById('welcome-name').textContent = PROFILE.recipientName || 'Sis';
  document.getElementById('welcome-amount').textContent = PROFILE.amount != null ? PROFILE.amount : 500;

  document.getElementById('btn-welcome-continue').addEventListener('click', () => {
    goTo('hero');
  });

  // ---------- HERO ----------
  document.getElementById('hero-name').innerHTML =
    `Hey <span class="highlight">${escapeHtml(PROFILE.recipientName || 'Sis')}</span> 👋`;

  document.getElementById('btn-start').addEventListener('click', () => {
    goTo('quiz');
    renderQuestion();
  });

  // ---------- QUIZ ----------
  const questions = PROFILE.questions || [];
  let qIndex = 0;

  document.getElementById('q-total').textContent = questions.length;

  function renderQuestion(){
    const q = questions[qIndex];
    document.getElementById('q-current').textContent = qIndex + 1;
    document.getElementById('progress-fill').style.width =
      `${(qIndex / questions.length) * 100}%`;

    document.getElementById('q-text').textContent = q.text;
    document.getElementById('q-feedback').textContent = '';

    const optionsWrap = document.getElementById('q-options');
    optionsWrap.innerHTML = '';

    q.options.forEach((optionText, i) => {
      const btn = document.createElement('button');
      btn.className = 'q-option';
      btn.type = 'button';
      btn.textContent = optionText;
      btn.addEventListener('click', (evt) => handleAnswer(i, btn, optionsWrap, evt));
      optionsWrap.appendChild(btn);
    });
  }

  function handleAnswer(choiceIndex, chosenBtn, wrap, clickEvent){
    // lock all options, highlight the chosen one
    [...wrap.children].forEach(b => b.disabled = true);
    chosenBtn.classList.add('chosen');

    const q = questions[qIndex];
    const reaction = (q.reactions && q.reactions[choiceIndex])
      ? q.reactions[choiceIndex]
      : pickRandom(["Noted 😄", "Good one!", "Love that for you"]);
    document.getElementById('q-feedback').textContent = reaction;

    const isLastQuestion = (qIndex === questions.length - 1);

    // Fire the WhatsApp completion alert on the LAST question, and do
    // it synchronously inside this click handler (not inside a
    // setTimeout) — mobile browsers only allow auto-opening a new tab
    // like WhatsApp if it happens directly inside a user's tap.
    if (isLastQuestion){
      notifyViaWhatsApp();
    }

    setTimeout(() => {
      qIndex++;
      if (qIndex < questions.length){
        renderQuestion();
      } else {
        document.getElementById('progress-fill').style.width = '100%';
        setTimeout(() => {
          goTo('shagun');
          renderCardGrid();
        }, 500);
      }
    }, 900);
  }

  // ---------- WHATSAPP COMPLETION ALERT ----------
  // There's no way for a plain website to silently message WhatsApp
  // in the background (that needs WhatsApp's paid Business API and a
  // server). The closest no-code equivalent: automatically open a
  // WhatsApp chat with the message already typed in, so all she has
  // to do is tap the existing Send button once.
  let notifySent = false;

  function buildWhatsAppLink(){
    const number = (PROFILE.notifyWhatsAppNumber || '').replace(/[^0-9]/g, '');
    if (!number) return null;
    const template = PROFILE.notifyMessage || "Hey! {{name}} just finished the Rakhi quiz — go ahead and send the Shagun! 💛";
    const message = template.replace(/{{\s*name\s*}}/gi, PROFILE.recipientName || 'Sis');
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function notifyViaWhatsApp(){
    if (notifySent) return;
    const link = buildWhatsAppLink();
    if (!link) return;

    const opened = window.open(link, '_blank');
    notifySent = true;

    // If the popup was blocked (common on desktop, some mobile
    // browsers), show a visible fallback button so nothing is lost.
    if (!opened){
      showNotifyFallback(link);
    } else {
      // Still show the fallback in case she navigates away before
      // actually hitting Send in the new tab.
      showNotifyFallback(link, true);
    }
  }

  function showNotifyFallback(link, alreadyOpened){
    const btn = document.getElementById('btn-notify-fallback');
    if (!btn) return;
    btn.hidden = false;
    if (alreadyOpened){
      btn.textContent = '🔔 Notification opened — tap here to resend';
    }
    btn.onclick = () => window.open(link, '_blank');
  }

  // ---------- SHAGUN CARD GAME (always wins) ----------
  const TOTAL_CARDS = 6;

  function renderCardGrid(){
    const grid = document.getElementById('card-grid');
    grid.innerHTML = '';

    for (let i = 0; i < TOTAL_CARDS; i++){
      const card = document.createElement('div');
      card.className = 'shagun-card';

      card.innerHTML = `
        <div class="card-face card-back"></div>
        <div class="card-face card-front">
          <div class="amt">₹${PROFILE.amount}</div>
          <div class="lbl">Shagun</div>
        </div>
      `;

      // NOTE: every card leads to the same winning reveal.
      // This is intentional — there's no losing outcome.
      card.addEventListener('click', () => onCardPicked(card, grid));

      grid.appendChild(card);
    }
  }

  function onCardPicked(chosenCard, grid){
    [...grid.children].forEach(c => {
      if (c !== chosenCard) c.classList.add('dim');
    });
    chosenCard.classList.add('flipped');
    launchConfetti();

    setTimeout(() => {
      document.getElementById('reveal-amount-num').textContent = PROFILE.amount;
      document.getElementById('reveal-message').textContent =
        PROFILE.revealMessage || "This one's yours — with all my love.";
      renderNgoBlock();
      goTo('reveal');
      launchConfetti();
    }, 900);
  }

  // ---------- NGO / DONATE-INSTEAD OPTION ----------
  function renderNgoBlock(){
    const block = document.getElementById('ngo-block');
    if (!NGO || !NGO.enabled || !NGO.url){
      block.hidden = true;
      return;
    }
    document.getElementById('ngo-message').textContent =
      NGO.message || "I know you don't want money directly, so I would request you to help others to whom it's more needed at this time.";
    const link = document.getElementById('btn-ngo');
    link.href = NGO.url;
    link.textContent = NGO.buttonText || `Donate to ${NGO.name || 'a cause'} instead 🤝`;
    block.hidden = false;
  }

  // ---------- UPI CLAIM ----------
  document.getElementById('btn-claim').addEventListener('click', () => {
    const upiLink =
      `upi://pay?pa=${encodeURIComponent(PROFILE.upiId)}` +
      `&pn=${encodeURIComponent(PROFILE.payeeName || '')}` +
      `&am=${encodeURIComponent(PROFILE.amount)}` +
      `&cu=INR` +
      `&tn=${encodeURIComponent('Shagun')}`;

    // On phones this opens the installed UPI app (GPay/PhonePe/Paytm).
    // On desktop browsers there's no UPI app to catch this, so we
    // just let the user know instead of silently failing.
    if (isMobile()){
      window.location.href = upiLink;
    } else {
      alert("Open this link on your phone to complete the payment via GPay / PhonePe / Paytm:\n\n" + upiLink);
    }
  });

  // ---------- SHARE (WhatsApp) ----------
  document.getElementById('btn-share').addEventListener('click', () => {
    const text = `${PROFILE.shareMessage || 'Check this out:'} ${PROFILE.siteUrl || window.location.href}`;
    const waLink = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waLink, '_blank');
  });

  // ---------- helpers ----------
  function isMobile(){
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  function pickRandom(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
  function escapeHtml(str){
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------- lightweight confetti (no external library) ----------
  function launchConfetti(){
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const colors = ['#eab04d', '#e5487e', '#f4d29b', '#fbf1e0'];
    const pieces = Array.from({length: 90}, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      r: 4 + Math.random() * 5,
      c: colors[Math.floor(Math.random() * colors.length)],
      vy: 2 + Math.random() * 3,
      vx: -1.5 + Math.random() * 3,
      rot: Math.random() * 360,
      vr: -6 + Math.random() * 12,
    }));

    let frame = 0;
    const maxFrames = 130;

    function tick(){
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r * 0.6);
        ctx.restore();
      });
      if (frame < maxFrames){
        requestAnimationFrame(tick);
      } else {
        canvas.remove();
      }
    }
    tick();
  }

  // ---------- ambient falling petals, everywhere (decorative, cheap) ----------
  (function petals(){
    const canvas = document.getElementById('petals');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    const count = window.innerWidth < 480 ? 14 : 24;
    const petalsArr = Array.from({length: count}, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 2 + Math.random() * 3,
      vy: 0.3 + Math.random() * 0.6,
      vx: -0.3 + Math.random() * 0.6,
      o: 0.15 + Math.random() * 0.35,
    }));

    function loop(){
      ctx.clearRect(0, 0, w, h);
      petalsArr.forEach(p => {
        p.y += p.vy; p.x += p.vx;
        if (p.y > h) { p.y = -10; p.x = Math.random() * w; }
        ctx.beginPath();
        ctx.fillStyle = `rgba(234,176,77,${p.o})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(loop);
    }
    loop();
  })();

  // ---------- festive floating rakhi/diya icons ("live wallpaper") ----------
  (function festiveIcons(){
    const wrap = document.getElementById('festive-icons');
    if (!wrap) return;
    const glyphs = ['🪢', '🎉', '🧵', '💛', '✨'];
    const count = window.innerWidth < 480 ? 8 : 14;

    for (let i = 0; i < count; i++){
      const span = document.createElement('span');
      span.className = 'festive-icon';
      span.textContent = glyphs[i % glyphs.length];
      span.style.left = `${Math.random() * 100}%`;
      span.style.setProperty('--drift', `${-40 + Math.random() * 80}px`);
      span.style.setProperty('--size', `${16 + Math.random() * 18}px`);
      span.style.animationDuration = `${14 + Math.random() * 12}s`;
      span.style.animationDelay = `${-Math.random() * 20}s`;
      wrap.appendChild(span);
    }
  })();

})();
