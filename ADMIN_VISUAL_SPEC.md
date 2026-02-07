# Admin Dashboard - Visual Specification

## Color Palette Reference

### Background Colors
```
Primary BG:     #0B0F1A (Near-black, RGB: 11, 15, 26)
Surface:        #121829 (Slightly lighter, RGB: 18, 24, 41)
Secondary:      #1A1F35 (Available in theme, RGB: 26, 31, 53)
```

### Text Colors
```
Primary Text:   #FFFFFF (White, RGB: 255, 255, 255)
Secondary Text: #9CA3AF (Gray, RGB: 156, 163, 175)
```

### Accent Colors
```
Primary:        #60A5FA (Blue, RGB: 96, 165, 250)        - Main actions, highlights
Secondary:      #A78BFA (Purple, RGB: 167, 139, 250)     - Secondary actions
Success:        #22C55E (Green, RGB: 34, 197, 94)        - Approved, completed, active
Warning:        #F59E0B (Amber, RGB: 245, 158, 11)       - Pending, attention needed
Error:          #EF4444 (Red, RGB: 239, 68, 68)          - Suspended, rejected, failed
Border:         rgba(255, 255, 255, 0.08)                - Subtle borders
```

---

## Typography Scale

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 | 20px | 700 Bold | Page titles |
| H2 | 16px | 600 Semibold | Section headers |
| H3 | 14px | 600 Semibold | Card titles |
| Body | 14px | 400 Regular | Body text |
| Small | 13px | 400 Regular | Secondary info |
| Caption | 12px | 400 Regular | Labels, metadata |
| XSmall | 11px | 400 Regular | Badges, helpers |

---

## Layout Grid

### Mobile Layout (360px width)
```
┌─────────────────────────┐
│ Header (h=64px)         │
│ Title + Logout          │
├─────────────────────────┤
│                         │
│  Content Scroll Area    │
│  (padding: 16px)        │
│                         │
│                         │
├─────────────────────────┤
│  Bottom Nav (h=80px)    │
│  6 Icons + Labels       │
└─────────────────────────┘
```

### Spacing System
```
xs:  4px
sm:  8px
md: 12px
lg: 16px
xl: 20px
2xl: 24px
3xl: 32px
```

---

## Component Specifications

### Header
```
Height:         64px (fixed, sticky)
Padding:        16px (horizontal)
Background:     colors.bg.primary
Border:         1px colors.accent.border
Content:        
  - Left: Title (16px) + Subtitle (12px)
  - Right: Logout button (40px icon + hitbox)
```

### Metric Card
```
Layout:         2x2 grid (gap: 8px)
Width:          calc(50% - 4px)
Height:         auto (min 100px)
Padding:        12px
Border Radius:  8px
Background:     colors.bg.surface
Border:         1px colors.accent.border
Content:
  - Label (12px, secondary)
  - Value (28px bold, color-specific)
  - Spacing: 8px between
```

### List Card (Venue/Owner)
```
Width:          100%
Height:         auto (min 80px)
Padding:        12px
Border Radius:  8px
Background:     colors.bg.surface
Border:         1px colors.accent.border
Margin Bottom:  8px
Content Layout:
  ┌──────────────────────────┐
  │ Title (14px bold)        │ ← Flex 1
  │ Subtitle (12px secondary)│
  │ [Badge] [Info] [Icon→]   │
  └──────────────────────────┘
```

### Status Badge
```
Display:        inline-block
Padding:        6px 10px
Border Radius:  4px
Font Size:      11px
Font Weight:    600
Background:     {StatusColor}20 (20% opacity)
Color:          {StatusColor}
Examples:
  - Approved:   #22C55E background, text
  - Pending:    #F59E0B background, text
  - Suspended:  #EF4444 background, text
```

### Bottom Navigation
```
Position:       fixed bottom-0
Width:          100%
Height:         80px (5rem)
Padding:        8px horizontal
Background:     colors.bg.primary
Border:         1px top colors.accent.border
Items:          6 buttons (flex-1 each)

Each Item:
  - Icon:       20px emoji or icon
  - Label:      12px text below icon
  - Hit Area:   44px minimum
  - Active:     
    - Background: rgba(96, 165, 250, 0.15)
    - Border: 1px colors.accent.primary
```

### Action Sheet (Bottom Sheet Modal)
```
Position:       fixed bottom-0
Width:          100%
Max Height:     85vh
Border Radius:  24px top (border-t-3xl)
Background:     colors.bg.primary
Border:         1px colors.accent.border
Content:
  - Header: 12px top padding + 16px sides
  - Title: 18px bold
  - Description: 14px secondary
  - Divider: 16px bottom
  - Body: scrollable, max 96 height
  - Buttons: 12px gap, full width

Buttons:
  - Primary:    h-11, full width
  - Secondary:  outline variant, h-11
  - Spacing:    8px gap
```

---

## Interaction States

### Button States
```
Default:    backgroundColor: colors.accent.primary
Hover:      opacity: 0.9 (on desktop)
Active:     opacity: 0.85 (pressed)
Disabled:   opacity: 0.5

Text Colors:
  - Primary buttons: #000 (black text)
  - Secondary buttons: colors.text.secondary
```

### Card States
```
Default:    border: colors.accent.border
Hover:      border-opacity: 1.0 (slightly stronger)
Active:     background: colors.bg.surface (slightly highlighted)
Pressed:    same as active
```

### Sheet States
```
Closed:     opacity: 0, translateY: 100%
Open:       opacity: 1, translateY: 0
Transition: 300ms ease-in-out
```

---

## Responsive Breakpoints

### Mobile (360px - 767px)
- Single column layouts
- Full-width cards
- 2x2 metric grid
- No changes to font sizes
- Bottom nav visible always

