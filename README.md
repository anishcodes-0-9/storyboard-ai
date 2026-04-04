# Storyboard AI

Storyboard AI is a full-stack AI product that turns a rough prompt into a polished, presentation-ready storyboard.

Instead of giving you a raw wall of generated text, it gives you a structured artifact with editable sections, saved snapshots, reusable library entries, and a shareable read-only view. The goal is to make AI output feel like a working deliverable, not just a draft.

## What This Project Does

You start with a prompt.

The app then generates a structured storyboard with four sections:

- Narrative Summary
- Strategic Pillars
- Milestone Roadmap
- Success Signals

From there, you can:

- edit any section manually
- regenerate a single section
- reorder sections
- save snapshots of your work
- restore earlier versions
- save finished artifacts to a library
- save variants as new library entries
- delete old snapshots or artifacts
- export the result as PDF
- copy the output as markdown
- open artifacts in a read-only share view

This makes the app useful for:

- startup ideas
- product launch briefs
- executive summaries
- roadmap storytelling
- pitch prep
- internal review decks
- structured AI-assisted writing workflows

## Why We Built It

A lot of AI writing tools generate text quickly, but the output often feels disposable.

We wanted to build something that felt closer to a creative/product workflow:

- prompt in
- structured artifact out
- refinement inside the same workspace
- persistence across sessions
- outputs that feel presentation-ready

The intent was not just “generate content,” but “generate something worth reviewing, editing, saving, and presenting.”

## Product Goal

The main goal of Storyboard AI is:

> Turn rough thinking into a polished narrative artifact that already feels ready for review.

That shaped almost every design and engineering decision in the app.

## Core Features

### Editor Workspace

The editor is the main working surface.

It includes:

- a prompt composer
- a live artifact canvas
- a history panel for snapshots and library actions

The editor supports local persistence, so work survives refresh.

### AI Storyboard Generation

The app sends the prompt and selected template to an Express backend, which calls the OpenAI API and returns structured JSON.

The generation flow is template-aware and produces a fixed artifact shape.

### Section Editing and Regeneration

Each section is independently editable.

Users can:

- edit a section manually
- save their changes
- cancel edits
- regenerate a single section without losing the whole artifact

This keeps AI helpful without letting it take over the entire document.

### Drag and Drop Reordering

Sections can be reordered using drag and drop.

This is useful when the same content is better presented in a different sequence.

### Snapshot History

Users can save snapshots while iterating.

Snapshots can be:

- restored
- deleted
- persisted across refresh

This gives the app a lightweight “version history” feel.

### Artifact Library

Artifacts can be saved into a library.

Users can:

- save the current artifact
- overwrite an existing saved artifact
- save a variant as a new entry
- delete artifacts from the library
- reopen an artifact later

### Read-Only Share View

Saved artifacts can be opened in a read-only view.

This is useful for:

- reviewing work
- sharing drafts internally
- presenting a frozen version of an artifact without edit controls

### Export and Copy

Users can:

- export the artifact as a PDF
- copy the artifact as markdown

This helps bridge the app with real workflows like docs, decks, internal wikis, and collaboration tools.

## Templates Supported

The app currently supports these templates:

- Launch Brief
- Product Strategy
- Executive Summary

The template affects subtitle behavior and helps guide generation style.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Zustand
- React Router
- Tailwind CSS
- Framer Motion
- dnd-kit

### Backend

- Node.js
- Express
- OpenAI API

### Testing

- Vitest
- React Testing Library
- Playwright

## Architecture Overview

The project uses a simple but clean split:

### Frontend

The frontend handles:

- routing
- editor interactions
- artifact rendering
- local persistence
- snapshots
- library state
- share views
- PDF export
- copy-to-markdown behavior

### Backend

The backend handles:

- health endpoint
- AI generation endpoint
- OpenAI API communication
- structured JSON response generation

### State Management

Zustand is used to manage:

- prompt
- template
- sections
- snapshots
- artifacts
- active artifact state
- hydration status
- generation state
- local persistence actions

## Design Direction

This project intentionally avoids generic dashboard styling.

We aimed for a visual language that feels:

- cinematic
- premium
- editorial
- presentation-first

That shows up in:

- warm dark palette
- layered panel surfaces
- large expressive type
- rounded artifact cards
- subtle motion
- stronger narrative hierarchy than a typical CRUD UI

## Design Decisions and Trade-offs

### 1. Local-first persistence

We chose local storage for snapshots, library entries, and workspace persistence.

Why:

- simple UX
- no user auth required
- fast to build and test
- good fit for MVP scope

Trade-off:

- data is device-local
- no sync across devices
- deleting browser storage clears the library

### 2. Fixed four-section artifact structure

We generate exactly four sections.

Why:

- consistent presentation
- predictable UI
- easier editing and export
- easier test coverage

Trade-off:

- less flexibility for unusual content structures
- not ideal yet for very different artifact formats

### 3. Same-origin frontend + backend deployment

We prepared the app to deploy as one service on Render.

Why:

- simpler setup
- no cross-origin API complexity
- no separate frontend/backend deployment coordination
- production behavior matches app assumptions

