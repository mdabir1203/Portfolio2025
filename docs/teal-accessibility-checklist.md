# Teal Palette Accessibility Checklist

Use this checklist to verify the teal-driven interface complies with accessibility best practices.

## Contrast & Legibility
- [ ] Confirm body text (`#FAFAFA` on dark teal backgrounds) meets WCAG AA contrast (≥ 4.5:1) using a contrast checker.
- [ ] Validate large headings and accent text using `#009688`, `#4DB6AC`, and `#FF7043` surpass AA contrast when placed on their backgrounds.
- [ ] Ensure interactive states (hover, focus, active) remain contrast-compliant; test gradients and translucent overlays.
- [ ] Check form placeholders and helper text for sufficient contrast against input backgrounds.

## States & Feedback
- [ ] Review success (`#4DB6AC`), info (`#009688`), and warning (`#FF7043`) alerts for clarity and readability.
- [ ] Verify error text on teal backgrounds remains legible, especially when combined with iconography.
- [ ] Confirm disabled controls have clearly reduced contrast while staying distinguishable from active states.

## Color Dependence
- [ ] Use color-blindness simulators (protanopia, deuteranopia, tritanopia) to ensure critical information is not conveyed by hue alone.
- [ ] Provide iconography, patterns, or text labels in addition to color for status badges and alerts.
- [ ] Check gradients for adequate value contrast so users with low vision can differentiate sections.

## Interaction & Focus
- [ ] Inspect keyboard focus rings (light aqua outline) to ensure they remain visible against every surface.
- [ ] Validate focus order and ensure focus indicators appear on interactive cards, tabs, and links.
- [ ] Confirm hover and active transitions do not rely solely on subtle color shifts; pair with scale or shadow cues.

## Documentation & Testing
- [ ] Document approved color pairs and gradient recipes so new UI components stay on-brand and accessible.
- [ ] Include automated tests (e.g., axe, Lighthouse) in the CI pipeline to catch contrast regressions.
- [ ] Schedule manual audits at least once per release to test real content with the teal palette.
