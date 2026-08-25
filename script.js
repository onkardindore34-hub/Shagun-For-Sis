/* ==============================================================
   APP LOGIC — you shouldn't need to edit this file.
   All personal details live in config.js
   ============================================================== */

(function(){

  const screens = {
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

  // ---------- HERO ----------
  document.getElementById('hero-name').innerHTML =
    `Hey <span class="highlight">${escapeHtml(CONFIG.recipientName || 'Sis')}</span> 👋`;

  document.getElementById('btn-start').addEventListener('click', () => {
    goTo('quiz');
    renderQuestion();
  });

  // ---------- QUIZ ----------
  const questions = CONFIG.questions || [];
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
      btn.addEventListener('click', () => handleAnswer(i, btn, optionsWrap));
      optionsWrap.appendChild(btn);
    });
  }

  function handleAnswer(choiceIndex, chosenBtn, wrap){
    // lock all options, highlight the chosen one
    [...wrap.children].forEach(b => b.disabled = true);
    chosenBtn.classList.add('chosen');

    const q = questions[qIndex];
    const reaction = (q.reactions && q.reactions[choiceIndex])
      ? q.reactions[choiceIndex]
      : pickRandom(["Noted 😄", "Good one!", "Love that for you"]);
    document.getElementById('q-feedback').textContent = reaction;

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
          <div class="amt">₹${CONFIG.amount}</div>
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
      document.getElementById('reveal-amount-num').textContent = CONFIG.amount;
      document.getElementById('reveal-message').textContent =
        CONFIG.revealMessage || "This one's yours — with all my love.";
      goTo('reveal');
      launchConfetti();
    }, 900);
  }

  // ---------- UPI CLAIM ----------
  document.getElementById('btn-claim').addEventListener('click', () => {
    const upiLink =
      `upi://pay?pa=${encodeURIComponent(CONFIG.upiId)}` +
      `&pn=${encodeURIComponent(CONFIG.payeeName || '')}` +
      `&am=${encodeURIComponent(CONFIG.amount)}` +
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
    const text = `${CONFIG.shareMessage || 'Check this out:'} ${CONFIG.siteUrl}`;
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

  // ---------- ambient falling petals on hero (decorative, cheap) ----------
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

})();
