# Primary Assistive Technology Persona

## Thandi Mokoena, 34: non-visual screen reader user

**Role and context:** Payroll administrator at a municipal office. Blind since age 19 (retinal condition). Lives in a township outside Pretoria and books her own and her mother's clinic visits online because the clinic phone line is often engaged. Speaks Sepedi at home and English at work. Comfortable with technology but has low tolerance for pages that waste her time.

*(Fictional persona created for this capstone.)*

## Technical configuration

| Area | Setup |
|---|---|
| Desktop | Windows 11 laptop, Chrome (latest) |
| Screen reader | NVDA with speech rate about 3x normal |
| Mobile | Android phone with TalkBack, Chrome |
| Braille | 40-cell refreshable braille display on the laptop, used for forms and references |
| Connection | Mobile data, capped; slow pages are a real cost |
| Settings | No mouse use, browser zoom unused, high-contrast mode off |

## Input modalities

- **Keyboard only** on the laptop: Tab and Shift+Tab, Enter, Space, arrow keys, Escape.
- **NVDA quick keys** to move by structure: `D` (landmarks), `H` and `1-6` (headings), `F` (form fields), `K` (links), `L` (lists), `T` (tables).
- **Elements list** (`NVDA+F7`) to scan all links or headings before reading.
- **Touch exploration and swipe gestures** with TalkBack on the phone.

## Assistive tools in use

NVDA, TalkBack, a braille display, and keyboard shortcuts. She does not use a mouse, so any control reachable only by hover or click is unusable to her.

## Pain points with conventional web design

1. **Unlabelled or mislabelled controls.** Inputs announced as "edit, blank" mean guessing what to type.
2. **Vague links.** A list of fifteen links that all say "Book now" or "Read more" cannot be told apart when she opens the links list.
3. **Missing landmarks and skipped headings.** Without a `main` landmark or skip link she must listen through the full header and navigation on every page.
4. **Silent updates.** Filtering a list, loading results or showing an error without announcing it leaves her unsure whether anything happened.
5. **Errors shown only in red or only near the submit button.** She never learns which field failed or why.
6. **Focus that disappears or jumps.** Opening a menu or dialog without moving focus into it, or losing her place after closing it.
7. **Keyboard traps and custom widgets** that do not expose role, name or state.
8. **Time pressure.** Sessions that expire while she is filling in a form at her reading speed.

## Primary goals on this portal

1. Find a clinic service quickly, by searching or filtering by urgency, service type and day.
2. Compare results without opening each one, with a clear practitioner, time and a unique "Book ..." link per result.
3. Book an appointment independently, completing every form field with a clear label, instruction and required/optional status.
4. Understand and fix form errors without help: hear a summary of what is wrong, jump to each field, and hear the reason.
5. Know the booking succeeded, with confirmation announced rather than shown only visually.
6. Find urgent and emergency information immediately, in a clearly labelled region.

## Typical scenario

Thandi opens the portal, presses `Tab` once to reach the skip link, and jumps straight to the main content. She presses `D` to check the landmarks (banner, navigation, search, main, complementary, footer), then searches for "General Practice". NVDA announces "Showing 12 results". She presses `H` to move through the result headings, opens the filters, ticks "Same-day triage", and hears the results count update. She activates "Book Standard GP Consultation", fills the form, submits it with a phone number mistake, and hears the error summary first. She follows its first link to the phone field, corrects it and confirms the booking.

## Design implications

| Need | Design response in this project |
|---|---|
| Fast orientation | Skip link, one `h1` per page, ordered headings, named landmarks |
| Distinguish links | Unique accessible name on every result and service link |
| Form completion | Visible `label` for every field, hint text through `aria-describedby`, "(required)" and "(optional)" in text |
| Error recovery | Error summary with links to fields, inline messages with an icon and the word "Error", `aria-invalid` |
| Awareness of updates | `role="status"` results count that exists on page load |
| Keyboard operation | Native links, buttons, `details` and form controls only; visible `:focus-visible` ring |
