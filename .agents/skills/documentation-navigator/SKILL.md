---
name: documentation-navigator
description: Guides the agent on when to read README.md and agent.md to locate files and understand the Shopify theme project architecture.
---

# Skill: Codebase Navigation & Architecture Reference

This skill ensures AI agents read the project's documentation ([README.md](file:///E:/projects/shopify/README.md) and [agent.md](file:///E:/projects/shopify/agent.md) files) to maintain architectural integrity, follow styling guidelines, and use defined file paths.

## 📋 Mandatory Documentation Read Triggers

Before modifying code or creating new files, you must check the following documents:

### 1. Project Initialization & Architecture
*   **Action**: Read [agent.md](file:///E:/projects/shopify/agent.md) in the project root.
*   **Why**: To understand layout flows, global styling variables, and schema design patterns before adding or modifying theme components.

### 2. Core Layouts & JSON Templates
*   **Action**: Read base wrappers in [layout/theme.liquid](file:///E:/projects/shopify/layout/theme.liquid) and templates JSON configuration in `templates/*.json`.
*   **Why**: To ensure sections and blocks are registered and rendered correctly.

### 3. Global CSS Variables & Styling
*   **Action**: Read [snippets/css-variables.liquid](file:///E:/projects/shopify/snippets/css-variables.liquid).
*   **Why**: To match border radius, page widths, font families, and color settings from the merchant's theme settings.

### 4. Rule-Based Task Navigation
*   **Action**: Cross-reference the navigation rules in [documentation_navigation.md](file:///E:/projects/shopify/.agents/rules/documentation_navigation.md).
*   **Why**: To quickly identify the files mapped to specific features (e.g. Header, Policies, Shopping Cart, or Product pages).

---

## 🏛️ Architecture Constraints & Safeguards

*   **Styling Tokens**: Do not use ad-hoc inline styles or raw colors. Always use CSS variables.
*   **Schema Consistency**: For settings mapping to single CSS rules, use custom property injections. For multi-property adjustments, use custom classes.
*   **Clean Assets**: Keep critical styling separate in [assets/critical.css](file:///E:/projects/shopify/assets/critical.css) and use [assets/avemos-style.css](file:///E:/projects/shopify/assets/avemos-style.css) for overall overrides.
*   **Validation**: Make sure to check theme syntax and liquid rules via `shopify theme check` to ensure correctness.
