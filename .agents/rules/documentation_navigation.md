---
trigger: model_decision
description: When agent has to find certain part of code; understand project architecture.
---

# Workspace Rules: Documentation & Architecture Navigation

This rule guides AI agents on how to navigate the Shopify theme directory layout, trace the flow of components, and locate target files efficiently for edits.

---

## 📋 Documentation Reference Triggers

You MUST read the following files before performing coding or design actions:

*   **At Task Initialization / Before Coding**: Read [agent.md](agent.md) to understand the Shopify theme directory layout, global CSS variables, and theme customization guidelines.
*   **When modifying Theme Layouts & Templates**: Read the base wrappers in [layout/theme.liquid](file:///E:/projects/shopify/layout/theme.liquid) and template JSON structures in `templates/*.json` to maintain structural integrity.
*   **When creating or modifying Sections & Blocks**: Refer to the **Settings Schema Guidelines** in [agent.md](agent.md) to decide between inline style properties or class properties for customizable options.
*   **When editing styles and stylesheets**: Check [snippets/css-variables.liquid](file:///E:/projects/shopify/snippets/css-variables.liquid) and align styles with the defined theme variables. Avoid introducing raw inline styling rules.

---

## 🏛️ Codebase Safeguards

1.  **No Utility Stylesheets / Tailwind**: Keep styling native. Do not introduce TailwindCSS or other styling framework assets unless explicitly requested.
2.  **Maintain Schema Presets**: When adding customizable sections, always provide standard default presets in the `{% schema %}` declaration so they are loadable via the Shopify Theme Editor.
3.  **Prevent Layout Shifts**: Avoid placing large or non-critical stylesheet files directly above-the-fold. Use [assets/critical.css](file:///E:/projects/shopify/assets/critical.css) for critical layout styles, and load other assets asynchronously.
4.  **Theme Check Validation**: Before finishing tasks, run `shopify theme check` to validate that syntax, Liquid tags, and localization configuration structures are compliant.

---

## 🗺️ Codebase File Map & Navigation Paths

Refer to this directory map to locate specific code patterns and components:

### 1. Global Setup & Configurations
*   **Global CSS Custom Properties**: Injected via [snippets/css-variables.liquid](file:///E:/projects/shopify/snippets/css-variables.liquid). Defines variables for `--font-primary--family`, `--color-background`, `--color-foreground`, `--page-width`, etc.
*   **Merchant Theme Settings Schema**: [config/settings_schema.json](file:///E:/projects/shopify/config/settings_schema.json) declares the customize panels available inside the Shopify admin theme editor.
*   **Active Settings Values**: [config/settings_data.json](file:///E:/projects/shopify/config/settings_data.json) contains saved settings and active configurations.
*   **Global Layout Wrapper**: [layout/theme.liquid](file:///E:/projects/shopify/layout/theme.liquid) serves as the primary wrapper, rendering the header, announcements, main page content (`content_for_layout`), cart drawer, and footer.

### 2. Stylesheets & Javascript Scripts
*   **Above-the-Fold Critical CSS**: [assets/critical.css](file:///E:/projects/shopify/assets/critical.css) contains root variables, resets, and layout skeletons preloaded immediately to prevent cumulative layout shift (CLS).
*   **Theme Styles & Section Rules**: [assets/avemos-style.css](file:///E:/projects/shopify/assets/avemos-style.css) contains core styling for UI elements like review cards, custom buttons, comparison tables, cart elements, and forms.
*   **Theme Interactions & Scripts**: [assets/avemos-script.js](file:///E:/projects/shopify/assets/avemos-script.js) manages interactive behaviors such as cart drawers opening/closing, dynamic updates, FAQ accordions, and customer sliders.

### 3. Reusable Template Snippets
*   **Header Content**: [snippets/avemos-header-markup.liquid](file:///E:/projects/shopify/snippets/avemos-header-markup.liquid) defines the links, brand logo wrapper, and shopping bag button inside headers.
*   **Dynamic Image Renderer**: [snippets/image.liquid](file:///E:/projects/shopify/snippets/image.liquid) is used to load and output responsive image tags.
*   **SEO Metadata**: [snippets/meta-tags.liquid](file:///E:/projects/shopify/snippets/meta-tags.liquid) sets titles, meta descriptions, and open-graph properties.

### 4. Page Policies & Static Snippets
*   **About Us Content**: [snippets/about-us-content.liquid](file:///E:/projects/shopify/snippets/about-us-content.liquid)
*   **Contact Us Form Content**: [snippets/contact-us-content.liquid](file:///E:/projects/shopify/snippets/contact-us-content.liquid)
*   **Shipping Terms**: [snippets/shipping-policy-content.liquid](file:///E:/projects/shopify/snippets/shipping-policy-content.liquid)
*   **Refund/Return Terms**: [snippets/refund-policy-content.liquid](file:///E:/projects/shopify/snippets/refund-policy-content.liquid)
*   **Terms of Service**: [snippets/terms-of-service-content.liquid](file:///E:/projects/shopify/snippets/terms-of-service-content.liquid)
*   **User Agreement**: [snippets/user-agreement-content.liquid](file:///E:/projects/shopify/snippets/user-agreement-content.liquid)

---

## 🛠️ Common Navigation Tasks & Recipes

Use the following step-by-step recipes to find files based on your current task:

| Task / Goal | Primary Files to View / Edit | Secondary Configuration Files |
| :--- | :--- | :--- |
| **Modify site colors / fonts / layouts** | 1. [snippets/css-variables.liquid](file:///E:/projects/shopify/snippets/css-variables.liquid)<br>2. [assets/critical.css](file:///E:/projects/shopify/assets/critical.css) | 1. [config/settings_schema.json](file:///E:/projects/shopify/config/settings_schema.json)<br>2. [config/settings_data.json](file:///E:/projects/shopify/config/settings_data.json) |
| **Edit Header / Navigation / Logo** | 1. [sections/avemos-header.liquid](file:///E:/projects/shopify/sections/avemos-header.liquid)<br>2. [snippets/avemos-header-markup.liquid](file:///E:/projects/shopify/snippets/avemos-header-markup.liquid) | 1. [assets/avemos-style.css](file:///E:/projects/shopify/assets/avemos-style.css) (search `.header` or `.announcement-bar`) |
| **Add / Edit custom homepage sections** | 1. `sections/avemos-*.liquid` (e.g. [sections/avemos-reviews.liquid](file:///E:/projects/shopify/sections/avemos-reviews.liquid)) | 1. [templates/index.json](file:///E:/projects/shopify/templates/index.json) (under `sections` dict) |
| **Modify policies / static terms** | 1. [sections/policy-page.liquid](file:///E:/projects/shopify/sections/policy-page.liquid)<br>2. `snippets/*-content.liquid` (e.g., [snippets/shipping-policy-content.liquid](file:///E:/projects/shopify/snippets/shipping-policy-content.liquid)) | 1. [templates/page.shipping-policy.json](file:///E:/projects/shopify/templates/page.shipping-policy.json) |
| **Debug / Modify Shopping Cart & Drawer** | 1. [sections/cart-drawer.liquid](file:///E:/projects/shopify/sections/cart-drawer.liquid)<br>2. [sections/cart.liquid](file:///E:/projects/shopify/sections/cart.liquid) | 1. [assets/avemos-script.js](file:///E:/projects/shopify/assets/avemos-script.js) (look for drawer handles)<br>2. [assets/avemos-style.css](file:///E:/projects/shopify/assets/avemos-style.css) |
| **Adjust Product Details / Main Display** | 1. [sections/product.liquid](file:///E:/projects/shopify/sections/product.liquid) | 1. [templates/product.json](file:///E:/projects/shopify/templates/product.json) |
| **Style overrides & Interactive actions** | 1. [assets/avemos-style.css](file:///E:/projects/shopify/assets/avemos-style.css)<br>2. [assets/avemos-script.js](file:///E:/projects/shopify/assets/avemos-script.js) | 1. [layout/theme.liquid](file:///E:/projects/shopify/layout/theme.liquid) (loads files in HTML header) |

---

## ⚡ Navigation Pro-Tips
*   **Search for Class Names**: If you are troubleshooting a UI issue, search for the CSS class in [assets/avemos-style.css](file:///E:/projects/shopify/assets/avemos-style.css) to find how styles are declared.
*   **Match Liquid Styles**: When reading section liquid files, check the bottom for custom style tags `{% stylesheet %}` or javascript `{% javascript %}` tags which package styles/scripts locally to the section.
