# Footer Widget ON/OFF Toggles & Enhanced Typography Studio

This plan introduces independent **Date & Time (`ON/OFF`)** and **Temperature (`ON/OFF`)** toggles in the Display Layout configurator that automatically expand the remaining active footer sections to fill 100% of the footer width, alongside an upgraded **Typography Studio** featuring one-click typography presets (`Saravanaa Bold`, `Luxury Serif`, `Modern Neon`, `Clean Minimal`) and granular controls for letter-spacing, text-shadow/glow, and badge border strokes.

## User Review & Critical Decisions

- **Auto-Expanding Footer Sections on Toggle (`ON/OFF`)**:
  - Turning **Date & Time** or **Temperature** `OFF` dynamically redistributes its width percentage to the remaining active footer section(s) (such as the **Hotel Saravanaa Bhavan Logo & Branch** section) so the footer always fills 100% width cleanly with no empty gaps.
  - Turning both **Date & Time** and **Temperature** `OFF` expands the **Saravanaa Bhavan Brand & Branch** section to a full `100%` footer banner (matching the classic Image 2 full-width footer look).
- **Enhanced Typography Studio**:
  - **One-Click Typography Presets**: Instant style application for `Saravanaa Bold`, `Luxury Serif`, `Modern Neon`, and `Crisp Minimal`.
  - **Letter-Spacing, Text-Shadow/Glow & Border Stroke Controls**: Configurable badge border stroke width & colour, text drop-shadow / neon glow intensity, and letter-spacing tracking (`tight`, `normal`, `wide`, `ultra-wide`) applied in real time to both the live preview and fullscreen broadcast.

---

## 1. Overview & Core Concept

Restaurant signage operators often want to switch between a multi-widget informational footer (showing live **Date & Time**, **Local Temperature**, and **Restaurant Branding**) and a pure brand showcase footer (hiding the clock or weather so the **Hotel Saravanaa Bhavan** logo and branch title span the full width). Additionally, high-impact digital menu boards require fine typographic polish—such as crisp white/gold strokes around the red `#095` item badge, subtle glow effects behind dish titles, and adjustable letter tracking for readability from across the dining room.

---

## 2. User Experience & Visual Design

- **Footer Widget `ON/OFF` Controls (in `Layout Sliders` & `Footer Row Section Splits`)**:
  - Dedicated interactive `Date & Time: ON/OFF` and `Temperature: ON/OFF` toggle pills directly in the **3. Footer Row Section Splits** header and on each corresponding slider card.
  - When a widget is toggled `OFF`:
    - Its slider card dims with an `OFF (0%)` badge and a one-click `Enable` action.
    - The remaining active footer section(s) automatically scale proportionally to `100%` total width both in the **Live Display Output Preview** and the **2D Active Layout Matrix** wireframe.
    - When toggled back `ON`, it restores its balanced percentage split seamlessly.
- **Upgraded Typography Studio (`Item & Sequence Typography`)**:
  - **Top Typography Preset Bar**:
    - 4 one-click preset buttons (`Saravanaa Bold`, `Luxury Serif`, `Modern Neon`, `Clean Minimal`) that coordinate font family, weight, badge radius, border stroke, and glow across the Item Badge, Dish Title, and Sequence Badge.
  - **Card 1 — Item Number Badge (`#095`) & Label**:
    - Existing size, radius, font family, weight, and colour controls.
    - **New**: **Border Stroke Width (`0px–6px`) & Stroke Colour** (e.g., crisp white or gold ring around the `#095` badge) and **Badge Glow / Shadow Effect (`None`, `Soft Drop`, `Crimson Glow`, `Neon Halo`)**.
  - **Card 2 — Product Name & Subtitle Typography**:
    - Existing title size, subtitle size, label text, and colour controls.
    - **New**: **Letter-Spacing Tracking (`Tight`, `Normal`, `Wide`, `Expanded`)**, **Title Text Effect (`None`, `Crisp Shadow`, `Ambient Glow`, `Outline Stroke`)**, and independent **Title Font Family** support.
  - **Card 3 — Sequence Badge (`SEQ - #3`) & QR Styling**:
    - Existing SEQ font size, corner radius, prefix, font family/weight, and colours.
    - **New**: **SEQ Border Stroke Width (`0px–4px`) & Stroke Colour** and **Letter-Spacing** so the `SEQ - #3` pill matches the main item badge styling.

---

## 3. Key Product Decisions & Trade-Offs

- **Proportional Normalization vs. Destructive Zeroing**:
  - Storing explicit boolean flags (`showDateTime`, `showTemperature`) while normalizing the effective rendered percentages to `100%` ensures that toggling a widget `OFF` immediately gives `100%` space to the remaining sections, while toggling it back `ON` restores the user's previous slider ratio (`10% / 10% / 80%`) instead of losing it.
- **Zero-Scrollbar Full-Screen Discipline**:
  - All new typography controls (presets, stroke width/color, letter-spacing, and shadow/glow) are integrated into the existing 3-card side-by-side grid (`7 cols` left controls / `5 cols` right live preview) so the entire workspace remains locked within `100vh` with zero scrollbars.

---

## 4. Technical Architecture & Data Strategy

```
+-----------------------------------------------------------------------------------+
| Display Layout & Typography Header Bar                                            |
| [<- Schedule] [Layout Sliders] [Item & Sequence Typography]  [Typography Presets] |
+-----------------------------------------------------------------------------------+
| Left 7 Cols: Controls                  | Right 5 Cols: Live Preview & Matrix      |
|                                        |                                          |
| Layout Mode:                           | +--------------------------------------+ |
|  1. Vertical Rows (Header ON/OFF)      | | Live 16:9 Display Preview            | |
|  2. Content Columns (Img / Info / QR)  | |  - Dynamic Footer (Auto-expands when | |
|  3. Footer Split:                      | |    Date/Time or Temp is OFF)         | |
|     [Date & Time ON/OFF] [Temp ON/OFF] | |  - Live Stroke, Glow & Letter-Spacing| |
|     Auto-expands active sections=100%  | +--------------------------------------+ |
|                                        | | 2D Active Layout Matrix (100% x 100%)| |
| Typography Mode:                       | |  Shows active vs hidden footer cells | |
|  1. Item Badge (+Stroke, +Glow)        | +--------------------------------------+ |
|  2. Dish Title (+Tracking, +TextShadow)|                                          |
|  3. SEQ Badge  (+Stroke, +Tracking)    |                                          |
+-----------------------------------------------------------------------------------+
```

- **Configuration Schema Extensions**:
  - Extend `DisplayLayoutConfig` with `showDateTime?: boolean` and `showTemperature?: boolean` (both defaulting to `true`).
  - Extend `ItemBadgeConfig` with `borderWidth?: number`, `borderColor?: string`, `letterSpacing?: 'tight' | 'normal' | 'wide' | 'expanded'`, `textShadow?: 'none' | 'soft' | 'glow' | 'neon'`, and `titleFontFamily?: 'sans' | 'serif' | 'mono' | 'impact'`.
  - Extend `SequenceBadgeConfig` with `borderWidth?: number`, `borderColor?: string`, and `letterSpacing?: 'tight' | 'normal' | 'wide' | 'expanded'`.
