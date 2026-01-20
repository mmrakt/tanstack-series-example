# Next.js Review Checks

## Maintainability
- Prefer the App Router for new work; keep Server Components as the default.
- Minimize `use client` boundaries; keep client components small and leaf-most.
- Keep server-only modules (`server-only`, `next/headers`, `next/cookies`) out of client bundles.
- Separate data fetching/mutations from rendering; prefer server-side data flow.
- Keep route structure clear and use colocation thoughtfully.

## Correctness and Resilience
- Validate route params and search params before use; handle `notFound` and `redirect` paths explicitly.
- Treat Route Handlers and Server Actions as public endpoints; enforce auth, validation, and rate limits.
- Be explicit with caching and revalidation; avoid relying on defaults for data freshness.
- Route Handlers are not cached by default; opt in to caching for `GET` when needed.
- Use `revalidatePath`/`revalidateTag` or segment config to keep stale data in sync.
- Handle error, loading, and empty states for async paths.

## Security
- Keep secrets on the server; avoid exposing them via `NEXT_PUBLIC_` unless truly public.
- Validate and normalize URLs to prevent open redirects.
- Avoid streaming or returning sensitive data from Server Actions or Route Handlers without proper checks.

## Performance
- Prefer server rendering and streaming to keep client bundles small.
- Use dynamic imports for large client-only modules.
- Optimize images and media with `next/image` and responsive sizing.
- Avoid waterfall data fetching; fetch in parallel on the server where possible.

## Accessibility
- Ensure interactive elements are semantic and keyboard accessible.
- Manage focus for dialogs, popovers, and route transitions.
- Verify icon-only actions have accessible names.
