# System Architecture

## Core Framework
- **Nuxt 4.3**: Using the `app/` directory structure.
- **Vue 3**: Composition API with `<script setup>`.

## UI & Styling
- **@nuxt/ui v4.4**: Based on Reka UI.
- **Tailwind CSS v4**: Configured via `app/assets/css/main.css`.
- **Motion-v**: For animations and micro-interactions.

## State and Data
- **Composables**: Reactive state management using `useState` and `ref`.
- **Mock Data**: Currently, the entire system operates with simulated data in composables.
- **Zod**: Schema validation in `app/utils/schemas.ts`.

## Agent Workflow
- **Rules**: Defined in `.agent/rules/`.
- **Workflows**: Defined in `.agent/workflows/`.
- **Artifacts**: Organized structure in `.agent/artifacts/`:
  - `brainstorms/`
  - `plans/`
  - `executions/`
  - `reviews/`
