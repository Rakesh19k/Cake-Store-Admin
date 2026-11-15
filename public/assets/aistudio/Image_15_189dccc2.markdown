```markdown
# Design System Specification: The Artisanal Layer

## 1. Overview & Creative North Star: "The Sensory Gallery"
This design system moves away from the rigid, boxed-in layouts of traditional e-commerce. Our Creative North Star is **The Sensory Gallery**. We treat every screen not as a functional grid, but as a curated editorial spread. 

To achieve a "high-end" feel, we embrace **intentional asymmetry** and **tonal depth**. Elements should feel like they are resting on a soft, flour-dusted surface rather than being locked into a digital cage. We use generous white space (breathing room) and overlapping images to mimic the tactile experience of a premium physical lookbook.

---

## 2. Colors & Surface Philosophy
The palette is a sophisticated blend of gourmand tones: creams (Background), botanical pinks (Primary), and cocoa-infused neutrals (Secondary).

### The "No-Line" Rule
**Borders are strictly prohibited for sectioning.** To separate content, you must use background color shifts or spacing. 
*   *Correct:* A `surface-container-low` section sitting on a `surface` background.
*   *Incorrect:* A `1px solid #D4C2C2` line between sections.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine parchment. Use the surface tiers to define importance:
*   **Base:** `surface` (#fff8f6) for the main canvas.
*   **Structural Sections:** `surface-container-low` (#fff0ed) for large background blocks (e.g., a "How we bake" section).
*   **Interactive Elements:** `surface-container-lowest` (#ffffff) for cards or floating menus to provide a "lifted" appearance.

### The "Glass & Gradient" Rule
To add "soul," use subtle gradients for Hero backgrounds. Transitioning from `primary` (#8b4b58) to `primary-container` (#ffbdc8) at a 45-degree angle creates a velvet-like texture. For floating navigation or overlays, use **Glassmorphism**: 
*   `surface` at 70% opacity + `backdrop-blur: 20px`.

---

## 3. Typography: The Editorial Voice
We pair the timeless authority of a modern serif with the effortless legibility of a contemporary sans-serif.

| Level | Token | Font | Size | Character |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Noto Serif | 3.5rem | Elegant, high-contrast. Use for hero titles. |
| **Headline** | `headline-md` | Noto Serif | 1.75rem | Warm and inviting. Use for section headers. |
| **Title** | `title-lg` | Plus Jakarta Sans | 1.375rem | Medium weight. Used for product names. |
| **Body** | `body-lg` | Plus Jakarta Sans | 1rem | Clean, accessible. For descriptions. |
| **Label** | `label-md` | Plus Jakarta Sans | 0.75rem | All-caps, 0.05em tracking for a "boutique" feel. |

*Note: Always use `-0.02em` letter-spacing for Headlines to ensure they feel tight and professional.*

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "tech." We use light and color to create height.

*   **The Layering Principle:** Instead of a shadow, place a `surface-container-highest` (#ffdad2) object on a `surface` background. This creates a natural, soft-focus depth.
*   **Ambient Shadows:** When a float is required (e.g., a "Cart" button), use: `box-shadow: 0 12px 32px rgba(43, 22, 17, 0.06);`. The shadow color is a tint of `on-surface` (#2b1611), never pure black.
*   **The "Ghost Border" Fallback:** If a boundary is required for accessibility, use `outline-variant` (#d4c2c2) at **15% opacity**.

---

## 5. Component Guidelines

### Buttons: The "Soft-Touch" Interaction
*   **Primary:** Background: `primary` (#8b4b58), Text: `on-primary` (#ffffff). Use `lg` (1rem) rounding.
*   **Secondary:** Background: `secondary-container` (#fed3c7), Text: `on-secondary-container` (#795950).
*   **Tertiary:** No background. Text: `primary`. Subtle underline on hover (2px).

### Cards: The Floating Canvas
*   **Rules:** No borders. Use `md` (0.75rem) or `lg` (1rem) rounding. 
*   **Layout:** Encourage "breaking the box"—let product imagery (cakes, pastries) overlap the top edge of the card by 16px-24px to create a 3D effect.

### Input Fields: Minimalist Elegance
*   **Style:** Underline-only or `surface-container-lowest` fills. 
*   **Focus State:** Transition the underline to `primary` (#8b4b58) with a 2px weight. Avoid heavy "glow" effects.

### Special Component: "The Flavor Tag"
*   **Chips:** Use `tertiary-container` (#d4cdbf) with `full` rounding (pill shape). These should feel like small, smooth stones. Use for "Gluten Free" or "Best Seller" labels.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical margins (e.g., 80px left, 120px right) for editorial layouts.
*   **Do** use "Plus Jakarta Sans" for all functional data (prices, weights, buttons).
*   **Do** use `surface-dim` for footers to create a grounded, chocolate-rich "base" for the site.

### Don’t:
*   **Don't** use 100% black (#000000) for text. Use `on-surface` (#2b1611) to maintain warmth.
*   **Don't** use sharp 90-degree corners. Everything must feel "hand-molded."
*   **Don't** use standard dividers. Use a 64px vertical gap or a subtle shift from `surface` to `surface-container-low`.
*   **Don't** over-animate. Transitions should be "Slow & Creamy" (e.g., 400ms ease-out) rather than "Snappy & Robotic."