# System Specification

This document details the technology stack and requirements for the TravelOTA project.

## Tech Stack

- **Framework**: Nuxt 4.3 (Composition API)
- **UI Architecture**: @nuxt/ui v4.4 + Tailwind CSS v4
- **Validation**: Zod v4 (schemas in `app/utils/schemas.ts`)
- **State**: Composables with `useState` (mock data for B2B)
- **Auth**: Simulated via cookie (`travelota-role`)
- **Build**: pnpm
- **Automation**: `/docs-sync` workflow for documentation maintenance.

## Development Requirements

- Node.js (Nuxt 4 compatible version)
- pnpm

## Code Standards
- TypeScript mandatory.
- Components in `PascalCase.vue`.
- Pages in `kebab-case.vue`.
