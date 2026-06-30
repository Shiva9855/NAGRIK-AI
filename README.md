# NagrikAI 🇮🇳
### **Empowering Citizens. Transforming Communities with AI.**

NagrikAI is a complete, production-ready, AI-driven hyperlocal civic issue reporting and management platform designed to turn every smartphone into an active municipal sensor. Built for national-level smart city hackathons, it streamlines citizen-municipal transparency, minimizes spam, eliminates duplicate reports, and dispatches repairs in real time.

---

## 🎨 Creative Architecture & Key Features

### 1. 👁️ AI Computer Vision & OCR
Allows citizens to upload photo evidence of broken infrastructure. Using Google Gemini models, the platform instantly:
- Automatically detects and categorizes the defect.
- Drafts actionable, highly descriptive complaint titles and explanations.
- Quantifies objective damage severity and repairs priority.
- Simulates standard repair costs (in INR) and resolution timelines.

### 2. 📍 Smart Duplicate Detection (HUD)
Before filing, a mathematical proximity algorithm cross-references geographic coordinates and category tags. If active reports exist within 120 meters, citizens are alerted with details and prompted to support/upvote the existing issue instead of creating duplicate spam.

### 3. 💬 Multilingual Chat Assistant
A conversational chatbot (English, Hindi, Marathi, Kannada, Tamil) powered by Gemini AI that walks users through filings, queries citizen scores, and refers to active neighborhood statistics on the fly.

### 4. 🎮 Citizen Gamification & Leaderboard
Fosters community pride. Citizens earn XP for reporting (+50 XP) and physically verifying (+20 XP) nearby incidents. XP can be redeemed for property tax rebates or transit vouchers.

### 5. 🗺️ Hyperlocal Coordinates Map
An interactive, high-contrast vector coordinates plotter. Markers are color-coded (Red for critical, Yellow for medium, Green for low). Clicking a marker pulls up timelines, verified counts, and expected completion dispatches.

### 6. 📊 Predictive Analytics Dashboard
Uses historical issue reports to plot peak incident hours, monthly resolution times, and department loads using Recharts. Incorporates a smart risk heatmap predicting post-monsoon asphalt failures and garbage hotspots.

---

## 📁 System Folder Structure
```
├── .env.example                # Environment variables skeleton
├── index.html                  # Core HTML file
├── package.json                # Project script and workspace dependencies
├── server.ts                   # Express full stack server & Gemini API handlers
├── metadata.json               # Manifest capabilities 
├── src/
│   ├── App.tsx                 # Main application routes & state manager
│   ├── main.tsx                # SPA entry point
│   ├── index.css               # Tailwind CSS import
│   ├── types.ts                # TypeScript strict interface definitions
│   └── components/
│       ├── Navbar.tsx          # Responsive navigation & role selectors
│       ├── LandingPage.tsx     # Hero section, live stats ticker, AI visualizer
│       ├── Dashboard.tsx       # Citizen portal with filters & active feed cards
│       ├── ReportIssue.tsx     # Drag-drop file uploading, speech microphone, AI analyzer
│       ├── MapView.tsx         # Responsive vector map & coordinates HUD 
│       ├── Leaderboard.tsx     # Gamified ranks & Municipal credit redemptions
│       ├── Feed.tsx            # Social feed with timelines & discussions
│       ├── AuthorityDashboard.tsx # Triage metrics, Recharts, and dispatch assignments
│       ├── Profile.tsx         # Citizen activity heatmap & earned badges
│       ├── HelpCenter.tsx      # FAQ search and municipal email forms
│       ├── Settings.tsx        # Language & notify toggle panel
│       ├── ChatBot.tsx         # Floating collapsible AI multilingual chatbot
│       └── NotificationsDrawer.tsx # Sliding panel for live citizen alerts
```

---

## 🛠️ Installation & Execution

### Prerequisites
- Node.js (v18+)
- Gemini API Key (Configure in your settings or `.env`)

### Local Setup
1. Clone the repository and navigate to root directory.
2. Install base dependencies:
   ```bash
   npm install
   ```
3. Copy and configure variables:
   ```bash
   cp .env.example .env
   ```
4. Boot the full-stack development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Hackathon Pitch Script (Interactive Demo Guide)

> *"Judges, most civic portals are broken because of duplicate spam and slow official dispatches. With NagrikAI, reporting is immediate. We snap a photo of a pothole, and our computer vision automatically drafts the title, maps coordinates, estimates cost, and prevents duplicates. Nearby neighbors verify the hazard to earn points for property tax offsets, while officials coordinate dispatches from a live analytics control console."*

Developed with ❤️ for the Smart City Hackathon.
