# Mobile‑Only Modification Rule

**Purpose**: Ensure that all future code changes target only the mobile version of the application. The desktop/web interface must remain untouched.

## Scope
- Applies to any file edits, additions, or deletions performed under the `mobile/` directory.
- Prohibits changes to files outside this directory, including but not limited to:
  - `index.html` (desktop layout)
  - Global CSS/JS files not specific to mobile.
  - Assets used by the desktop site.

## Guidelines
1. **Target Directory**: All modifications must be confined to `q:/Gemini/mobile/` (or its sub‑folders). Use media‑query‑specific CSS or separate mobile components.
2. **File Types**: Allowed file types include:
   - `*.css` (mobile‑specific stylesheet, e.g., `mobile.css`)
   - `*.js` (mobile‑specific scripts)
   - `*.html` inside a mobile‑only folder.
3. **Review Process**:
   - Before committing, verify that **no lines** in desktop files have been altered.
   - Run a diff check against the original desktop files to confirm no unintended changes.
4. **Testing**:
   - Test changes on a mobile viewport (≤ 768px) using browser dev tools.
   - Ensure desktop layout renders exactly as before.

## Enforcement
- Agents must **ask for clarification** if a requested change could affect desktop files.
- Any accidental edit to non‑mobile files should be **reverted immediately** and reported.

*This rule is added to the `.agents/rules` directory and will be consulted by automated tooling before any code modification.*
