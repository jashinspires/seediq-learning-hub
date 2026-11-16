# SeedIQ

**A personal study desk for deep focus.**

SeedIQ is a minimal, distraction-free learning workspace designed to feel like your own notebook and study table—not another noisy course marketplace. Open it and start studying right away with zero splash screens and zero forced login walls.

---

## How the Study Loop Works

SeedIQ keeps your daily learning simple across five connected spaces:

1. **Personal Command Center (`/`)**  
   Pick one daily focus objective, track your active learning streak, and jump straight back into your current goal, AI session, or latest note.

2. **Learning Paths & Custom Goals (`/skillup`)**  
   Study from curated free resources (MIT OpenCourseWare, React Docs, 3Blue1Brown, VisuAlgo, Tofugu, and more) organized into checkable milestones—or create your own custom study track in seconds.

3. **AI Study Partner (`/ai-tutor`)**  
   Ask questions, switch coaching modes (*Guided Breakdown*, *Socratic Coach*, *Debug & Review*, *Concept Check*), link a goal for context, upload problem screenshots, and save helpful explanations directly into your notebook.

4. **Active Self-Testing (`/practice`)**  
   Test what you actually remember with topic quizzes, instant AI-generated practice checks, and spaced-recall flashcards.

5. **Personal Notebook & Activity Heatmap (`/notes`, `/profile`)**  
   Jot down takeaways alongside your goals, search across notes and tags, and see your real study consistency across a 16-week activity grid.

---

## Local Desk + Cloud Sync

- **Start immediately:** Everything works locally in your browser out of the box via `localStorage`.
- **Sync across devices:** Sign in with Google on `/auth` or `/profile` to back up your goals, milestones, notes, flashcards, quiz history, and study streaks to Cloud Firestore.
- **Private by design:** User data lives under owner-scoped `/users/{userId}` documents protected by strict Firestore security rules (`firestore.rules`).

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend API:** Express 5 (`server.ts`) handling server-side Gemini study assistance (`/api/ai/chat`, `/api/ai/quiz`)
- **Auth & Database:** Firebase Authentication (Google Sign-In) & Cloud Firestore

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and add your Gemini API key (used on the server for AI Studio and quiz generation):

```bash
cp .env.example .env
```

```env
GEMINI_API_KEY=your_api_key_here
```

Firebase client settings live in `firebase-applet-config.json`.

### 3. Run the app

```bash
npm run dev
```

The app and API server run together on **`http://localhost:3000`**.

---

## Useful Scripts

```bash
npm run dev       # Start Express + Vite dev server on port 3000
npm run build     # Build the production frontend bundle
npm run start     # Run the production server
npm run lint      # Run ESLint across TypeScript files and firestore.rules
npx tsx --test src/lib/studyLogic.test.ts firestore.rules.test.ts  # Run unit & rule-invariant tests
```

---

## Project Structure

```text
├── server.ts                  # Express server + Vite middleware & AI endpoints
├── firestore.rules            # Owner-isolated Firestore security rules
├── firebase-blueprint.json    # Data schema blueprint for Firestore entities
├── src/
│   ├── data/seedData.ts       # Starter learning paths, flashcards, quizzes, notes
│   ├── lib/
│   │   ├── firebase.ts        # Firebase Auth & Firestore initialization
│   │   ├── firestoreSanitizer.ts # Payload validation & clamping helpers
│   │   ├── studyLogic.ts      # Pure streak, heatmap, progress & quiz logic
│   │   └── studyTypes.ts      # Shared TypeScript interfaces
│   ├── store/StudyContext.tsx # Local + real-time Firestore workspace sync
│   └── pages/                 # HomeDashboard, SkillUp, AIStudio, Practice, Notes, Profile, Auth
```
