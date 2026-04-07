# EcoVolt – Architecture & Design System

This document outlines the architectural patterns and design principles governing the EcoVolt Enterprise platform.

## 🏗️ Architecture: Feature-Sliced Design (FSD)

We follow a modified **Feature-Sliced Design** pattern to ensure scalability, ease of testing, and clear boundaries between domain logic and shared infrastructure.

### Layers

1.  **App (`src/app/`)**: The entry point of the application. Contains global providers, layouts, and the main routing logic (Next.js App Router).
2.  **Features (`src/features/`)**: High-level modules that contain domain-specific logic and UI. Each feature is self-contained (e.g., `hero`, `discovery`, `conversion`).
3.  **Shared (`src/shared/`)**: Reusable infrastructure that is agnostic of any specific feature.
    -   **UI**: Atomic components (Button, Badge, Typography).
    -   **Components**: Layout-related shared components (Navbar, Footer, Section).
    -   **Lib**: Utilities, theme configuration (Tailwind/Framer), and constants.
    -   **Hooks**: Reusable React hooks.

## 🎨 Design System: "Luxury Enterprise"

The visual language of EcoVolt is built on the **Aesthetics-UX-Pro-Max** philosophy.

### Design Tokens

-   **Color Palette**: Primarily uses **OKLCH** color variables defined in `globals.css` for superior color gamut and transitions.
-   **Typography**: Centered around a specialized `Typography.tsx` system using `Geist Sans`, featuring `Heading`, `Subheading`, and `Paragraph` components.
-   **Glassmorphism**: Standardized via `.glass-dark` and `.glass-emerald` utilities, providing consistent depth and blur across the application.

## ⚙️ Performance & Core Web Vitals

-   **Lazy Loading**: All non-critical sections in `page.tsx` are dynamically imported to ensure `Initial Load` and `LCP` remain optimal.
-   **Animation Orchestration**: Framer Motion is used with premium easing (`[0.16, 1, 0.3, 1]`) to ensure interactions feel weighted and professional.
-   **SVG Optimization**: Logos and icons are implemented as clean, optimized SVGs to minimize payload.

## 🔒 Security & Data Integrity

-   **Schema Validation**: All data entry (e.g., `ContactForm`) is strictly validated using **Zod** and **React Hook Form**.
-   **Sanitization**: Input fields are sanitized before processing to prevent common vulnerabilities.
