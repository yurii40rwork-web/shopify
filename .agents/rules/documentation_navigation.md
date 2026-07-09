---
trigger: model_decision
description: When agent has to find certain part of code; understand project architecture.
---

# Workspace Rules: Documentation & Architecture Navigation

This rule guides AI agents on when they must read `README.md` and `agent.md` files to find files and understand the Shopify theme architecture.

---

## 📋 Documentation Reference Triggers

You MUST read the following files before performing coding or design actions:

*   **At Task Initialization / Before Coding**: Read [agent.md](file:///E:/projects/shopify/agent.md) to understand the Shopify theme directory layout, global CSS variables, and theme customization guidelines.
*   **When modifying Theme Layouts & Templates**: Read the base wrappers in [layout/theme.liquid](file:///E:/projects/shopify/layout/theme.liquid) and template JSON structures in `templates/*.json` to maintain structural integrity.
*   **When creating or modifying Sections & Blocks**: Refer to the **Settings Schema Guidelines** in [agent.md](file:///E:/projects/shopify/agent.md) to decide between inline style properties or class properties for customizable options.
*   **When editing styles and stylesheets**: Check [snippets/css-variables.liquid](file:///E:/projects/shopify/snippets/css-variables.liquid) and align styles with the defined theme variables. Avoid introducing raw inline styling rules.

---

## 🏛️ Codebase Safeguards

1.  **No Utility Stylesheets / Tailwind**: Keep styling native. Do not introduce TailwindCSS or other styling framework assets unless explicitly requested.
2.  **Maintain Schema Presets**: When adding customizable sections, always provide standard default presets in the `{% schema %}` declaration so they are loadable via the Shopify Theme Editor.
3.  **Prevent Layout Shifts**: Avoid placing large or non-critical stylesheet files directly above-the-fold. Use `assets/critical.css` for critical layout styles, and load other assets asynchronously.
4.  **Theme Check Validation**: Before finishing tasks, run `shopify theme check` to validate that syntax, Liquid tags, and localization configuration structures are compliant.