Trade-off:

- less flexible than a fully separated frontend/backend architecture
- scaling frontend and backend independently would require future changes

### 4. Structured JSON generation

The backend requests structured JSON from OpenAI using a schema.

Why:

- predictable artifact shape
- easier rendering
- safer frontend assumptions
- less parsing ambiguity

Trade-off:

- stricter generation can increase latency
- schema complexity can affect response time

### 5. Faster model over slower premium model

We moved generation to `gpt-5-mini` after measuring latency.

Why:

- much better response time for interactive use
- better UX for an editor workflow

Trade-off:

- potentially slightly less polished output than a larger model
- acceptable for the MVP and current product goals

### 6. Inline editability over one-shot generation

We did not want generation to be the end of the workflow.

Why:

- AI output is rarely final
- users need control
- section-level editing makes the app more practical

Trade-off:

- more UI complexity
- more state handling
- more testing effort

## Performance Work We Did

We measured real backend latency and found that OpenAI response time was the main bottleneck.

What we changed:

- switched from `gpt-5` to `gpt-5-mini`
- shortened the backend prompt
- relaxed schema constraints slightly
- kept frontend behavior unchanged

Result:

- generation latency improved meaningfully
- the app became more usable as an interactive tool

## Edge-Case Hardening We Added

We hardened several important failure paths:

- generation is blocked when prompt is empty
- repeated generate clicks are ignored while generating
- explicit save/delete actions persist immediately
- local storage failures degrade safely
- malformed stored JSON is handled safely
- malformed API payloads fail gracefully
- deleting the active artifact keeps the editor as an unsaved draft
- snapshot and library deletion are both persisted and tested

## Mobile Responsiveness

We also improved the app for smaller screens by adjusting:

- editor layout breakpoints
- header wrapping behavior
- artifact card spacing
- action button stacking
- typography sizing on smaller devices
- library/share page readability

## Testing Strategy

We added both unit and end-to-end coverage.

### Unit tests cover

- snapshot save/restore/delete
- artifact save/load/delete/save-as-new
- generation success and failure handling
- malformed payload handling
- malformed storage hydration handling

### Playwright tests cover

- editor loading
- prompt persistence
- section editing
- section regeneration
- template switching
- storyboard generation
- snapshot restore and delete
- library save/open/delete
- read-only share view
- save-as-new behavior
- empty prompt disabled state

## How to Run This App Locally

### 1. Clone the repo

```bash
git clone https://github.com/anishcodes-0-9/storyboard-ai.git
cd storyboard-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create an environment file

Create a `.env` file in the project root and add:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Start the app in development mode

```bash
npm run dev:full
```

This starts:

- Vite frontend
- Express backend

### 5. Open the app

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:8787/api/health`

## Available Scripts

- `npm run dev` — Start frontend only
- `npm run dev:server` — Start backend only
- `npm run dev:full` — Start full local app
- `npm run build` — Run production build
- `npm start` — Run production server locally
- `npm run test:unit` — Run unit tests
- `npm run test:e2e` — Run end-to-end tests

## How to Use the App

### Generate a storyboard

1. Open the editor
2. Type a product or business prompt
3. Choose a template
4. Click **Generate storyboard**

### Refine the artifact

- Edit any section manually
- Save the edited content
- Regenerate individual sections if needed
- Drag sections to reorder them
- Save progress
- Click **Save snapshot** to create a restore point
- Restore or delete snapshots from the history panel

### Save artifacts

- Click **Save to library** to save the current artifact
- Click **Save as new** to create a variant entry
- Open the library to manage saved artifacts

### Share or export

- Open a saved artifact in read-only mode
- Copy the output as markdown
- Export the artifact as PDF

## Deployment

The app is prepared to deploy as a single Render web service.

High-level deployment flow:

- Build the Vite frontend
- Serve `dist/` from Express
- Expose the `/api` endpoints from the same server
- Set `OPENAI_API_KEY` in the deployment environment

This keeps frontend and backend under one domain and makes API routing simpler.

## Scope of the Current Version

This version is an MVP with strong foundations.

It is designed to prove:

- AI-generated structured storytelling can be more useful than plain text
- Local-first persistence can support a satisfying workflow
- Editable artifacts are more practical than one-shot generation
- AI writing tools can feel like product tools, not just prompt boxes

### There is a lot we can add next.

## Product features

authentication and cloud sync
team sharing with real URLs
collaborative editing
comments and review mode
artifact tagging and search
favorite/starred artifacts
richer template system
user-defined custom templates
multiple storyboard lengths or detail levels

## AI improvements

faster streaming generation
section-by-section streaming updates
regeneration with style controls
tone presets
prompt suggestions
artifact summarization
multi-model fallback
quality scoring for outputs

## UX improvements

confirm dialogs for destructive actions
richer loading states and progress feedback
undo/redo
keyboard shortcuts
onboarding tips
empty-state guidance
better mobile navigation patterns

## Technical improvements

cloud database persistence
server-side artifact storage
user accounts
analytics and observability
error tracking
lazy loading for heavy export code
better bundle splitting
stronger schema validation
API rate limiting
caching or job queue support for generation
