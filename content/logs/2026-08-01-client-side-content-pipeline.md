---
title: "ADR: Client-Side Markdown Pipeline for the Lab Logs Section"
date: "2026-08-01"
type: "adr"
status: "Resolved"
pillars: ["Portfolio", "Infrastructure"]
tags: ["vite", "markdown", "architecture"]
---

## Decision

Render Lab Logs entries with a client-side content pipeline built on
`import.meta.glob`, rather than introducing a server-rendered framework
(Next.js/Astro) or a custom Node build script.

## Context

The site is a Vite + React SPA deployed as static assets to Cloudflare
(no Node runtime at request time, `not_found_handling: single-page-application`
in `wrangler.jsonc`). Any "read files from disk" step has to happen either
at build time or in the browser — there is no server to do it per-request.

## Options Considered

1. **Migrate to Astro/Next.js** — gives native content collections and
   SSG, but rewrites routing, layout, and deployment for a single new
   section. Disproportionate for the ask.
2. **Custom Node prebuild script** — a `scripts/build-logs.mjs` step that
   writes a generated JSON blob before `vite build`. Viable, but adds a
   build step to maintain and a generated-file lifecycle to reason about.
3. **`import.meta.glob` + client-side `unified`/`remark`/`rehype`** — Vite
   natively globs and eagerly imports the raw `.md` files as strings,
   dev-server HMR picks up new files for free, and parsing/highlighting
   happens once per module load in the browser.

## Outcome

Went with option 3. Content volume for a personal engineering journal is
small enough that synchronous client-side parsing is effectively free,
and it avoids a second build pipeline. `rehype-highlight` was chosen over
Shiki specifically because it's synchronous — Shiki's async highlighter
init would otherwise force `src/lib/logs.ts` into a promise-based API for
no real benefit at this scale.

If content volume grows into the hundreds of entries, revisit with a
build-time generation step.
