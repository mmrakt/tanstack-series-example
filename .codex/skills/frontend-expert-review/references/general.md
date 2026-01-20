# General Frontend Review Checks

## Maintainability (highest priority)
- Confirm clear layering (ui, domain, data, infra) and avoid cross-layer imports.
- Keep components and functions small, single-purpose, and testable.
- Prefer explicit data flow; avoid hidden side effects; centralize effects and IO.
- Enforce consistent state management patterns within a feature area.
- Reduce duplication by extracting shared UI logic or domain rules.
- Use typed contracts for API data; validate external inputs at runtime.
- Keep styling predictable (scoped CSS, design tokens, avoid global overrides).
- Centralize configuration and feature flags with safe defaults.
- Document non-obvious behavior and constraints near the code.

## Correctness and Resilience
- Handle loading, error, and empty states for all data paths.
- Prevent race conditions and stale data; cancel or ignore outdated requests.
- Guard against null/undefined and partial data; use safe fallbacks.
- Ensure cleanup for timers, subscriptions, and event listeners.
- Avoid non-deterministic render output (random IDs, Date.now, Math.random) without hydration-safe handling.
- Validate user input and server responses before use.
- Ensure forms handle submission errors, disabled states, and retry.
- Confirm cross-browser behavior and responsive breakpoints for key flows.

## Security and Privacy
- Avoid rendering untrusted HTML; sanitize before use and prefer safe text nodes.
- Encode or escape user-controlled data before inserting into the DOM or URLs.
- Avoid exposing secrets in client bundles; keep tokens out of localStorage when possible.
- Use secure auth flows (HttpOnly cookies, SameSite, CSRF protections) when applicable.
- Validate and normalize URLs to prevent open redirects or injection.
- Limit third-party scripts, scope their permissions, and prefer Subresource Integrity.
- Review dependency updates for security advisories and supply-chain risk.
- Avoid logging sensitive data in client telemetry.

## Performance
- Watch for unnecessary re-renders and heavy work in render paths.
- Use virtualization for large lists and avoid deep component trees.
- Minimize bundle size with code splitting, tree shaking, and lazy loading.
- Optimize images and media (responsive sizes, modern formats, lazy loading).
- Avoid layout thrashing; prefer CSS animations and batch reads/writes.
- Monitor Web Vitals (LCP, INP, CLS, TTFB) and identify regressions.
- Defer non-critical scripts and third-party widgets.
- Use caching for data and assets with sensible invalidation.

## Accessibility
- Use semantic elements and correct heading order.
- Provide labels, instructions, and error messages for forms.
- Ensure keyboard navigation and visible focus indicators.
- Provide accessible names for icons and custom controls.
- Manage focus for dialogs, popovers, and route changes.
- Respect reduced motion and color contrast requirements.
- Support zoom and text scaling without loss of functionality.