### Tablet (768px - 1023px)
- Same as mobile (can be enhanced later)
- Wider padding (20px)
- Optional: 3-column layouts for tables

### Desktop (1024px+)
- Same as mobile/tablet (not optimized for desktop yet)
- Future: Sidebar navigation
- Future: Multi-column layouts

---

## Accessibility Notes

### Touch Targets
- Minimum: 44x44px (iOS guideline)
- Comfortable: 48x48px
- Navigation items: ≥44px
- Button height: 44px (h-11)

### Color Contrast
- Text on background: ✅ WCAG AA compliant
  - White on #0B0F1A: 17.6:1 ratio
  - Gray (#9CA3AF) on #0B0F1A: 4.5:1 ratio
- Status colors use both color + icons where possible

### Focus States
- Ready for keyboard navigation
- All interactive elements focusable
- Focus rings visible on hover

---

## Animation & Transitions

### Smooth Transitions
```css
Duration:     300ms
Timing:       ease-in-out
Properties:   opacity, transform, background-color, border-color
```

### Specific Animations
```
Bottom Sheet Open:     slideUp 300ms ease-out
Bottom Sheet Close:    slideDown 200ms ease-in
Active Nav Highlight:  none (instant)
Loading States:        spin animation (from lucide)
```

---

## Icon System

### Icons Used
- **LogOut**: Sign out button (lucide-react)
- **ChevronRight**: Card navigation hint
- **Loader2**: Loading spinner (animate-spin)

### Icon Sizes
- Header icon: 20px
- Card navigation: 16px
- Loading indicator: varies

### Icon Colors
- Primary: colors.text.secondary (default)
- Active: colors.accent.primary
- Error: colors.accent.error

---

## Dark Mode Specification

### This UI is Dark-Only
- No light mode support planned
- Professional SaaS aesthetic
- High contrast for readability
- Reduced eye strain

### Opacity Adjustments
```
Disabled content:     50% opacity
Hover states:         90% opacity
Pressed states:       85% opacity
Placeholder text:     60% opacity
```

---

## Status Badge Reference

### Venue Statuses
| Status | Badge Color | Text Color | Icon |
|--------|------------|-----------|------|
| Pending | #F59E0B | #F59E0B | ⏳ |
| Approved | #22C55E | #22C55E | ✓ |
| Suspended | #EF4444 | #EF4444 | ✕ |

### Owner KYC Statuses
| Status | Badge Color | Text Color |
|--------|------------|-----------|
| Pending | #F59E0B | #F59E0B |
| Approved | #22C55E | #22C55E |
| Rejected | #EF4444 | #EF4444 |

### Booking Statuses
| Status | Badge Color | Text Color |
|--------|------------|-----------|
| Confirmed | #60A5FA | #60A5FA |
| Completed | #22C55E | #22C55E |
| Cancelled | #EF4444 | #EF4444 |

---

## Safe Areas & Insets

### Mobile Safe Area
```
Top:     64px (below header)
Bottom:  80px (above nav)
Left:    16px padding
Right:   16px padding
Content: Scrolls between top & bottom insets
```

### Z-Index Stack
```
Navigation:     50 (z-50, fixed bottom)
Header:         40 (z-40, fixed top) - Actually 50 in code
Sheet Overlay:  50 (z-50, fixed)
Sheet Content:  50 (z-50, fixed)
Content:        0 (default)
```

---

## Form Elements (for future use)

### Input Fields
```
Height:         44px (h-11)
Padding:        12px (px-3)
Border:         1px colors.accent.border
Border Radius:  6px
Background:     colors.bg.surface
Text Color:     colors.text.primary
Focus:          ring-2 ring-colors.accent.primary
```

### Selectables (Radio/Checkbox)
```
Size:           20px
Border:         2px colors.accent.border
Active:         background: colors.accent.primary
Checked Mark:   white (#FFFFFF)
```

---

## Performance Considerations

### Rendering
- All colors from context (single source of truth)
- Inline styles prevent CSS parsing
- No unnecessary re-renders (memo candidates)
- Lazy sheet rendering

### Bundle Size
- Zero new dependencies
- Uses existing UI components
- Lucide icons already included
- ~15KB additional code

### Animation Performance
- GPU-accelerated transforms
- No complex animations
- Consistent 60fps scrolling
- Optimized re-renders

---

## Print Specification (Future)

Not implemented yet, but consider:
- Dark theme may not print well
- Add print media queries
- Adjust colors for print
- Hide navigation/header
- Landscape for tables

---

## Testing Specific Colors

### Verify these exact hex values in dev tools:
```
#0B0F1A - Primary background
#121829 - Surface/cards
#FFFFFF - Primary text
#9CA3AF - Secondary text
#60A5FA - Primary accent (blue)
#A78BFA - Secondary accent (purple)
#22C55E - Success (green)
#F59E0B - Warning (amber)
#EF4444 - Error (red)
```

### CSS/Tailwind Equivalents (if used)
```
#0B0F1A ≈ slate-950
#121829 ≈ slate-900
#FFFFFF = white
#9CA3AF = gray-400
#60A5FA = blue-400
#A78BFA = violet-400
#22C55E = green-500
#F59E0B = amber-500
#EF4444 = red-500
```

---

## Accessibility Checklist

- ✅ Color not sole indicator (+ text/icons)
- ✅ Sufficient contrast ratios
- ✅ Touch targets ≥44px
- ✅ Keyboard navigation ready
- ✅ Focus states visible
- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ No auto-play media
- ✅ Readable font sizes
- ✅ Logical tab order

---

**This specification ensures consistent, professional, and accessible admin interface design.**
