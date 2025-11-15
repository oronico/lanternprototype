## SchoolStack.ai Brand Format Master

This document defines the single source of truth for our front-end styling. All components should reference these tokens so that colors, gradients, typography, badges, cards, and buttons stay consistent across the platform.

### 1. Color System

| Token | Tailwind Source | Usage |
| --- | --- | --- |
| `BRAND_COLORS.primary` | `primary-50…900` | App shell, links, CTA buttons, icons |
| `BRAND_COLORS.accent` | `accent-50…900` | Highlights, celebratory states, login streak |
| `BRAND_COLORS.success` | `success-50…900` | Positive/“On Track” states |
| `BRAND_COLORS.warning` | `amber-50…900` | Needs Work |
| `BRAND_COLORS.critical` | `red-50…900` | Alarm |
| `BRAND_COLORS.neutral` | `gray-50…900` | Surfaces, borders, baseline text |

### 2. Gradients & Cards

Reference `CARD_VARIANTS` and `GRADIENTS` in `client/src/styles/brandTokens.js`:

- `CARD_VARIANTS.surface` → default white card
- `CARD_VARIANTS.primaryGradient` → teal hero card
- `CARD_VARIANTS.accentGradient` → orange hero card
- `GRADIENTS.hero` → teal hero stripes
- `GRADIENTS.coach` → subtle teal background for coach sections

### 3. Typography

Token names are in `TYPOGRAPHY`:

- `sectionEyebrow`
- `sectionHeading`
- `pageHeading`
- `body`
- `caption`

### 4. Buttons

Use `BUTTON_VARIANTS` helper:

```
import { getButtonVariant } from '../styles/brandTokens';

const primaryButton = getButtonVariant('primary');
<button className={primaryButton}>Save</button>
```

Variants: `primary`, `secondary`, `accent`, `ghost`.

### 5. Badges / Status

Call `getStatusBadge('good' | 'warning' | 'critical' | 'info')`. Example:

```
<span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusBadge(status)}`}>
  {statusLabel}
</span>
```

### 6. Implementation Rules

1. **No pastels:** use tokens only.
2. **Gradients only from tokens:** teal (`primary`), orange (`accent`), success green.
3. **Cards = `CARD_VARIANTS.surface` unless hero.**
4. **Buttons only via `BUTTON_VARIANTS`.**
5. **New components must import `brandTokens`.**
6. **When inline colors are required (charts, progress bars), use `BRAND_COLORS.*.hex`.**

### 7. Applying Tokens

Example:

```
import { getCardVariant, TYPOGRAPHY, BRAND_COLORS } from '../styles/brandTokens';

const cardClass = getCardVariant('surface');

return (
  <section className={cardClass}>
    <p className={TYPOGRAPHY.sectionEyebrow}>Business Health Score</p>
    <h2 className={TYPOGRAPHY.sectionHeading}>
      72 <span className={BRAND_COLORS.neutral.textMuted}>/100</span>
    </h2>
  </section>
);
```

### 8. Enforcement

- All new UI work references tokens.
- Color changes happen only in `tailwind.config.js` or `brandTokens.js`.
- During PR review, reject custom hex codes not defined in tokens.

This master format can now be referenced in future work to keep the investor-facing experience consistent and professional. All component teams should treat `brandTokens.js` as the canonical API for styling.

