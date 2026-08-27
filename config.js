/* ==============================================================
   CONFIG — this is the file you edit for day-to-day changes.

   ⭐ EASIEST WAY TO EDIT: open admin.html on your site (e.g.
   yoursite.com/admin.html), log in, and use the on-screen forms.
   That page can even generate a fresh copy of this file for you
   to download — you never have to touch code below if you don't
   want to.

   If you're comfortable in a text file, you can also edit the
   values directly below. Every setting has a comment explaining
   what it does.
   ============================================================== */

const CONFIG = {

  // ---- ADMIN PASSWORD -------------------------------------------
  // Used to log into admin.html to edit things through a form.
  // Change this to something only your family knows.
  // NOTE: this is a simple front-door lock, not bank-grade
  // security — anyone who can view this file's text could see the
  // password. Good enough for keeping casual visitors out, not for
  // protecting real secrets.
  adminPassword: "Rakhi2026",

  // ---- NGO / DONATION OPTION --------------------------------------
  // Shown on the final "coupon" screen as an alternative to taking
  // the money — a link she can click to donate instead, if she'd
  // rather. Turn it off any time with enabled: false.
  ngo: {
    enabled: true,
    name: "GiveIndia",
    message: "I know you don't want money directly, so I would request you to help others to whom it's more needed at this time.",
    url: "https://www.giveindia.org/",
    // Text shown on the button itself.
    buttonText: "Donate to GiveIndia instead 🤝",
  },

  // ---- PROFILES ----------------------------------------------------
  // One "profile" = one brother's page: his own greeting, his own
  // questions, his own UPI ID, and his own WhatsApp number for the
  // completion alert.
  //
  // • If you're the only one using this site, you only need to
  //   edit the "default" profile below.
  // • If other brothers want to use the SAME website with their
  //   OWN questions/UPI/number, duplicate the "default" block,
  //   give it a new key (e.g. "raj", "amit" — no spaces), and fill
  //   it in. They then share a link like:
  //       https://yoursite.com/?to=raj
  //   which loads THEIR profile instead of the default one.
  // • The easiest way to add/edit a profile is admin.html — it
  //   builds this structure for you automatically.
  profiles: {

    default: {

      // Shown in the big hero heading: "Hey <recipientName> 👋"
      recipientName: "Sis",

      // Shown on the coupon screen, above the Claim button.
      revealMessage: "You picked well. This one's yours — with all my love.",

      // ---- YOUR UPI DETAILS  (⚠️ REQUIRED) -------------------------
      // This is what actually receives / requests the payment.
      // Get your UPI ID from your bank app or GPay/PhonePe/Paytm profile.
      // Format is usually something like "yourname@oksbi" or "9999999999@ybl"
      upiId: "your-upi-id@bank",       // <-- CHANGE THIS
      payeeName: "Your Name",          // <-- shown in the payment app
      amount: 500,                     // shagun amount in ₹

      // ---- WHATSAPP COMPLETION ALERT  (⚠️ REQUIRED) -----------------
      // The instant she finishes the last quiz question, her phone
      // will pop open WhatsApp with a message to THIS number, ready
      // for her to hit send — that's your signal to start the UPI
      // transfer. Use the full number with country code, digits
      // only (no +, no spaces, no dashes). Example: 91 followed by
      // your 10-digit number.
      notifyWhatsAppNumber: "919999999999",  // <-- CHANGE THIS

      // The message that gets pre-filled. {{name}} is automatically
      // replaced with recipientName above.
      notifyMessage: "Hey! 🎉 {{name}} just finished the Rakhi quiz — go ahead and send the Shagun! 💛",

      // ---- SHARE LINK --------------------------------------------
      // Update this AFTER you deploy (GitHub Pages / Vercel / Netlify
      // will give you the final URL). Used by the "Share" button.
      siteUrl: "https://yourusername.github.io/shagun-for-sis/",

      // Message that goes along with the WhatsApp share link.
      shareMessage: "I made something just for you 💛 Open this:",

      // ---- QUIZ QUESTIONS ------------------------------------------
      // Add, remove, or edit as many as you like. Only "text" and
      // "options" matter for the flow — there's no wrong answer, this
      // is just for fun before the surprise. If you want to react
      // differently depending on what she picks, use "reactions"
      // (same length/order as options) — otherwise a default reaction
      // is used for every answer.
      questions: [
        {
          text: "What's my go-to order at our favourite restaurant?",
          options: ["Butter chicken, obviously", "Something new, every time", "Whatever you're having"],
          reactions: ["Haha, close enough!", "You know me too well 😄", "Aww, that's fair too"]
        },
        {
          text: "Which of these annoys me the most?",
          options: ["Slow wifi", "Waking up early", "Answering 'wyd'"],
        },
        {
          text: "Pick the memory you'd relive on a loop:",
          options: ["That road trip", "Our silly fights", "Late-night talks"],
        },
        {
          text: "If I could give you one thing right now, it'd be:",
          options: ["Your favourite snack", "A long hug", "Money, duh 💸"],
        }
      ],

    },

    // ---- EXAMPLE SECOND PROFILE ------------------------------------
    // This shows the pattern for adding another brother. Delete this
    // whole block if you don't need it, or duplicate it for each
    // additional person. Share the link  ?to=example-brother
    // with them to test it out.
    "example-brother": {
      recipientName: "Sis",
      revealMessage: "This one's yours — with all my love, from your other brother!",
      upiId: "another-upi-id@bank",
      payeeName: "Another Name",
      amount: 500,
      notifyWhatsAppNumber: "919888888888",
      notifyMessage: "Hey! 🎉 {{name}} just finished the Rakhi quiz — go ahead and send the Shagun! 💛",
      siteUrl: "https://yourusername.github.io/shagun-for-sis/?to=example-brother",
      shareMessage: "I made something just for you 💛 Open this:",
      questions: [
        {
          text: "What's my favourite way to spend a weekend?",
          options: ["Sleeping in", "Outdoors", "Binge-watching something"],
        },
        {
          text: "Pick the memory you'd relive on a loop:",
          options: ["Our childhood home", "That one trip", "Every Rakhi together"],
        },
      ],
    },

  },

};
