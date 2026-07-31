# Design System Specification — إتقان (Itqan)

## 1. Visual Philosophy
"Arabic Coding Studio + Modern Learning Workspace"
- **Clean Editorial Layout**: Clear reading surfaces for Arabic text with JetBrains Mono code blocks.
- **Directional Duality**: Full `dir="rtl"` page layout with isolated `dir="ltr"` code blocks.
- **Micro-Interactions**: Smooth hover effects, deliberate feedback animations, and accessible focus states.

## 2. Typography Rules
- **Primary Arabic Font**: `Alexandria` (Google Fonts), fallback `IBM Plex Sans Arabic`, sans-serif.
- **Code Font**: `JetBrains Mono`, `Fira Code`, monospace (`dir="ltr"`).
- **Body Font Sizes**:
  - Desktop: Minimum 16px.
  - Mobile: Minimum 15px-16px.
  - Line height: 1.6-1.8 for optimal Arabic readability.

## 3. Color Tokens

### Brand Palette
- `--brand-primary`: `#4355E8`
- `--brand-primary-hover`: `#3443C8`
- `--brand-primary-active`: `#2936A8`
- `--brand-secondary`: `#0E9F9A`
- `--brand-accent`: `#F9734F`

### Course Identity Colors
- **HTML**: `#F97316`
- **CSS**: `#2563EB`
- **JavaScript**: `#EAB308` (Dark text on yellow backgrounds)

### Light Theme Tokens
- `--background`: `#F5F7FB`
- `--background-subtle`: `#EEF2F7`
- `--surface`: `#FFFFFF`
- `--surface-secondary`: `#F8FAFC`
- `--surface-elevated`: `#FFFFFF`
- `--text-primary`: `#101828`
- `--text-secondary`: `#344054`
- `--text-muted`: `#667085`
- `--border`: `#D8E0EA`
- `--border-strong`: `#AAB6C5`

### Dark Theme Tokens
- `--background`: `#07111F`
- `--background-subtle`: `#0A1626`
- `--surface`: `#0F1D2E`
- `--surface-secondary`: `#13243A`
- `--surface-elevated`: `#182B43`
- `--text-primary`: `#F8FAFC`
- `--text-secondary`: `#CBD5E1`
- `--text-muted`: `#94A3B8`
- `--border`: `#293B52`
- `--border-strong`: `#41566F`

### Status Tokens
- `--success`: `#15803D` (Dark: `#4ADE80`)
- `--warning`: `#B45309` (Dark: `#FBBF24`)
- `--danger`: `#C62828` (Dark: `#F87171`)
- `--info`: `#0369A1` (Dark: `#38BDF8`)
