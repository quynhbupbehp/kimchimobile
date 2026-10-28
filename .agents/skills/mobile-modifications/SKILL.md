---
name: mobile-modifications
description: >-
  Skill guiding agents to apply changes only to the mobile version of the application, ensuring the desktop web UI remains untouched.
---

# Mobile‑Only Modification Skill

## Purpose
- Provide explicit instructions for making code changes that affect **only** the mobile interface.
- Prevent any accidental modifications to desktop‑oriented files such as `index.html`, global CSS, or shared JavaScript.

## Scope
- Target directory: `q:/Gemini/mobile/` (or any sub‑directory under it).
- Allowed file types: `*.css` (mobile‑specific styles), `*.js` (mobile scripts), `*.html` inside a mobile‑only folder.
- **Never** edit files outside this path.

## Guidelines
1. **Check the target path** before editing. If the path does not start with `q:/Gemini/mobile/`, abort and ask for clarification.
2. **Use media queries** in existing CSS rather than editing global styles.
3. **Create separate mobile files** (e.g., `mobile.css`, `mobile.js`) when new styling or logic is required.
4. **Testing**: Verify changes on a mobile viewport (≤ 768 px) and confirm the desktop view renders identically to the pre‑change version.
5. **Review**: Run a diff against the original desktop files to ensure no unintended modifications.

## Enforcement
- Agents must **ask for clarification** if a requested change could affect non‑mobile files.
- Any accidental edit outside the mobile directory must be **reverted immediately** and reported.

*This skill is stored in `.agents/skills/mobile-modifications/SKILL.md` and will be consulted before any code modification on the mobile interface.*
