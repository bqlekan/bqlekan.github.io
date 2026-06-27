# DESIGN_SYSTEM.md

# Portfolio Design System

This document defines the visual language for the entire portfolio.
Every new component must follow these rules.

------------------------------------------------------------------------

# Design Philosophy

The portfolio should feel:

-   Premium
-   Minimal
-   Technical
-   Elegant
-   Trustworthy
-   Modern
-   Fast
-   Purposeful

Design inspiration:

-   Apple
-   Linear
-   Vercel
-   Stripe
-   Framer
-   Notion

Avoid generic templates, excessive effects, and visual clutter.

------------------------------------------------------------------------

# Color Palette

## Background

-   Primary: #050816
-   Secondary: #0B1226
-   Surface: #121A33

## Accent

-   Electric Blue: #5AA9FF
-   Cyan: #69F0FF
-   Violet: #8B5CF6

## Text

-   Primary: #FFFFFF
-   Secondary: #D6E4FF
-   Muted: #94A3B8

------------------------------------------------------------------------

# Typography

Primary Font: - Inter

Display Font: - Space Grotesk

Scale: - H1: 56--72px - H2: 40--48px - H3: 28--32px - Body: 18px -
Small: 14--16px

Use generous spacing and strong visual hierarchy.

------------------------------------------------------------------------

# Layout

-   Max width: 1320px
-   12-column responsive grid
-   Section spacing: 120--160px
-   Card gap: 24--32px
-   Mobile-first

------------------------------------------------------------------------

# Components

Buttons: - Rounded pill shape - Subtle gradient - Hover elevation -
Visible focus state

Cards: - Glassmorphism - Backdrop blur - Soft border - Large radius -
Layered shadows

Navigation: - Sticky - Glass background - Smooth active state - Mobile
drawer

------------------------------------------------------------------------

# Animation

Libraries: - GSAP - ScrollTrigger - Lenis - Three.js

Timing: - Fast: 0.2s - Standard: 0.4s - Hero reveals: 0.8--1.2s

Animations should support the content, never distract.

------------------------------------------------------------------------

# Background

Use a subtle Three.js scene: - Neural network - Floating particles -
Soft glow - Low GPU impact

------------------------------------------------------------------------

# Icons

Style: - Minimal outline - Consistent stroke - Simple and technical

------------------------------------------------------------------------

# Accessibility

-   WCAG AA contrast
-   Semantic HTML
-   Keyboard navigation
-   Visible focus indicators
-   Respect reduced-motion preferences

------------------------------------------------------------------------

# Performance

-   Lazy-load non-critical assets
-   Optimize images
-   Minimize layout shift
-   Keep Lighthouse target above 95

------------------------------------------------------------------------

# Definition of Done

Before completing any milestone verify:

-   Consistent with this design system
-   Matches PROJECT_RULES.md
-   Matches PERSONAL_BRAND.md
-   Content aligns with the CV
-   Responsive
-   Accessible
-   Production quality

If a design decision conflicts with these rules, prefer consistency and
maintainability.
