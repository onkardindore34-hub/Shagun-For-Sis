# Shagun for Sis 💛

A tiny, personal, mobile-friendly site: a quiz about you two, then a "pick a card"
game that always reveals a ₹500 Shagun, claimable straight to your UPI app.

Pure HTML/CSS/JS — no build step, no server, no cost.

## Files

| File         | What it's for                                  | Do you need to edit it? |
|--------------|-------------------------------------------------|--------------------------|
| `index.html` | Page structure + Open Graph tags for link previews | Only the OG tags at the top |
| `style.css`  | All visual styling                              | No |
| `config.js`  | **Your name, questions, and UPI ID**            | **Yes — this is the only file you need** |
| `script.js`  | Quiz logic, card game, UPI link, WhatsApp share | No |
| `og-image.jpg` | Preview image shown when the link is shared    | Add your own image here |

## 1. Add your details (`config.js`)

Open `config.js` and fill in:
- `recipientName` — her name, shown in the greeting
- `upiId` — **your** UPI ID (e.g. `yourname@oksbi`), this is where the payment goes
- `payeeName` — your name, shown in the payment app
- `questions` — edit, add, or remove as many as you like

## 2. Add a preview image (optional but recommended)

Drop any square-ish photo (1200×630px is ideal) into the project folder and
name it `og-image.jpg`. This is what shows up as the thumbnail when the link
is pasted into WhatsApp.

## 3. Deploy for free

Pick any one of these — all are free and take under 5 minutes.

### GitHub Pages
1. Create a new GitHub repo and push these files to it.
2. Go to **Settings → Pages** → set source to the `main` branch, root folder.
3. Your site will be live at `https://yourusername.github.io/your-repo-name/`.
4. Paste that URL into `config.js` (`siteUrl`) and `index.html` (`og:url`).

### Vercel / Netlify
1. Sign up (free), then "Add new project" / "Add new site".
2. Drag-and-drop this folder (or connect the GitHub repo).
3. It deploys instantly and gives you a free `.vercel.app` or `.netlify.app` URL.
4. Paste that URL into `config.js` (`siteUrl`) and `index.html` (`og:url`).

## 4. Share it

Open the site once yourself to check everything works, then tap **"Share this
with someone else"** on the final screen (or just send the link directly) —
it opens WhatsApp with a message and the link ready to send.

## Making one for a friend's sister

This whole thing is a template — the only file with anything personal in it
is `config.js`. To make one for a friend:

1. Duplicate this whole folder (or the GitHub repo, using "Use this template" /
   "Fork").
2. Edit `config.js` with their sister's name, their own UPI ID, and new questions.
3. Deploy it as its own separate site (step 3 above) — each person needs their
   own link since it points at their own UPI ID.

## Notes on the UPI link

The Claim button opens `upi://pay?...` — this is the standard UPI deep-link
format. It only opens a UPI app automatically on a phone that has one
installed (GPay, PhonePe, Paytm, BHIM, etc). On desktop there's nothing to
catch that link, so the button shows the link as text instead.
