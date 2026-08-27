# Shagun for Sis 💛 — Raksha Bandhan Quiz

A personal, mobile-friendly site: best wishes → a quiz about you two → a
"pick a card" game that always reveals a ₹500 Shagun, claimable straight to
your UPI app — plus an option to donate to a cause instead.

Pure HTML/CSS/JS — no build step, no server, no cost.

## What's new in this version

1. **Best Wishes screen** — a warm greeting + a clear "here's the plan"
   explainer, shown before the quiz starts.
2. **Admin dashboard** (`admin.html`) — a password-protected page with
   on-screen forms to edit questions, UPI ID, WhatsApp number, and more.
   **No coding needed.**
3. **Multi-brother support** — the same website can serve several brothers,
   each with their own questions/UPI/WhatsApp number, via a link like
   `yoursite.com/?to=raj`.
4. **NGO / "donate instead" option** — shown on the final screen, fully
   editable (name, message, link) from the admin dashboard.
5. **Festive live-wallpaper background** — drifting petals, a slow-moving
   festive glow, and floating rakhi/diya icons, all pure CSS/canvas (no
   video/image assets needed, so the site stays fast).
6. **Automatic WhatsApp completion alert** — the moment she answers the
   last question, her phone opens WhatsApp with a message to you, ready to
   send — your cue to start the transfer. See the note on this below.

## Files

| File          | What it's for                                             | Do you need to edit it?               |
|---------------|------------------------------------------------------------|----------------------------------------|
| `index.html`  | Page structure + Open Graph tags for link previews          | Only the OG tags at the top, optional  |
| `style.css`   | All visual styling for the main site                        | No                                      |
| `admin.html`  | The admin dashboard (password-protected settings forms)     | No — use the forms inside it            |
| `admin.css`   | Styling for the admin dashboard                              | No                                      |
| `admin.js`    | Logic for the admin dashboard                                | No                                      |
| `data.js`     | Shared helpers that merge config.js with admin edits         | No                                      |
| `config.js`   | Your name, questions, UPI ID, WhatsApp number, NGO details   | Yes, if you'd rather edit text directly than use admin.html |
| `script.js`   | Quiz flow, card game, UPI link, WhatsApp alert, confetti      | No                                      |
| `og-image.jpg`| Preview image shown when the link is shared                   | Add your own image here                |

## The easiest way to set everything up: `admin.html`

1. Open `admin.html` in your browser (once deployed, `yoursite.com/admin.html`).
2. Log in with the password from `config.js` (`Rakhi2026` by default —
   **change this first thing**, from inside the dashboard itself, under
   "Global settings").
3. Fill in:
   - **Global settings** — turn the NGO option on/off and set its name,
     message, and link.
   - **Profile details** — your sister's name, your UPI ID, your name, the
     Shagun amount, your WhatsApp number for the completion alert, and the
     share link.
   - **Quiz questions** — add, edit, remove questions, options, and
     optional custom reactions, all through text boxes and buttons.
4. Click **Save** on each section. Your changes appear instantly if you
   reopen `index.html` **in the same browser** — great for previewing.
5. When you're happy, click **⬇ Download config.js** at the bottom. This
   gives you a brand-new `config.js` file with everything you just set up.
6. Replace the old `config.js` in your project folder with this
   downloaded one, and re-deploy your site (see "Deploy" below). **This is
   the one step that makes your changes visible to your sister and anyone
   else** — edits inside admin.html only preview in your own browser until
   you do this.

You never need to open a code file if you don't want to — the dashboard
covers questions, UPI ID, WhatsApp number, and the NGO link.

## Setting up for multiple brothers (one shared website)

Each brother gets his own **profile**: his own questions, his own UPI ID,
his own WhatsApp number.

1. In `admin.html`, click **+ New profile**, give it a short ID (e.g.
   `raj`, no spaces), and fill in his details and questions.
2. His personal link is shown right under the profile picker, e.g.
   `yoursite.com/?to=raj`.
3. Share that link with him (or with your sister when it's his turn) —
   opening it loads his profile instead of the default one.
4. Don't forget to **Download config.js** and re-deploy after adding or
   editing profiles, so the new profile works for everyone, not just in
   your browser.

## The WhatsApp completion alert — what it can and can't do

There's no way for a plain website (no server, no paid business account)
to silently send a WhatsApp message in the background — that's only
possible through WhatsApp's paid Business API. The closest no-code
equivalent, and what this site does:

- The instant she answers the **last quiz question**, her phone
  automatically opens a WhatsApp chat to your number, with a message
  **already typed in**.
- She just needs to tap the existing **Send** button once — nothing to
  compose.
- If her browser blocks the auto-open (this can happen, especially on
  desktop), a **"🔔 Tap to notify on WhatsApp"** button appears on the
  card-picking screen as a backup.

Set your number under **Profile details → Your WhatsApp number** in
admin.html — use the country code and number with no spaces, dashes, or
`+` (e.g. `91` followed by your 10-digit number).

## The NGO / "donate instead" option

At the final screen, if enabled, she'll see the message you set (default:
*"I know you don't want money directly, so I would request you to help
others to whom it's more needed at this time."*) with a button linking to
the NGO of your choice. Change the name, message, or link any time from
**Global settings** in admin.html — no code involved.

## Add a preview image (optional but recommended)

Drop any square-ish photo (1200×630px is ideal) into the project folder
and name it `og-image.jpg`. This is what shows up as the thumbnail when
the link is pasted into WhatsApp.

## Deploy for free

Pick any one of these — all are free and take under 5 minutes.

### GitHub Pages
1. Create a new GitHub repo and push these files to it.
2. Go to **Settings → Pages** → set source to the `main` branch, root folder.
3. Your site will be live at `https://yourusername.github.io/your-repo-name/`.
4. Paste that URL into `config.js` / admin.html (`siteUrl`) and `index.html` (`og:url`).

### Vercel / Netlify
1. Sign up (free), then "Add new project" / "Add new site".
2. Drag-and-drop this folder (or connect the GitHub repo).
3. It deploys instantly and gives you a free `.vercel.app` or `.netlify.app` URL.
4. Paste that URL into `config.js` / admin.html (`siteUrl`) and `index.html` (`og:url`).

**Every time you download a new `config.js` from admin.html, you'll need
to repeat the upload/push step** so the live site picks up your changes.

## Share it

Open the site once yourself to check everything works, then tap **"Share
this with someone else"** on the final screen (or just send the link
directly) — it opens WhatsApp with a message and the link ready to send.

## A note on the admin password

The password in `config.js` (or set via admin.html) is a simple front-door
lock — good for keeping casual visitors from poking around, but since it
lives in a file anyone could technically view, it isn't bank-grade
security. Don't reuse a password you use elsewhere, and don't rely on it
to protect anything more sensitive than quiz questions.

## Notes on the UPI link

The Claim button opens `upi://pay?...` — this is the standard UPI deep-link
format. It only opens a UPI app automatically on a phone that has one
installed (GPay, PhonePe, Paytm, BHIM, etc). On desktop there's nothing to
catch that link, so the button shows the link as text instead.
