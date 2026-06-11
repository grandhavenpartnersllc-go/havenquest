# Build Brief — Nav Logo Alignment Fix

## Objective
Align the nav bar logo's left edge with the hero text content container, so the logo and hero text share a common left margin. The nav bar itself remains full-width. The right-side nav links and CTA button should align to the matching right edge of the same container.

## Problem
The HavenQuest logo in the top nav is sitting too close to the true viewport left edge. The hero text content has proper padding inside a container. These two left edges do not match, creating a misaligned appearance.

## Fix
Find the nav component (likely in `/components/layout/` or similar — check `Navbar`, `Header`, or `Navigation` component files).

The nav bar outer wrapper should remain `w-full` (full viewport width).

The inner nav content wrapper (the div that contains the logo on the left and the links/button on the right) needs to match the site's standard content container padding.

### Target behavior
- Nav inner container: `max-width` matching the rest of the site (likely `max-w-5xl`, `max-w-6xl`, or a custom `max-w-[1080px]`), centered with `mx-auto`, and matching horizontal padding (check what the hero section and below-hero sections use — likely `px-6` or `px-8`).
- Logo: anchored to the left edge of this inner container.
- Nav links + CTA button: anchored to the right edge of this inner container.

### Steps
1. Locate the nav/header component file.
2. Identify the current padding/margin on the nav inner wrapper.
3. Check the hero section and one below-hero section to confirm the content container padding values in use across the site.
4. Apply matching `max-width`, `mx-auto`, and `px-` values to the nav inner wrapper so all three align: logo left edge = hero text left edge = below-hero content left edge.
5. Confirm the nav bar background/border still spans full viewport width — only the inner content is constrained.
6. Verify on desktop viewport. No mobile changes required unless the fix inadvertently breaks mobile nav.

## Acceptance Criteria
- Logo left edge visually aligns with the left edge of the hero headline text.
- Nav links and CTA button right edge aligns with the right edge of the hero content area.
- Nav bar background remains full-width.
- No layout regressions on desktop or mobile.

## Final Step
After confirming changes are complete:
1. Commit all changed files with message: `fix: align nav logo and links to content container`
2. Push to origin/main
3. Confirm Vercel deployment triggered
4. Report back to Claude chat with the component file name changed and the exact padding/max-width values applied.
