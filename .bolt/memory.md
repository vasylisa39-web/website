# Project memory

## Product intent & audience

- Economics educational web app ("The Market Lab") with topic-structured pages (e.g., Topic 4 · Intervention → Price Controls).
- Student-level learners; study-note style content: definitions, rules, bulleted rationale, worked examples, real-world scenarios, common mistakes, key takeaways.
- Pages added incrementally following the same structure; existing pages now include Supply & Demand and Price Controls.

## Brand personality & voice

- Clear, instructional, concise; concepts in digestible chunks with real-world examples (rent control, minimum wage, coke/pepsi, café scenarios).

## Visual design & UX direction

- Card-based layout; each concept gets its own card with consistent section styling.
- Collapsibles for secondary detail (e.g., "Common mistakes").
- Example pairs rendered as chips/tags; comparison points as callout components.
- Each page ends with a KeyTakeaway component.
- Icons from lucide-react for section headers and concept markers.
- Interactive simulators (supply/demand, price ceiling/floor with drag controls).
- In-text citations rendered in a lighter navy color to distinguish from body text.
- References section at the bottom of each page, APA-style.

## Decisions, constraints & rationale

- Framework: Vite + React with Tailwind CSS, Lucide React icons, `@/` path alias to `src/`.
- No extra UI/icon packages unless explicitly requested.
- When editing existing pages, preserve all prior text/sections and match existing card/section style.
- Citations added without altering original wording; reference list added at page end.
- Remove unused imports; build verified after edits.

## Open questions & assumptions

- More economics topics likely added as separate pages under "The Market Lab" with topic numbering.
- Primary textbook source: Mankiw & Taylor (2020), Economics (5th ed.); future pages may cite same or additional sources.
- Global navigation structure not yet confirmed beyond individual pages.