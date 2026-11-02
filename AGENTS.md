<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Instructions & Global Guidelines

## 🔴 STRICT RULE: English Language Only Across Entire Application

1. **Strictly English Only**:
   - ALL text content, headings, paragraphs, descriptions, labels, placeholders, buttons, links, error messages, toast alerts, success messages, email notifications, modal dialogs, and 404/error fallback pages across the entire website MUST be written in **100% professional, clean, modern English**.
2. **Zero Non-English Text**:
   - Under **NO** circumstances should Bengali, Hindi, or any other language be hardcoded, rendered, returned in API errors, or used as interface content on the website.
3. **Professional Tone**:
   - Every user-facing sentence must follow clear, high-standard professional English suitable for a production SaaS platform.

## 🔴 STRICT RULE: Zero Browser Native Dialogs (`alert`, `confirm`, `prompt`)

1. **Strictly Forbidden Native Dialogs**:
   - NEVER use `window.alert()`, `alert()`, `window.confirm()`, `confirm()`, `window.prompt()`, or `prompt()` anywhere in the application. Browser default dialogs look unpolished, block the main UI thread, and harm user experience.
2. **Use Custom Components Only**:
   - For notifications, feedback, and non-blocking messages: Use the custom toast notification hook `useToast()` (`showToast(message, 'success' | 'error' | 'info')`).
   - For confirmations (e.g. deletions, disconnections, destructive actions): Use the project's custom dialog component `<ConfirmModal />` (`@/components/ConfirmModal`) or bespoke in-page modals with custom styling, backdrop blur, and accessible buttons.
   - For prompts / input dialogs: Use custom React modal dialogs with form inputs and proper validation.


