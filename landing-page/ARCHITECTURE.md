# EcoVolt – Architecture & Design System

This document is the **authoritative reference** for the architectural patterns, directory conventions, and design principles governing the EcoVolt Enterprise platform. All contributors (human and AI) must align with the standards defined here.

---

## 🏗️ Architecture: Feature-Sliced Design (FSD)

We follow a modified **Feature-Sliced Design (FSD)** pattern to ensure scalability, testability, and explicit boundaries between domain logic and shared infrastructure.

### Directory Structure

```
src/
├── app/                    # App layer — Next.js App Router entry point
│   ├── layout.tsx          # Root layout with global providers
│   ├── page.tsx            # Home page with dynamic imports
│   ├── providers/          # Global React providers (ThemeProvider)
│   └── (routes)/           # Feature-specific pages (product, legal, etc.)
│
├── features/               # Feature layer — isolated domain modules
│   ├── hero/               # Hero section (CTA, animations)
│   ├── discovery/          # How-it-works / solution overview
│   ├── conversion/         # Social proof, CTA blocks
│   ├── lead-submission/    # Contact form (react-hook-form + zod)
│   ├── support/            # FAQ, docs, support flows
│   └── motion/             # MotionProvider (LazyMotion/domAnimation)
│
├── widgets/                # Widget layer — global, reusable compositions
│   └── Layout/
│       ├── Navbar.tsx      # Global navigation (scroll-aware, theme toggle)
│       └── Footer.tsx      # Global footer (links from constants.tsx)
│
└── shared/                 # Shared layer — pure, feature-agnostic infrastructure
    ├── ui/                 # Atomic design system components (Button, Badge, Typography)
    ├── components/         # Layout primitives (Section, etc.)
    └── lib/
        ├── constants.tsx   # NAV_LINKS, FOOTER_LINKS, BENEFITS_DATA
        ├── theme.ts        # Animation easings, timing constants
        └── utils.ts        # cn(), and other pure utilities
```

### Layer Boundaries (Strict)

| Layer | Can import from | Cannot import from |
|---|---|---|
| `app` | `features`, `widgets`, `shared` | — |
| `features` | `shared` | other `features`, `widgets`, `app` |
| `widgets` | `features`, `shared` | `app` |
| `shared` | — | everything else |

> **Golden Rule:** Arrows flow downward only. `shared` is dependency-free. `features` are isolated from each other to prevent implicit coupling.

---

## 🎨 Design System: "Luxury Enterprise"

The visual language of EcoVolt is built on the **Aesthetics-UX-Pro-Max** philosophy.

### Design Tokens

- **Color Palette**: OKLCH color variables in `globals.css` — superior gamut and perceptual uniformity.
- **Typography**: `Typography.tsx` system using `Geist Sans` (`Heading`, `Subheading`, `Paragraph`).
- **Glassmorphism**: Standardized via `.glass-dark` and `.glass-emerald` utilities.
- **Motion**: Premium cubic bezier easing `[0.16, 1, 0.3, 1]` — cinematic "orchestrated entry" pattern.

---

## ⚙️ Performance & Core Web Vitals

- **Lazy Loading**: All non-critical feature sections in `page.tsx` use `next/dynamic` to protect LCP (target: < 1.2s).
- **Bundle Optimization**: Framer Motion runs via `LazyMotion` + `domAnimation` (avoids loading the full bundle).
- **SVG Optimization**: All icons/logos are clean inline SVGs to minimize payload.
- **Image Strategy**: `next/image` with correct `priority` flags on above-the-fold visuals.

---

## 🔒 Security & Data Integrity

- **Schema Validation**: All user-facing data entry validated with **Zod** + **React Hook Form**.
- **Sanitization**: Inputs sanitized before server action processing.
- **No Secrets in Client**: All env vars exposed to the client are prefixed `NEXT_PUBLIC_` and contain no sensitive material.

---

## 🛠️ Developer Governance

### Git Strategy
- **Branch model**: `feature/*`, `fix/*`, `refactor/*` → PR → squash merge to `main`.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`).

### Quality Gates (CI)
- **Pre-commit**: `lint-staged` via Husky — runs ESLint + Prettier on staged files.
- **Type checking**: `tsc --noEmit` enforced before any merge to `main`.

### Key Conventions
- Components: PascalCase. Utilities/hooks: camelCase.
- All shared navigation data lives in `shared/lib/constants.tsx` — **no hardcoded strings in components**.
- Global layout wrappers (Navbar/Footer) live exclusively in `widgets/Layout/` — never duplicated in `shared/components/`.
