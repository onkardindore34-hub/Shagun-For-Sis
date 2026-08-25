/* ==============================================================
   CONFIG — this is the ONLY file you need to edit for your own use.

   Making this for a friend? Just duplicate this whole project folder
   and edit the values below for their sister instead. Nothing in
   script.js or style.css needs to change.
   ============================================================== */

const CONFIG = {

  // ---- 1. PERSONALISATION -------------------------------------
  // Shown in the big hero heading: "Hey <recipientName> 👋"
  recipientName: "Sis",

  // Shown on screen 4, above the Claim button.
  revealMessage: "You picked well. This one's yours — with all my love.",

  // ---- 2. YOUR UPI DETAILS  (⚠️ REQUIRED) ----------------------
  // This is what actually receives / requests the payment.
  // Get your UPI ID from your bank app or GPay/PhonePe/Paytm profile.
  // Format is usually something like "yourname@oksbi" or "9999999999@ybl"
  upiId: "your-upi-id@bank",       // <-- CHANGE THIS
  payeeName: "Your Name",          // <-- shown in the payment app
  amount: 500,                     // shagun amount in ₹

  // ---- 3. SHARE LINK --------------------------------------------
  // Update this AFTER you deploy (GitHub Pages / Vercel / Netlify
  // will give you the final URL). Used by the "Share" button.
  siteUrl: "https://yourusername.github.io/shagun-for-sis/",

  // Message that goes along with the WhatsApp share link.
  shareMessage: "I made something just for you 💛 Open this:",

  // ---- 4. QUIZ QUESTIONS ------------------------------------------
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

};
