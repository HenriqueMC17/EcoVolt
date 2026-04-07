# Contributing to EcoVolt Enterprise

Welcome! As a senior-led project, we maintain high standards for code quality, architectural integrity, and consistency.

## 🚦 Standards & Guidelines

### 1. Git & Commits
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
-   `feat:` New features or UI components.
-   `fix:` Bug fixes or visual anomalies.
-   `refactor:` Structural changes without functional impact.
-   `chore:` Dependency updates, config changes.

### 2. Architecture (FSD)
-   Do **not** import between features. Shared logic belongs in `src/shared`.
-   Keep components focused (SRP). If a component exceeds 200 lines, consider breaking it down.

### 3. UI & Styling
-   Avoid ad-hoc Tailwind classes. Use the design system tokens in `globals.css`.
-   Use `Typography.tsx` components (`Heading`, `Paragraph`) instead of raw `h1`, `p`, etc.
-   All new interactive components must include base ARIA labels.

### 4. Code Quality
-   **Run Linting**: `npm run lint` must pass before any PR.
-   **Type Safety**: Avoid `any`. Use specific types or interfaces.
-   **Verification**: Ensure the build succeeds with `npm run build`.

## 🛠️ Development Workflow

1.  Initialize with `npm install`.
2.  Run dev server: `npm run dev`.
3.  Implement changes following the established patterns.
4.  Verify performance and accessibility.

---

*“Quality is not an act, it is a habit.”*
