# Project memory

## Product intent & audience

- Economics educational web app; pages break down concepts (supply & demand, curves, schedules, related goods) for student-level learners.
- Content is study-note style: definitions, rules, bulleted rationale, examples, scenarios, and key takeaways.

## Brand personality & voice

- Clear, instructional, concise; presents economic concepts in digestible chunks with real-world examples (coke/pepsi, coffee/tea, café scenarios).

## Visual design & UX direction

- Card-based layout with consistent section styling; each concept gets its own card.
- Uses collapsibles for secondary detail (e.g., "Common mistakes").
- Example pairs rendered as chips/tags.
- Comparison points rendered as callout components.
- Each page ends with a KeyTakeaway component summarising content.
- Icons from lucide-react used for section headers and concept markers.
- Interactive elements present (e.g., supply/demand simulator).
- Color contrast and spacing follow Tailwind utility patterns already established in the project.

## Decisions, constraints & rationale

- Framework: Vite + React with Tailwind CSS, Lucide React icons, `@/` path alias to `src/`.
- No extra UI/icon packages unless explicitly requested.
- When adding content to existing pages, preserve all prior sections and match existing card/section style.
- Remove unused imports to keep the tree clean.
- Build is verified after edits.

## Open questions & assumptions

- More economics topics likely to be added as separate pages following the same card + key-takeaway pattern.
- No global navigation/structure context yet confirmed beyond the Supply & Demand page.