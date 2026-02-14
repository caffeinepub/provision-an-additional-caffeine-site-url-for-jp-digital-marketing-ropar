# Specification

## Summary
**Goal:** Switch the provisioning/publishing UI’s default and example custom domain from `jpdigitalmarketing.net` to `jpdigitalmarketing.in`.

**Planned changes:**
- Update the frontend default custom domain value to `jpdigitalmarketing.in` when no custom domain is configured by the backend.
- Replace all user-facing example text in the provisioning/publishing UI that references `jpdigitalmarketing.net` to instead reference `jpdigitalmarketing.in` (including alerts and descriptions).
- Ensure the “Delete/Reset site configuration” action resets the custom domain input back to the default `jpdigitalmarketing.in` and reflects the unconfigured/offline state.

**User-visible outcome:** When no custom domain is configured (including after a reset), the UI pre-fills `jpdigitalmarketing.in` and all example/help text shows `.in` instead of `.net`.
