# Agent Guidelines for Play Doctor App

## 🏥 Project Overview

This is a **Play Doctor App** - a fun, colorful simulation for kids to play pretend doctor. The app includes patient management, appointments, medical tools, billing simulation, and gamification elements designed specifically for child-friendly interaction.

## Build/Lint/Test Commands

- **Build**: `pnpm build` (includes typecheck)
- **Dev**: `pnpm dev` (React Router dev server)
- **Typecheck**: `pnpm typecheck` (TypeScript checking with `tsc --build`)
- **Type generation**: `pnpm typegen` (generates Cloudflare types + React Router types)
- **Deploy**: `pnpm deploy` (to Cloudflare Workers)
- **Start**: `pnpm start` (production mode with wrangler)

## Code Style & Formatting

- Uses **Prettier** with single quotes, no semicolons
- **Tailwind CSS** with proper class sorting via prettier-plugin-tailwindcss
- **TypeScript** strict mode enabled with `verbatimModuleSyntax`
- Use tabs for indentation (based on existing code)

## Import Conventions

- React Router imports from `'react-router'`
- Type imports using `import type { Route } from './+types/route'`
- Server context imports using `~/.server/context` alias
- Use named imports, no index.ts files

## React Router 7 Patterns

- Route files in `app/routes/` with `route.tsx` naming, eg `app/routes/patients/route.tsx`
- Export `meta`, `loader`, and default component from route files
- Use `Route.ComponentProps`, `Route.LoaderArgs`, etc. for typing
- Error boundaries with `ErrorBoundary` export using `Route.ErrorBoundaryProps`

## 🎨 Play Doctor App Specific Guidelines

### Kid-Friendly Design Principles

- **Bright, cheerful colors**: Primary blues/greens, secondary oranges/yellows
- **Large, touch-friendly buttons**: Minimum 44px touch targets
- **Simple navigation**: Visual cues and clear icons
- **Rounded corners**: Use `rounded-lg` or higher for friendly appearance
- **High contrast**: Ensure text is easily readable
- **No scary elements**: Gentle colors, friendly language, positive imagery

### Component Structure

- **Reusable UI components** in `app/components/`
  - `Button.tsx` - Colorful, rounded buttons with sound effects
  - `PatientCard.tsx` - Animated patient cards with avatars
  - `MedicalTool.tsx` - Interactive tool components
  - `AppointmentSlot.tsx` - Drag-and-drop calendar slots

### Data Management

- **Local Storage**: Use browser localStorage for patient data
- **Type Safety**: Define interfaces for Patient, Appointment, Bill, etc.
- **Mock Data**: Include fun, kid-friendly sample data
- **Export Functions**: PDF generation for certificates and records

### Sound and Animation Guidelines

- **Optional sounds**: Always include mute/unmute toggle
- **Gentle animations**: Use `transition-all duration-300` for smooth effects
- **Loading states**: Fun spinners and progress indicators
- **Success feedback**: Celebration animations for completed actions

### Accessibility Requirements

- **Large fonts**: Minimum 16px, prefer 18px+ for kids
- **Clear focus states**: Visible keyboard navigation
- **Alt text**: Descriptive text for all images and icons
- **Screen reader friendly**: Semantic HTML and ARIA labels
- **Color-blind friendly**: Don't rely solely on color for meaning

### Route Structure

```
app/routes/
├── _index/                 # Welcome/Dashboard
├── patients/
│   ├── route.tsx          # Patient list
│   ├── new/route.tsx      # New patient form
│   └── $id/route.tsx      # Patient details
├── appointments/
│   ├── route.tsx          # Calendar view
│   ├── new/route.tsx      # Book appointment
│   └── queue/route.tsx    # Walk-in queue
├── medical-tools/route.tsx # Virtual medical kit
├── billing/route.tsx       # Payment simulation
└── reports/route.tsx       # Fun statistics
```

### Component Naming Conventions

- **PascalCase** for all components
- **Descriptive names**: `PatientRegistrationForm` not `Form`
- **Kid-friendly suffixes**: `MagicStethoscope`, `HappyPatientCard`
- **Medical prefixes**: `MedicalToolKit`, `DiagnosisCard`

### State Management

- **React hooks** for local state
- **Context API** for global app state (current patient, doctor level, etc.)
- **Local storage** for persistence
- **Optimistic updates** for immediate feedback

### Testing Considerations

- **Kid-friendly test scenarios**: Happy path testing with positive outcomes
- **Accessibility testing**: Screen reader and keyboard navigation
- **Touch interaction testing**: Mobile and tablet compatibility
- **Performance testing**: Fast loading for impatient young users

### Security & Safety

- **No real medical data**: All information is for play purposes only
- **Privacy conscious**: No external data transmission
- **Safe content**: Age-appropriate language and imagery
- **Parental controls**: Easy data reset and management options
