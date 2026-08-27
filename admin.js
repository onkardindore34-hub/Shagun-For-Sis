/* ==============================================================
   ADMIN DASHBOARD LOGIC
   Reads/writes via the shared helpers in data.js.
   ============================================================== */

(function () {

  // ---------- STATE ----------
  let data = rbGetEffectiveData();       // { adminPassword, ngo, profiles }
  let overrides = rbLoadOverrides();     // raw saved overrides (what we write back)
  let currentProfileKey = Object.keys(data.profiles)[0] || 'default';
  let currentQuestions = [];             // working copy while editing a profile
  let qIdCounter = 0;

  const els = {
    loginScreen: document.getElementById('admin-login'),
    dashboard: document.getElementById('admin-dashboard'),
    loginPassword: document.getElementById('login-password'),
    loginError: document.getElementById('login-error'),
    btnLogin: document.getElementById('btn-login'),
    btnLogout: document.getElementById('btn-logout'),

    adminPassword: document.getElementById('field-admin-password'),
    ngoEnabled: document.getElementById('field-ngo-enabled'),
    ngoName: document.getElementById('field-ngo-name'),
    ngoMessage: document.getElementById('field-ngo-message'),
    ngoUrl: document.getElementById('field-ngo-url'),
    ngoButton: document.getElementById('field-ngo-button'),
    btnSaveGlobal: document.getElementById('btn-save-global'),
    saveGlobalConfirm: document.getElementById('save-global-confirm'),

    profileSelect: document.getElementById('profile-select'),
    btnNewProfile: document.getElementById('btn-new-profile'),
    btnDeleteProfile: document.getElementById('btn-delete-profile'),
    profileLinkHelp: document.getElementById('profile-link-help'),

    recipientName: document.getElementById('field-recipient-name'),
    revealMessage: document.getElementById('field-reveal-message'),
    upiId: document.getElementById('field-upi-id'),
    payeeName: document.getElementById('field-payee-name'),
    amount: document.getElementById('field-amount'),
    whatsapp: document.getElementById('field-whatsapp'),
    notifyMessage: document.getElementById('field-notify-message'),
    siteUrl: document.getElementById('field-site-url'),
    shareMessage: document.getElementById('field-share-message'),
    btnSaveProfile: document.getElementById('btn-save-profile'),
    btnPreviewProfile: document.getElementById('btn-preview-profile'),
    saveProfileConfirm: document.getElementById('save-profile-confirm'),

    questionsList: document.getElementById('questions-list'),
    btnAddQuestion: document.getElementById('btn-add-question'),

    btnExport: document.getElementById('btn-export'),
  };

  // ---------- LOGIN ----------
  function attemptLogin() {
    const entered = els.loginPassword.value;
    if (entered && entered === data.adminPassword) {
      sessionStorage.setItem('rb_admin_logged_in', '1');
      showDashboard();
    } else {
      els.loginError.hidden = false;
    }
  }

  els.btnLogin.addEventListener('click', attemptLogin);
  els.loginPassword.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptLogin();
  });

  els.btnLogout.addEventListener('click', () => {
    sessionStorage.removeItem('rb_admin_logged_in');
    location.reload();
  });

  function showDashboard() {
    els.loginScreen.hidden = true;
    els.dashboard.hidden = false;
    refreshEverything();
  }

  if (sessionStorage.getItem('rb_admin_logged_in') === '1') {
    showDashboard();
  }

  // ---------- GLOBAL SETTINGS ----------
  function loadGlobalIntoForm() {
    els.adminPassword.value = data.adminPassword || '';
    const ngo = data.ngo || {};
    els.ngoEnabled.checked = !!ngo.enabled;
    els.ngoName.value = ngo.name || '';
    els.ngoMessage.value = ngo.message || '';
    els.ngoUrl.value = ngo.url || '';
    els.ngoButton.value = ngo.buttonText || '';
  }

  els.btnSaveGlobal.addEventListener('click', () => {
    overrides.adminPassword = els.adminPassword.value || data.adminPassword;
    overrides.ngo = {
      enabled: els.ngoEnabled.checked,
      name: els.ngoName.value.trim(),
      message: els.ngoMessage.value.trim(),
      url: els.ngoUrl.value.trim(),
      buttonText: els.ngoButton.value.trim(),
    };
    persist();
    flashConfirm(els.saveGlobalConfirm);
  });

  // ---------- PROFILE PICKER ----------
  function populateProfileSelect() {
    els.profileSelect.innerHTML = '';
    Object.keys(data.profiles).forEach((key) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = `${key}${data.profiles[key].recipientName ? ' — ' + data.profiles[key].recipientName : ''}`;
      els.profileSelect.appendChild(opt);
    });
    els.profileSelect.value = currentProfileKey;
    updateProfileLinkHelp();
  }

  function updateProfileLinkHelp() {
    const url = new URL(window.location.href);
    url.pathname = url.pathname.replace(/admin\.html$/, 'index.html');
    url.search = currentProfileKey === 'default' ? '' : `?to=${encodeURIComponent(currentProfileKey)}`;
    els.profileLinkHelp.textContent = `Link for this profile: ${url.toString()}`;
  }

  els.profileSelect.addEventListener('change', () => {
    currentProfileKey = els.profileSelect.value;
    loadProfileIntoForm(currentProfileKey);
    updateProfileLinkHelp();
  });

  els.btnNewProfile.addEventListener('click', () => {
    const suggested = prompt("Short ID for this profile (no spaces — e.g. 'raj' or 'amit'):");
    if (!suggested) return;
    const key = suggested.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    if (!key) return;
    if (data.profiles[key]) {
      alert('That ID is already used. Pick another.');
      return;
    }
    const name = prompt("Recipient's name for this profile:", 'Sis') || 'Sis';
    const newProfile = {
      recipientName: name,
      revealMessage: "This one's yours — with all my love.",
      upiId: 'your-upi-id@bank',
      payeeName: 'Your Name',
      amount: 500,
      notifyWhatsAppNumber: '',
      notifyMessage: "Hey! 🎉 {{name}} just finished the Rakhi quiz — go ahead and send the Shagun! 💛",
      siteUrl: '',
      shareMessage: 'I made something just for you 💛 Open this:',
      questions: [
        { text: 'What\'s my favourite way to spend a weekend?', options: ['Sleeping in', 'Outdoors', 'Something else'] },
      ],
    };
    data.profiles[key] = newProfile;
    overrides.profiles[key] = newProfile;
    overrides.deletedProfiles = (overrides.deletedProfiles || []).filter((k) => k !== key);
    persist();
    currentProfileKey = key;
    populateProfileSelect();
    loadProfileIntoForm(key);
  });

  els.btnDeleteProfile.addEventListener('click', () => {
    if (Object.keys(data.profiles).length <= 1) {
      alert("You need at least one profile — can't delete the last one.");
      return;
    }
    if (!confirm(`Delete the profile "${currentProfileKey}"? This can't be undone here (though it's still on config.js until you re-export).`)) return;
    delete data.profiles[currentProfileKey];
    delete overrides.profiles[currentProfileKey];
    overrides.deletedProfiles = overrides.deletedProfiles || [];
    if (!overrides.deletedProfiles.includes(currentProfileKey)) {
      overrides.deletedProfiles.push(currentProfileKey);
    }
    persist();
    currentProfileKey = Object.keys(data.profiles)[0];
    populateProfileSelect();
    loadProfileIntoForm(currentProfileKey);
  });

  // ---------- PROFILE DETAILS ----------
  function loadProfileIntoForm(key) {
    const p = data.profiles[key] || {};
    els.recipientName.value = p.recipientName || '';
    els.revealMessage.value = p.revealMessage || '';
    els.upiId.value = p.upiId || '';
    els.payeeName.value = p.payeeName || '';
    els.amount.value = p.amount != null ? p.amount : 500;
    els.whatsapp.value = p.notifyWhatsAppNumber || '';
    els.notifyMessage.value = p.notifyMessage || "Hey! 🎉 {{name}} just finished the Rakhi quiz — go ahead and send the Shagun! 💛";
    els.siteUrl.value = p.siteUrl || '';
    els.shareMessage.value = p.shareMessage || '';

    currentQuestions = JSON.parse(JSON.stringify(p.questions || []));
    renderQuestionsEditor();

    const previewUrl = new URL(window.location.href);
    previewUrl.pathname = previewUrl.pathname.replace(/admin\.html$/, 'index.html');
    previewUrl.search = key === 'default' ? '' : `?to=${encodeURIComponent(key)}`;
    els.btnPreviewProfile.href = previewUrl.toString();
  }

  function collectProfileFromForm() {
    return {
      recipientName: els.recipientName.value.trim() || 'Sis',
      revealMessage: els.revealMessage.value.trim(),
      upiId: els.upiId.value.trim(),
      payeeName: els.payeeName.value.trim(),
      amount: Number(els.amount.value) || 0,
      notifyWhatsAppNumber: els.whatsapp.value.replace(/[^0-9]/g, ''),
      notifyMessage: els.notifyMessage.value.trim(),
      siteUrl: els.siteUrl.value.trim(),
      shareMessage: els.shareMessage.value.trim(),
      questions: collectQuestionsFromForm(),
    };
  }

  els.btnSaveProfile.addEventListener('click', () => {
    const profile = collectProfileFromForm();
    data.profiles[currentProfileKey] = profile;
    overrides.profiles[currentProfileKey] = profile;
    overrides.deletedProfiles = (overrides.deletedProfiles || []).filter((k) => k !== currentProfileKey);
    persist();
    populateProfileSelect();
    flashConfirm(els.saveProfileConfirm);
  });

  // ---------- QUESTIONS EDITOR ----------
  function renderQuestionsEditor() {
    els.questionsList.innerHTML = '';
    currentQuestions.forEach((q, qi) => {
      els.questionsList.appendChild(buildQuestionBlock(q, qi));
    });
    if (currentQuestions.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'admin-help';
      empty.textContent = 'No questions yet — add one below.';
      els.questionsList.appendChild(empty);
    }
  }

  function buildQuestionBlock(q, qi) {
    const block = document.createElement('div');
    block.className = 'question-block';

    const head = document.createElement('div');
    head.className = 'question-block-head';
    const label = document.createElement('span');
    label.className = 'admin-label';
    label.textContent = `Question ${qi + 1}`;
    const removeQ = document.createElement('button');
    removeQ.type = 'button';
    removeQ.className = 'remove-btn';
    removeQ.textContent = '✕';
    removeQ.title = 'Remove this question';
    removeQ.addEventListener('click', () => {
      currentQuestions.splice(qi, 1);
      renderQuestionsEditor();
    });
    head.appendChild(label);
    head.appendChild(removeQ);
    block.appendChild(head);

    const textInput = document.createElement('input');
    textInput.className = 'admin-input';
    textInput.type = 'text';
    textInput.placeholder = 'Question text';
    textInput.value = q.text || '';
    textInput.addEventListener('input', () => { q.text = textInput.value; });
    block.appendChild(textInput);

    const optionsWrap = document.createElement('div');
    optionsWrap.style.marginTop = '12px';
    block.appendChild(optionsWrap);

    if (!q.options) q.options = ['', ''];
    if (!q.reactions) q.reactions = [];

    function renderOptions() {
      optionsWrap.innerHTML = '';
      q.options.forEach((optText, oi) => {
        const row = document.createElement('div');
        row.className = 'option-row';

        const optInput = document.createElement('input');
        optInput.className = 'admin-input';
        optInput.type = 'text';
        optInput.placeholder = `Option ${oi + 1}`;
        optInput.value = optText || '';
        optInput.addEventListener('input', () => { q.options[oi] = optInput.value; });
        row.appendChild(optInput);

        const removeOpt = document.createElement('button');
        removeOpt.type = 'button';
        removeOpt.className = 'remove-btn';
        removeOpt.textContent = '✕';
        removeOpt.title = 'Remove this option';
        removeOpt.addEventListener('click', () => {
          if (q.options.length <= 2) {
            alert('Each question needs at least 2 options.');
            return;
          }
          q.options.splice(oi, 1);
          if (q.reactions.length) q.reactions.splice(oi, 1);
          renderOptions();
          renderReactions();
        });
        row.appendChild(removeOpt);

        optionsWrap.appendChild(row);
      });
    }

    const addOptBtn = document.createElement('button');
    addOptBtn.type = 'button';
    addOptBtn.className = 'add-option-btn';
    addOptBtn.textContent = '+ Add option';
    addOptBtn.addEventListener('click', () => {
      q.options.push('');
      renderOptions();
    });
    block.appendChild(addOptBtn);

    const reactionsNote = document.createElement('div');
    reactionsNote.className = 'reactions-note';
    reactionsNote.textContent = 'Optional: a custom reaction shown after each option is picked (leave blank for a default one).';
    block.appendChild(reactionsNote);

    const reactionsWrap = document.createElement('div');
    block.appendChild(reactionsWrap);

    function renderReactions() {
      reactionsWrap.innerHTML = '';
      q.options.forEach((_, oi) => {
        const row = document.createElement('div');
        row.className = 'option-row';
        const reactInput = document.createElement('input');
        reactInput.className = 'admin-input';
        reactInput.type = 'text';
        reactInput.placeholder = `Reaction for option ${oi + 1} (optional)`;
        reactInput.value = (q.reactions && q.reactions[oi]) || '';
        reactInput.addEventListener('input', () => {
          q.reactions[oi] = reactInput.value;
        });
        row.appendChild(reactInput);
        reactionsWrap.appendChild(row);
      });
    }

    renderOptions();
    renderReactions();

    return block;
  }

  function collectQuestionsFromForm() {
    return currentQuestions
      .filter((q) => q.text && q.options && q.options.filter(Boolean).length >= 2)
      .map((q) => {
        const cleanOptions = q.options.map((o) => o || '').filter((o) => o.trim() !== '');
        const cleanReactions = (q.reactions || []).slice(0, cleanOptions.length);
        const hasAnyReaction = cleanReactions.some((r) => r && r.trim() !== '');
        const result = { text: q.text.trim(), options: cleanOptions };
        if (hasAnyReaction) result.reactions = cleanReactions;
        return result;
      });
  }

  els.btnAddQuestion.addEventListener('click', () => {
    currentQuestions.push({ text: '', options: ['', ''], reactions: [] });
    renderQuestionsEditor();
  });

  // ---------- EXPORT ----------
  els.btnExport.addEventListener('click', () => {
    const text = rbExportConfigJsText();
    rbDownloadTextFile('config.js', text);
  });

  // ---------- HELPERS ----------
  function persist() {
    rbSaveOverrides(overrides);
    data = rbGetEffectiveData();
  }

  function flashConfirm(el) {
    el.hidden = false;
    clearTimeout(el._timer);
    el._timer = setTimeout(() => { el.hidden = true; }, 2200);
  }

  function refreshEverything() {
    data = rbGetEffectiveData();
    overrides = rbLoadOverrides();
    if (!data.profiles[currentProfileKey]) {
      currentProfileKey = Object.keys(data.profiles)[0] || 'default';
    }
    loadGlobalIntoForm();
    populateProfileSelect();
    loadProfileIntoForm(currentProfileKey);
  }

})();
