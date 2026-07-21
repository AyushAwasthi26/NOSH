
<div align="center">
  <img width="120" src="public/nosh.png" alt="NOSH Logo" />
  <h1>NOSH — Cinematic AI Recipe Companion</h1>
</div>

---

A premium, stateful **"Fridge-to-Recipe"** web application built for the **Frontend Internship Assignment**.  
This project transforms unpredictable LLM outputs into a highly reliable, interactive culinary dashboard. It focuses on cinematic motion design, glass-morphic UI, and robust error handling to bring AI-generated structured data to life.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel_Serverless-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 📋 Table of Contents

- [🔐 Environment Setup & API Security](#-environment-setup--api-security)
- [📸 Screenshots & Demo](#-screenshots--demo)
- [🌟 About the Project](#-about-the-project)
- [🎯 Assignment Fulfillment](#-assignment-fulfillment)
- [⚠️ Known Limitations](#-known-limitations)
- [✨ Features](#-features)
- [💻 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📂 Folder Structure](#-folder-structure)
- [🧠 AI Logic & Architecture Highlights](#-ai-logic--architecture-highlights)
- [🤖 AI Usage & Time Tracking](#-ai-usage--time-tracking)
- [👥 Project Team](#-project-team)
- [📜 License](#-license)

---

## 🔐 Environment Setup & API Security

This project adheres to the strict assignment requirement: *"API key: don't ship it in the browser."* To achieve this securely while remaining easy to run locally, the project uses an industry-standard open-source pattern involving `.gitignore` and `.env.example`.

Here is exactly how the environment setup works for this repository:

**1. `.gitignore` (Protects your secrets)**
The `.gitignore` file in the root directory tells GitHub: *"Do not upload any file that ends in `.env`"*. This means your real `.env` file (containing your actual API key) and `.env.local` will **never** be pushed to GitHub. This keeps your key safe.

**2. `.env.example` (Tells the user what to do)**
Because your real `.env` is hidden, a file called `.env.example` is included. Because it has the word `.example` at the end, it does *not* match the `.gitignore` rules. This file **will** be uploaded to GitHub.
Inside `.env.example`, there is fake text acting as a template:
```text
GEMINI_API_KEY=your_gemini_api_key_here
```

**3. How the reviewer knows what to do:**
When the reviewer clones this repo, they will not see a `.env` file. But they will see the `.env.example` file. Combined with the explicit setup instructions in the "Getting Started" section below, they will know exactly what to do: create a `.env` file, copy the contents of the example, and paste their real key. This is the industry standard for securing keys in submitted and open-source projects.

**4. Local vs. Production Security:**
*   **Locally:** Vite does not automatically load `.env` variables into `process.env` for server-side code. To fix this, `vite.config.js` uses a custom middleware (`apiDevMiddleware`) that securely reads the `.env` file and passes the key directly to the local Node server. The key is never prefixed with `VITE_`, ensuring the browser cannot access it.
*   **Production (Vercel):** Vercel completely ignores the Vite middleware. It sees the `api/generate-recipe.js` file, turns it into a Serverless Function, and securely injects the `GEMINI_API_KEY` (set in the Vercel dashboard) directly into `process.env`. The browser is always blocked from seeing the key.

---

## 📸 Screenshots & Demo

<img width="785" height="350" alt="Screenshot 2026-07-18 015222" src="https://github.com/user-attachments/assets/8b74bc68-982f-4864-b1d7-025d8c69870a" />
<img width="1917" height="973" alt="Screenshot 2026-07-18 015230" src="https://github.com/user-attachments/assets/37d8eecf-0194-42bc-8c53-ea98be6d03de" />
<img width="1917" height="1078" alt="Screenshot 2026-07-18 015305" src="https://github.com/user-attachments/assets/88478b2c-dd1e-4880-adf3-8a252e7186bd" />
<img width="1907" height="1078" alt="Screenshot 2026-07-18 015347" src="https://github.com/user-attachments/assets/49048136-2bec-450d-959d-87d42e615792" />
<img width="1917" height="1078" alt="Screenshot 2026-07-18 015412" src="https://github.com/user-attachments/assets/bfb9e9e8-fb78-4530-9c77-9882867ffda4" />
<img width="1917" height="1078" alt="Screenshot 2026-07-18 015421" src="https://github.com/user-attachments/assets/89d81cb8-78e8-4b2f-a7cf-5ef37eb1c5f7" />


---

## 🌟 About the Project

**NOSH** (formerly Bawarch-AI) is a React-based digital experience that bridges the gap between **raw AI generation** and **reliable, interactive UI**.  
Instead of treating LLMs as simple chatbots, NOSH leverages the Gemini 2.5 Flash model as a pure data engine, forcing strict JSON compliance to render an elegant, stateful dashboard.

> “Alchemy of Ingredients.”  
> NOSH takes the chaos of a home pantry and turns it into a cinematic, structured culinary journey.

### 🎯 Core Goals:
- Treat AI output as **structured state**, not conversational text.
- Build a **bulletproof validation layer** to handle LLM hallucinations or malformed JSON.
- Create a **cinematic, premium UX** that feels like a polished product, not a wrapper.

---

## 🎯 Assignment Fulfillment

This project was built strictly against the provided rubric:

- ✅ **No Chatbots:** The AI is strictly prompted to return `application/json`. The raw text is completely hidden; it is parsed directly into React components.
- ✅ **Interactive UI:** The recipe is not just displayed—it is interactive. Ingredients and steps are checkable lists with strike-throughs and a sticky tracking progress bar.
- ✅ **Handles Bad Output:** Multi-layered defense including Schema enforcement, JSON parse retries, explicit Shape Validation (`recipeEngine.js`), and graceful UI error boundaries.
- ✅ **No Stale Requests:** Utilizes `AbortController` to cancel pending API calls if the user rapidly triggers new refinements.
- ✅ **Secure API Key:** The Gemini API key is **never** shipped in the browser. It routes through a Vercel Serverless Function in production and a secure Vite middleware locally.
- ✅ **Stretch Goals Achieved:** Refinement loop (in-place edits), Save & Reload sessions (LocalStorage), and extensive UI Polish (Framer Motion, Dark Mode).

---

## ⚠️ Known Limitations

- **Mathematical Scaling:** While the AI is prompted to scale ingredient quantities perfectly when servings are adjusted, LLMs occasionally struggle with precise fractional math. The refinement loop allows users to manually correct this via text prompts if needed.
- **No Streaming:** The result is not streamed; the UI waits for the complete JSON response to ensure strict structural validation before rendering. This prioritizes reliability over real-time text generation.
- **Local Environment:** To run locally, users must provide their own `GEMINI_API_KEY` via an `.env` file (see Setup). 

---

## ✨ Features

- 🔁 **AI Refinement Loop:** Users can dynamically tweak recipes via text ("make it vegan"), scale servings (+/- buttons), or swap specific ingredients in real-time without starting over.
- 🛡️ **Bulletproof Validation:** Serverless logic intercepts the AI response, validates the required JSON arrays (ingredients, steps), and automatically retries if the AI fails.
- 💾 **Persistent Sessions:** State is written to `localStorage`. Reopening the tab restores the exact ingredients, active recipe, and dark/light mode preference.
- 🌀 **Cinematic Motion Design:** Powered by Framer Motion. Features staggered list entrances, layout-aware resizing cards, and dynamic UI loading states.
- 🌓 **Adaptive Theming:** Premium Dark (Obsidian/Saffron) and Light (Cream/Glass) modes, complete with dynamic image filters and background ambient glows.
- 📱 **Fully Responsive:** Mobile-first architecture ensuring the glass-morphic UI scales perfectly to all devices.

---

## 💻 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend Core** | React.js (Hooks, Functional Components) |
| **Styling** | Tailwind CSS v4 |
| **Animation** | Framer Motion, Lenis (Smooth Scrolling) |
| **AI Model** | Google Gemini 2.5 Flash (`@google/genai`) |
| **Backend / API** | Node.js, Vercel Serverless Functions |
| **Build Tool** | Vite |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

To run the project locally without exposing API keys, a custom Vite middleware has been configured.

### Prerequisites

Ensure you have **Node.js (v16+)** and **npm** installed.

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AyushAwasthi26/NOSH.git
   ```

2. **Navigate into the folder**
   ```bash
   cd NOSH
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up Environment Variables**
   
   This project requires a Google Gemini API key. (Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey)).
   
   * Locate the `.env.example` file in the root folder.
   * Create a new file named `.env` in the root directory.
   * Add your key exactly like this (the Vite config is set up to read this securely for local dev):
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   *(Note: The key is intentionally NOT prefixed with `VITE_` to ensure it never leaks to the browser).*

5. **Start the development server**
   ```bash
   npm start
   ```
   OR
   ```bash
   npm run dev
   ```
   *(Note: `npm start` is mapped to `vite` in `package.json` per assignment requirements. `npm run dev` also works).*

Now open your browser at **[http://localhost:5173/](http://localhost:5173/)**

---

## 📂 Folder Structure

```text
NOSH/
│
├── api/                     # Vercel Serverless Backend
│   ├── _lib/
│   │   └── recipeEngine.js  # Core AI logic: Prompting, JSON validation, Retry loop
│   └── generate-recipe.js   # Secure API Route Handler
│
├── public/
│   └── nosh.png             # Logo assets
│
├── src/
│   ├── components/
│   │   ├── Body.jsx         # App Controller: State, LocalStorage, AbortController
│   │   ├── Header.jsx       # Branding, Theme Toggle, SVG Filters
│   │   ├── IngredientsList.jsx # Dynamic Pantry UI, Input validation
│   │   └── RecipeDisplay.jsx   # Stateful recipe rendering, Refinement Loop
│   │
│   ├── ai.js                # Isomorphic fetch wrapper for the backend API
│   ├── App.jsx              # Routing & Lenis Smooth Scroll Provider
│   ├── index.css            # Tailwind directives & Custom scrollbars
│   └── main.jsx             # React DOM root
│
├── .env.example             # Template for API keys
├── .gitignore               
├── package.json             
└── vite.config.js           # Vite config & custom local API dev middleware
```

---

## 🧠 AI Logic & Architecture Highlights

### 🛡️ The JSON Validation Engine

**File:** `api/_lib/recipeEngine.js`

To prevent app crashes from AI hallucinations, the backend acts as a strict gatekeeper:

* Enforces `responseMimeType: "application/json"`.
* Runs `validateShape(parsed)` to ensure `ingredients` and `steps` are valid arrays.
* **Auto-Retry:** If `JSON.parse` fails, it catches the error and fires a secondary request prompting the LLM to fix its formatting, returning a `502` to the UI only if the retry also fails.

### 🛑 Preventing Stale Requests

**File:** `src/components/Body.jsx` & `src/ai.js`

When users utilize the Refinement Loop (e.g., rapidly clicking the "+" button to scale servings), race conditions can occur where an older request resolves *after* a newer one.

* Implemented `AbortController` inside a `useRef`.
* Calling `fetchRecipe()` instantly triggers `abortControllerRef.current.abort()`, canceling any pending network requests before initiating the new one.

### 🔁 The Refinement Loop

**File:** `src/components/RecipeDisplay.jsx`

Instead of wiping the state and prompting the AI from scratch, clicking "Swap Ingredient" or typing a custom refinement sends the *existing* JSON object back to the AI alongside the user's tweak. The AI edits the object in place, preserving the core recipe structure.

---

## 🤖 AI Usage & Time Tracking

**AI Usage Transparency Note:**
In accordance with assignment rules, AI tools were used transparently as pair-programming assistants.

* **ChatGPT & Perplexity:** Used during planning to research best practices for structuring Gemini outputs and securing API routes in Vite without a dedicated Express backend.
* **Claude, Gemini & Z AI:** Utilized for rapid refactoring of Tailwind utility classes, brainstorming Framer Motion `layout` logic, and consulting on the exact implementation of the `AbortController` hook.
* *Zero code was blindly copy-pasted; all logic was manually reviewed, integrated, and tailored to fit the specific constraints of the React component tree.*

**Time Allocation (Total: ~6 Hours)**

* **2.0 hrs:** Core engine (API integration, prompt engineering, strict JSON parsing, Vercel routing).
* **2.0 hrs:** UI/UX (Tailwind styling, Glass-morphism, Framer Motion animations, Responsive design).
* **1.5 hrs:** Stretch Features (Refinement loop, serving scalers, persistent local storage).
* **0.5 hrs:** Edge-case handling (AbortController, retry logic) & Documentation (README, Demo recording).

---

## 👥 Project Team

**→ Ayush Awasthi [Lead Developer & UI/UX Designer]**

*4th-year B.Tech CS (AI/ML) Student*

Designed and built the entire front-end architecture, AI integration, secure backend routing, and cinematic UI/UX for the NOSH application.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE.md](LICENSE.md) file for details.

---

[🔝 Back to Top](#-table-of-contents)
```
