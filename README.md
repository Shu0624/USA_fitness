# USA Supplement (myusa.life) Redesign Prototype & Shopify Section

This directory contains the files for the premium, brand-focused single-product redesign for USA Supplement.

## 📂 Project Structure

```
├── index.html                  # Core HTML5 page structure for local static preview
├── style.css                   # Vanilla CSS stylesheet containing the Obsidian Neo-Vibrant variables and layouts
├── app.js                      # JavaScript logic for scroll-active nav, accordions, and interactive flavor-switching
├── wildfire-redesign.liquid    # Production-ready Shopify OS 2.0 Section template file
└── assets/                     # High-fidelity visual assets (athlete background and product tub renders)
    ├── athlete_hero_bg.png     # Custom generated cinematic athlete banner
    └── wildfire_tub.png        # Custom generated premium matte-black supplement tub
```

---

## ⚡ 1. Local Preview (Static Prototype)
To preview the interactive design, typography, and dynamic animations locally:
1. Simply double-click and open `index.html` in any web browser.
2. **Dynamic Interaction to Try:** Scroll down to **"Find Your Flavor"** and click on different flavor cards (e.g. *Kiwi Krush*, *Punch Rush*). Watch as:
   * The page's primary highlights, glows, and badges dynamically transition to match the flavor's accent color (using live Javascript-injected CSS properties).
   * The product bottle rotates/scales, and the text description dynamically updates.
3. Open the FAQ section at the bottom to verify the smooth-opening accordion transitions.

---

## 🚀 2. Shopify Integration & Deployment Guide
This project includes a fully integrated, modular Shopify section file (`wildfire-redesign.liquid`) ready to deploy directly into the client's store.

### Step 1: Upload the Section to Shopify
1. Log in to your **Shopify Admin** dashboard.
2. Go to **Online Store** -> **Themes**.
3. Next to your active theme (e.g., Dawn, Sense, etc.), click the three dots (`...`) and select **Edit Code**.
4. In the left-hand sidebar, scroll down to the **Sections** folder.
5. Click **Add a new section**.
6. Name the section `wildfire-redesign` and click **Done**.
7. Delete any default code in the file, copy the entire contents of `wildfire-redesign.liquid` from this workspace, paste it in, and click **Save**.

### Step 2: Configure the Section in the Visual Customizer
1. Go back to **Online Store** -> **Themes** and click **Customize** on your active theme.
2. Navigate to the page where you want to add the section (e.g., Home Page).
3. In the sidebar, click **Add Section** and search for **"Wildfire Flagship"**. Click to add it.
4. Now, configure the sections dynamically:
   * **Hero Section:** Upload `athlete_hero_bg.png` under the **Hero Background Image** picker.
   * **Product Showcase:** Upload `wildfire_tub.png` under the **Pre-Workout Tub Image** picker.
   * **Variant ID Connection:** Input your actual Shopify product's **Variant ID** in the settings field. This automatically connects the "Add to Cart" form button to Shopify's default checkout flow.
   * **Blocks Customization:** Under the section, add "Flavor Blocks". You can change names, choose custom colors, write descriptors, and watch them update live in the preview.
5. Drag the section to your preferred position and click **Save** at the top right.

---

## ✨ Features Implemented
* **Brand-First Hero:** Replaces info-heavy marketing sliders with an immersive, emotional athlete background.
* **Progressive Disclosure Layout:** Organically transitions from brand mission -> product launch -> flavor exploration -> ingredient science -> trust & credentials.
* **Interactive Theme Swapping:** Smooth JavaScript color engine swaps highlights dynamically on flavor selection.
* **Liquid Schema Integration:** All blocks (flavors, images, colors, text blocks) are editable within the native Shopify visual customizer.
