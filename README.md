# مُهيب — Muheeb Website

Saudi custom thoob tailoring service — prototype website.

## Project Structure

```
muheeb/
├── index.html              Landing page
├── order.html              Order flow (3 steps)
├── css/
│   ├── main.css            Landing page styles
│   └── order.css           Order flow styles
├── js/
│   ├── main.js             Landing page logic
│   └── order.js            Order flow logic
├── content/
│   └── content.js          ← ALL editable text + config lives here
├── images/
│   └── README.md           Image placement guide
└── README.md               This file
```

## How to edit content

Open `content/content.js` — this is the only file you need to edit for:
- Changing any Arabic text
- Updating prices
- Changing your WhatsApp number
- Adding your YouTube video ID
- Updating city list
- Changing fabric options or prices

## How to add photos

See `images/README.md` for the full guide.

## How to run

Open `index.html` in any browser — no server needed.
Or use VS Code Live Server extension for auto-reload.

## To deploy

Upload all files to any static host: Netlify, Vercel, GitHub Pages, etc.
