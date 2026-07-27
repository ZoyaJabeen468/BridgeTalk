# BridgeTalk

**Prepare hard conversations calmly and clearly.**

# 1. App name, problem, and who it serves

**App name:** BridgeTalk

**What it does:** BridgeTalk helps young adults prepare respectful, bilingual (English and Urdu) conversations about important life decisions. You describe who you will talk to and what you need to explain. The app returns a structured conversation pack: a calm opener, clear wording, the other person’s likely worries, safer phrasing, and a practical next step.

**Real problem it solves:** In many families (especially South Asian and Pakistani households), hard talks about freelancing, gap years, changing degrees, moving cities, or personal timelines become emotional quickly. People often know what they want, but freeze on how to say it with respect. BridgeTalk is not a “convince your parents” tool. It is a communication coach that improves clarity and empathy. It never promises agreement.

**Who it is for:** Students and young adults preparing talks with parents, siblings, relatives, partners, mentors, or teachers.

# 2. Live deployed URL

**Live app:** Add your Vercel URL here after deploy (example shape: https://bridgetalk.vercel.app)

Replace the placeholder with your real public URL once Vercel deploy succeeds. Graders should open this link without logging into GitHub.

**Public GitHub repository:** Add your public repo URL here.

# 3. Features list

## Product flow
- Marketing landing page with brand story, audience guidance, how it works, and sample preview
- Sign up and sign in (local browser profile for this device)
- User profile page (name, bio, preferred tone, skills snapshot, sign out)
- Auth gate: Prepare Conversation and Skills require sign in or sign up first
- Conversation intake form (audience, situation, decision summary, concerns, tone, listener style, cultural context)
- Sample mode and audience deep links
- AI conversation pack generation via API
- Result page with structured pack sections and copy tools
- About page (why BridgeTalk exists and core principles)

## Conversation pack contents
- Calm opener
- English explanation
- Urdu spoken draft in proper Urdu script (not Roman Urdu)
- Their perspective (worries to address)
- Likely questions and calm answers
- Practical plan
- Risky phrases with safer alternatives
- Prep tips
- Soft scores for respect, clarity, practicality, and conflict risk

## Skills (communication practice)
- Daily practice strip (rotates by day; personalizes from your last pack when available)
- Self check (Calm, Clear, Respectful) before marking the day done
- Soft rewrite tips for tense wording
- Private streak with one grace day
- Short lessons (start soft, name their worry, ask before defending, pause, end with a next step)
- Practice drills: library drills and “from your pack” risky lines
- Post talk reflection
- Private skill scores and pattern hints (local only)

## Extra product details
- Copy section / copy all / WhatsApp friendly summary
- Demo pack fallback if AI keys are missing (app still works end to end)
- Responsive, professional UI with a custom design system

# 4. AI feature (what it does and the instructions behind it)

## What the AI does
The core AI feature is **conversation pack generation**.

1. User submits situation details on `/generate`.
2. `POST /api/generate` calls `src/lib/ai/generate-pack.ts`.
3. The model receives a system prompt and a structured user prompt written for BridgeTalk.
4. The model returns JSON only.
5. The response is validated with Zod (`conversationPackSchema`).
6. If the Urdu field arrives as Roman Urdu, the app converts it to proper Urdu script.
7. The pack is shown on `/result` and stored in the browser (not in a cloud database).

## Provider order
1. Google Gemini (primary)
2. OpenAI (optional fallback)
3. Built in demo pack (always available so the product never dead ends)

## System prompt (authored for this project)
Stored in `src/lib/prompts/system.ts`. Summary of the instructions:

- Act as a calm communication coach for young adults.
- Help both sides understand each other.
- Improve communication. Never promise agreement.
- Never make the other person the villain.
- Never coach manipulation, guilt, or “winning”.
- Stay culturally aware (especially South Asian / Pakistani contexts) without stereotyping.
- Use simple spoken wording.
- Support tones: calm, practical, warm.
- English: natural and respectful.
- Urdu: proper Arabic / Nastaliq script only. Never Roman Urdu.
- Fit wording to audience (parents, sibling, relative, partner, mentor, other).
- Return valid JSON only, with fields for opener, English, Urdu, theirPerspective, FAQ, plan, risky phrases, prep tips, and scores.

## User prompt builder
`buildUserPrompt()` sends the user’s audience, situation, decision summary, concerns, listener style, cultural context, and tone, then asks for a fixed JSON shape.

This prompt design is original to BridgeTalk’s product goal: respectful preparation, not persuasion.

# 5. Tools, services, and AI models used

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, custom design tokens, Framer Motion
- **UI primitives:** Radix UI (Select, Label, Slot), custom Button / Card / Input layer
- **Validation:** Zod
- **Primary AI:** Google Gemini (`GEMINI_MODEL`, default `gemini-flash-latest`, with model fallbacks)
- **Optional AI fallback:** OpenAI (`gpt-4o-mini` by default)
- **Storage:** Browser localStorage / sessionStorage (packs, skills, local auth)
- **Hosting:** Vercel (live URL to be added after deploy)
- **Editor / build:** Cursor, Node.js, npm

No API keys are committed. Keys live in `.env.local` locally and in Vercel Environment Variables in production.

# 6. Screenshots of the app in action

Add at least three real screenshots into `docs/screenshots/`, then keep these embeds:

## Screenshot 1: Landing page
![BridgeTalk landing page](docs/screenshots/01-landing.png)

## Screenshot 2: Prepare conversation form
![Prepare conversation form](docs/screenshots/02-generate.png)

## Screenshot 3: Generated conversation pack (English + Urdu)
![Conversation pack result](docs/screenshots/03-result.png)

## Screenshot 4 (recommended): Skills daily practice
![Skills page](docs/screenshots/04-skills.png)

Before submission: capture these screens from the live URL or local app and save them with the filenames above.

# 7. How to run the project

## Requirements
- Node.js 20+ recommended
- npm
- Optional: Google Gemini API key for live AI generation

## Local setup

```bash
git clone YOUR_PUBLIC_REPO_URL
cd BridgeTalk
npm install
cp .env.example .env.local
```

Open `.env.local` and set:

```bash
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-flash-latest
```

Optional:

```bash
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
```

Start development:

```bash
npm run dev
```

Open http://localhost:3000

## Useful scripts

```bash
npm run build
npm run start
npm run lint
```

## Notes for graders
1. Create an account (local to the browser), then open Prepare Conversation or Skills.
2. If no AI key is configured, generation still works using the demo pack.
3. With a Gemini key configured on Vercel, the live site generates real packs.
4. Open the repository in a private or incognito window to confirm it is public.
5. Never commit `.env.local`.

# Project structure (high level)

```text
src/app/            Routes: landing, generate, result, skills, auth, about, API
src/components/     UI, landing, generate, result, skills, auth, layout
src/lib/ai/         Generation pipeline and demo pack
src/lib/prompts/    System and user prompts (AI instructions)
src/lib/validation/ Zod schemas
src/constants/      Site copy, form options, skills content
public/images/      Hero and audience imagery
docs/screenshots/   README screenshots
```

# Privacy and academic honesty note

BridgeTalk was designed and built as an original student project around a real communication problem. Conversation packs and skills data stay in the browser. Local sign up or sign in is device based for product flow. Production AI keys must stay in host environment variables only.

Prepared for final project submission (deadline 27 July 2026, PKT).

# Formatted report copy

For a print friendly copy with Times New Roman and the required heading sizes, open:

`docs/PROJECT_REPORT.html`
