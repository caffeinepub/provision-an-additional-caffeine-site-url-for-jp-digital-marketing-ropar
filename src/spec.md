# Specification

## Summary
**Goal:** Clarify the difference between preview vs permanent live publishing, update the default recommended custom domain to jpdigitalmarketing.net, and provide clear DNS instructions to connect the domain.

**Planned changes:**
- Update publishing UI copy to explain that the draft URL is a preview link (may expire) and that “Publish Permanently / Publish to Production” makes the site live permanently.
- Ensure the UI clearly labels and displays the preview/draft URL versus the live/primary production URL after publishing.
- Change the default recommended custom domain in inputs/placeholders/examples from “jpdigitalmarketing.in” to “jpdigitalmarketing.net”, while still allowing user edits and showing an already-configured backend domain when present.
- Add a “Connect your domain” help section on the provisioning/publishing page with manual iFreeDomains DNS instructions (A and CNAME records) and an expected propagation time window.

**User-visible outcome:** Users can understand and perform a permanent production publish, see which link is the preview vs live URL, and follow on-page DNS steps to point jpdigitalmarketing.net to the live site.
