# Vue Review Checks

## Maintainability
- Prefer Composition API for complex state; keep `setup()` focused and modular.
- Use composables to share logic; avoid duplicating business rules across components.
- Use `computed` for derived state; limit `watch` to side effects.
- Avoid mutating props directly; use emits for updates.
- Keep template logic simple; move heavy logic into computed or composables.

## Correctness and Resilience
- Validate route params and external data before use.
- Avoid deep watchers unless necessary; document complex watchers.
- Ensure cleanup for manual subscriptions or event listeners.
- Provide loading, error, and empty states for async data.

## Security
- Avoid `v-html` unless content is sanitized and trusted.
- Sanitize user-controlled URLs and avoid open redirects.

## Performance
- Use stable `:key` values on lists; avoid index keys when order can change.
- Avoid inline object/array creation in templates for hot paths.
- Lazy-load heavy components with async components when appropriate.
- Use `v-once` or `v-memo` only when it reduces real work.

## Accessibility
- Ensure proper labels for form controls and interactive elements.
- Provide keyboard and focus handling for custom components.
- Confirm icon-only actions have accessible names.
