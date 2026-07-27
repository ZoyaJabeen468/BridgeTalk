# BridgeTalk

**Prepare hard conversations calmly and clearly.**

BridgeTalk is a bilingual (English + Urdu) AI communication coach that helps young adults prepare respectful conversations about hard life decisions with parents, siblings, relatives, partners, or mentors.

**Live app:** https://bridgetalk-two.vercel.app
**GitHub repo:** https://github.com/ZoyaJabeen468/BridgeTalk

---

## 1. App name, problem, and who it serves

**App name:** BridgeTalk

**What it does:** BridgeTalk helps young adults prepare respectful, bilingual (English and Urdu) conversations about important life decisions. You describe who you will talk to and what you need to explain. The app returns a structured conversation pack: a calm opener, a clear explanation in English and Urdu, the other person's likely worries, common questions with calm answers, risky phrases with safer alternatives, and a practical next step.

**Real problem it solves:** In many families — especially South Asian and Pakistani households — hard talks about freelancing, gap years, changing degrees, moving cities, or personal timelines become emotional very fast. People usually know *what* they want to say, but freeze on *how* to say it without sounding disrespectful or triggering conflict. BridgeTalk is not a "convince your parents" tool — it never promises agreement. It is a communication coach that improves clarity, empathy, and calm delivery on both sides.

**Who it's for:** Students and young adults in Pakistan (and similar family cultures) who need to prepare a respectful conversation with parents, a sibling, a relative, a partner, or a mentor — before the room gets tense.

---

## 2. Live deployed URL

| | |
|---|---|
| **Live app** | https://bridgetalk-two.vercel.app |
| **Public GitHub repository** | https://github.com/ZoyaJabeen468/BridgeTalk |

---

## 3. Features list

### Product flow
- Marketing landing page with brand story, audience guidance, "how it works," and a sample preview
- Sign up / sign in with a local browser profile (per-device account)
- User profile page — name, bio, preferred tone, streak + lessons snapshot, sign out
- Auth gate — Prepare Conversation and Skills require sign in/up first
- 3-step conversation intake form: **Share details → We prepare it → Have the talk**
- Sample mode and audience-specific quick links (Parents, Sibling, Relative, Partner, Mentor)
- AI conversation pack generation via a backend API route
- Result page with structured, copyable pack sections
- About page explaining why BridgeTalk exists and its core principles

### Conversation pack contents
- Calm opener line
- Full English explanation
- Urdu spoken draft in proper Urdu (Nastaliq) script — never Roman Urdu
- "What they may worry about" — the other person's likely concerns
- Likely questions with calm, ready answers
- A practical, step-by-step plan
- Risky phrases flagged with safer alternatives
- Soft scores: respect, clarity, practicality, and conflict risk

### Skills (communication practice)
- Daily practice strip that rotates and personalizes from your last generated pack
- Self-check (Calm / Clear / Respectful) before marking a day complete
- Soft rewrite exercises for tense wording
- Private streak tracking with one grace day
- Short lessons: start soft, name their worry first, ask before defending, pause, end with a next step
- Practice drills, including drills pulled directly from your own pack's risky lines
- Post-talk reflection
- Private, local-only skill scores (Clarity, Respect, Listening, Calm under pressure) with pattern hints

### Extra product details
- Copy section / copy all / WhatsApp-friendly summary export
- Built-in demo pack fallback if no AI key is configured, so the app never dead-ends
- Fully responsive, custom-designed UI (not a default template)

---

## 4. The AI feature

### What it does
The core AI feature is **conversation pack generation**:

