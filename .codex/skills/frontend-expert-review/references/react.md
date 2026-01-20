# React Review Checks

## Maintainability
- Keep components and hooks pure; avoid side effects during render.
- Keep state minimal; derive values instead of duplicating state.
- Prefer clear boundaries between UI, state, and data fetching logic.
- Use context or state libraries sparingly and only when prop threading is excessive.
- Keep component APIs typed and stable; avoid `any` in shared interfaces.

## Correctness and Resilience
- Follow the Rules of Hooks; never call hooks conditionally.
- Ensure effect dependencies are complete; avoid stale closures with functional updates.
- Clean up subscriptions, timers, and event listeners in effects.
- Use stable keys for lists; avoid index keys when order can change.
- Avoid creating uncached promises in render when using Suspense or `use`.

## Security
- Avoid `dangerouslySetInnerHTML` unless content is sanitized and trusted.
- Validate and normalize user-controlled URLs before rendering links.
- Stay current with React security advisories, especially for Server Components packages.

## Performance
- Prefer React Compiler for memoization; avoid blanket manual `useMemo`, `useCallback`, and `React.memo` unless you have evidence it helps.
- Treat manual memoization as an escape hatch (for precise control or effect dependencies); keep dependencies complete so the compiler can reason about data flow.
- For existing codebases, avoid removing manual memoization without testing since it can change compiler output.
- Avoid heavy computation in render; move work to memoized selectors or web workers when needed.
- Use transitions for non-urgent updates to keep input responsive.
- Virtualize large lists and avoid deep component trees.

## Accessibility
- Use semantic elements for interactive controls.
- Provide labels, descriptions, and error messaging for form fields.
- Ensure keyboard navigation and visible focus indicators.
- Provide accessible names for icon-only controls.
