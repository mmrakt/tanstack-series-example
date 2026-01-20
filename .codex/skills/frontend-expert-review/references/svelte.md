# Svelte Review Checks

## Maintainability
- Keep reactive statements small and predictable; avoid hidden side effects.
- Use stores for shared state and document store contracts.
- Prefer derived stores or `$:` for computed state instead of duplicating data.
- Ensure `onMount` and `onDestroy` cleanup is correct for subscriptions and timers.

## Correctness and Resilience
- Reassign arrays and objects to trigger reactivity after mutation.
- Avoid stale closures in event handlers and reactive blocks.
- Provide loading, error, and empty states for async data.
- In SvelteKit, prefer `load` for data needed during SSR instead of `onMount`.

## Security
- Avoid `{@html}` unless content is sanitized and trusted.
- Validate inputs before binding to the DOM or URLs.

## Performance
- Use keyed `each` blocks for dynamic lists.
- Avoid large computations in reactive blocks without memoization or splitting.
- Prefer lazy loading for heavy routes or components.
- Limit unnecessary store updates that trigger global re-renders.

## Accessibility
- Address Svelte a11y warnings; do not silence them without rationale.
- Ensure focus management for dialogs, menus, and popovers.
- Provide accessible names for icon-only controls.