1. The user fills in the situation on `/generate` (audience, topic, what to explain, their likely worries, how they usually respond, tone, cultural context).
2. `POST /api/generate` calls `src/lib/ai/generate-pack.ts`.
3. The model is given a system prompt (BridgeTalk's coaching rules) plus a structured user prompt built from the form.
4. The model must return **JSON only**, validated with a Zod schema (`conversationPackSchema`).
5. If Urdu comes back as Roman Urdu, the app converts it into proper Urdu script.
6. The finished pack renders on `/result` and is stored only in the browser — never in a cloud database.

### Provider order (fallback chain)
1. **Google Gemini** (primary)
2. **OpenAI** (optional fallback)
3. **Built-in demo pack** (guarantees the product always works, even with no API key)

### System prompt (authored for this project)
Stored in `src/lib/prompts/system.ts`. Core instructions given to the model:

- Act as a calm communication coach for young adults.
- Help both sides understand each other — improve communication, never promise agreement.
- Never make the other person "the villain."
- Never coach manipulation, guilt-tripping, or "winning" the conversation.
- Stay culturally aware (especially South Asian / Pakistani family contexts) without stereotyping.
- Use simple, natural, spoken wording.
- Support three tones: calm, practical, warm.
- Urdu output must be in proper Arabic/Nastaliq script only — never Roman Urdu.
- Adapt wording to the audience (parent, sibling, relative, partner, mentor, other).
- Return valid JSON only, with fixed fields for opener, English text, Urdu text, their perspective, FAQ, plan, risky phrases, prep tips, and scores.

### User prompt builder
`buildUserPrompt()` assembles the user's audience, topic, decision summary, anticipated concerns, listener style, cultural context, and desired tone into a single structured prompt, then requests the fixed JSON shape described above. This prompt design is original to BridgeTalk's product goal — respectful preparation, not persuasion.

---

## 5. Tools, services, and AI models used

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, custom design tokens, Framer Motion
- **UI primitives:** Radix UI (Select, Label, Slot) with a custom Button / Card / Input layer
- **Validation:** Zod
- **Primary AI:** Google Gemini (`GEMINI_MODEL`, default `gemini-flash-latest`, with model fallbacks)
- **Optional AI fallback:** OpenAI (`gpt-4o-mini` by default)
- **Storage:** Browser `localStorage` / `sessionStorage` (packs, skills progress, local auth) — no server database
- **Hosting:** Vercel — https://bridgetalk-two.vercel.app
- **Editor / build tooling:** Cursor, Node.js, npm

No API keys are committed to the repository. Keys live in `.env.local` locally and in Vercel's Environment Variables in production.

---

## 6. Screenshots

### Landing page

<img width="624" height="312" alt="image" src="https://github.com/user-attachments/assets/52f6278f-a484-426b-9e1c-eb82af0481b1" />


### Communication / audience selection
<img width="1919" height="971" alt="image" src="https://github.com/user-attachments/assets/4a6e0341-8dd3-47b3-9eae-26c31ff8e639" />


### Sign in
<img width="1918" height="960" alt="image" src="https://github.com/user-attachments/assets/ab02e6c5-aaf8-4db2-9127-75ff90aeba0a" />


### Create account
<img width="1912" height="972" alt="image" src="https://github.com/user-attachments/assets/52ccfa66-e9b1-485f-8a51-7fc1deb99967" />


### User profile
<img width="1038" height="855" alt="image" src="https://github.com/user-attachments/assets/6b293023-4701-48bf-993a-948687beb275" />


### Prepare a conversation — intake form
<img width="736" height="864" alt="image" src="https://github.com/user-attachments/assets/039a93de-a2aa-48fc-8591-9ae48719d387" />


### Generated conversation pack (English + Urdu)
<img width="542" height="782" alt="image" src="https://github.com/user-attachments/assets/b3137cea-aa3a-43e8-a30d-99d21add3ae2" />


### Skills — daily practice
<img width="552" height="850" alt="image" src="https://github.com/user-attachments/assets/e6f72ea2-218e-4d2d-b9a9-3f0641dcc153" />


---

## 7. How to run the project

### Requirements
- Node.js 20+ recommended
- npm
- Optional: a Google Gemini API key for live AI generation (the app runs without one, using the demo pack)

### Local setup
```bash
git clone https://github.com/ZoyaJabeen468/BridgeTalk.git
cd BridgeTalk
npm install
cp .env.example .env.local
```

Open `.env.local` and set:
```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-flash-latest
```

Optional fallback:
```env
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
```

Start the dev server:
```bash
npm run dev
```
Open http://localhost:3000

### Useful scripts
```bash
npm run build
npm run start
npm run lint
```

### Notes for graders
1. Create an account (local to your browser), then open **Prepare Conversation** or **Skills**.
2. If no AI key is configured, generation still works end-to-end using the built-in demo pack.
3. With a Gemini key configured on Vercel, the live site generates real, unique packs.
4. The repository is public — open it in a private/incognito window to confirm.
5. `.env.local` is never committed (see `.gitignore`).

---

## Project structure (high level)

```
src/app/            Routes: landing, generate, result, skills, auth, about, API
src/components/     UI, landing, generate, result, skills, auth, layout
src/lib/ai/         Generation pipeline and demo pack
src/lib/prompts/    System and user prompts (AI instructions)
src/lib/validation/ Zod schemas
src/constants/      Site copy, form options, skills content
public/images/      Hero and audience imagery
docs/screenshots/   README screenshots
```

---

## Privacy and academic honesty note

BridgeTalk was designed and built as an original student project around a real communication problem. Conversation packs and skills data stay in the browser only. Local sign-up/sign-in is device-based for the product flow, not a real cloud account. Production AI keys live only in host environment variables, never in the repository.

Prepared for final project submission — deadline 27 July 2026, PKT.
