# 🎂 Bestie Birthday Surprise Website

A heartfelt, interactive birthday surprise web application created for celebrating your best friend's special day.

---

## ✨ Features & Journey

The website guides the user through four beautifully choreographed phases:

1. **🎧 Welcome Screen**
   - Floating hearts & sparkles with gentle floating animations.
   - Staggered masked text reveal.
   - Audio prompt ("headphones on, volume up").
   - Interactive start button that unlocks audio playback (YouTube player playing *"Aval — Manithan"* with discreet floating player controls).

2. **⏳ Real-Time Birthday Countdown**
   - Live countdown displaying days, hours, minutes, and seconds to the exact birthday moment.
   - **🧪 Test Mode Toggle**: Switch on test mode right on the screen to run a 60-second preview countdown with a progress bar.
   - Refreshed or reopened, the state persists and automatically unlocks at minute zero.

3. **🎉 The Grand Reveal**
   - Multi-stage confetti celebration (`canvas-confetti`).
   - Animated 3-tier birthday cake with glowing, flickering candles.
   - Elegant typography text reveal for *"Happy Birthday, [Name]"*.
   - "Step inside your surprise" continue button.

4. **📸 The Experience (Scrapbook & Memories)**
   - Continuous animated text marquee.
   - **Centrepiece Spotlight**: The single crowned favourite photo decorated with a satin ribbon bow and custom caption.
   - **Polaroid Scrapbook Grid**: Realistic polaroid photos with subtle tilts and hover lift effects.
   - **Lightbox View**: Fullscreen modal viewer when any polaroid is clicked.
   - **"The Day Our Paths Crossed"**: Special section for your meeting date and personalized story.
   - **Friendship Timeline**: Interactive milestone cards celebrating key moments together.
   - **Background Music Player**: Play/Pause and Mute/Unmute floating pill.

5. **🛠️ Secret Admin Workshop (`/admin`)**
   - Customize recipient name / nickname.
   - Set the exact birthday unlock datetime.
   - Upload photos directly from phone or desktop.
   - Add captions and dates to photos.
   - Mark any photo as the starred "favourite" centrepiece.
   - Customize "The Day Our Paths Crossed" title, date, and message.
   - Add, edit, and reorder friendship timeline moments.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+) and npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
# or: npm start
```

Open your browser at:
- **Surprise Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

> **Note:** The Vite dev server includes a built-in API middleware that handles all `/api` routes (settings, photo uploads, and file serving) automatically. You do not need to run a separate backend process for local development!

---

## 🖥️ Alternative Backend Options

If you prefer running a dedicated backend server:

### Option A: Node.js Express Backend
```bash
# Terminal 1: Start backend on port 5001
npm run server

# Terminal 2: Start frontend on port 3000
npm run dev
```

### Option B: Python FastAPI Backend
```bash
# Install Python requirements
pip install fastapi uvicorn python-multipart

# Start Python backend on port 5001
python backend/app.py
```

---

## 📁 Project Structure

```text
├── index.html                   # HTML entry point with fonts & metadata
├── package.json                 # Project scripts and dependencies
├── vite.config.js               # Vite config + dev API middleware + @/ alias
├── public/
│   └── favicon.svg              # Cute heart favicon
├── src/
│   ├── main.jsx                 # React root & QueryClient provider
│   ├── App.jsx                  # Main flow controller & Lenis smooth scrolling
│   ├── App.css                  # App styles
│   ├── index.css                # Full design system, Tailwind & animations (80KB+)
│   ├── components/
│   │   └── MusicPlayer.jsx      # YouTube audio background player
│   ├── pages/
│   │   ├── Welcome.jsx          # Phase 1: Welcome & headphone recommendation
│   │   ├── Countdown.jsx        # Phase 2: Live countdown & test mode
│   │   ├── Reveal.jsx           # Phase 3: Confetti & cake celebration
│   │   ├── Experience.jsx       # Phase 4: Scrapbook, favourite photo & timeline
│   │   └── Admin.jsx            # Secret workshop for customizing everything
│   └── lib/
│       └── api.js               # Full API client with automatic offline fallback
└── backend/
    ├── server.js                # Standalone Express backend
    ├── app.py                   # Alternative FastAPI Python backend
    ├── package.json             # Backend dependencies
    └── data/
        ├── settings.json        # Saved birthday & message settings
        ├── photos.json          # Uploaded photo records
        └── uploads/             # Saved image files
```

---

## 💡 Customization Tips

- **Reset countdown lock in browser**: Clear site data or run `localStorage.removeItem("unlocked")` in DevTools console to reset the unlock state.
- **Change Background Music**: Edit `VIDEO_ID` in `src/components/MusicPlayer.jsx` to any YouTube video ID of your choice.
