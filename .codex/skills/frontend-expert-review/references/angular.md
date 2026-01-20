# Angular Review Checks

## Maintainability
- Prefer standalone components and directives when available to reduce module complexity.
- Use `OnPush` change detection for components with immutable inputs.
- Keep services focused; avoid circular dependencies via shared modules.
- Use typed reactive forms and shared validators; avoid `any` in form models.
- Keep template expressions simple; move heavy logic to the component or a pipe.

## Correctness and Resilience
- Use `trackBy` in `*ngFor` for stable list rendering.
- Clean up subscriptions with `async` pipe, `takeUntilDestroyed`, or equivalent patterns.
- Avoid direct DOM manipulation unless required; prefer Angular APIs.
- Validate route params and resolver data before use.
- Ensure error and empty states are handled for all data sources.

## Security
- Avoid `bypassSecurityTrust*` unless content is fully controlled and sanitized.
- Sanitize user-supplied HTML, URLs, and style values before binding.
- Prevent open redirects when using router navigation with dynamic URLs.

## Performance
- Prefer `async` pipe instead of manual subscription management where possible.
- Lazy-load feature areas and large routes.
- Avoid expensive change detection by keeping inputs immutable and minimizing template work.
- Use image optimization (`ngOptimizedImage`) where supported.

## Accessibility
- Ensure correct `aria-*` attributes for custom components.
- Provide focus management for dialogs and overlays.
- Use proper labels and error messaging for form controls.
