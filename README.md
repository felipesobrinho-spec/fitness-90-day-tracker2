# Fitness 90 Day Tracker - PWA

A complete offline-first Progressive Web App for tracking 90-day fitness programs.

## Features

- **Offline-First**: Works completely offline using IndexedDB
- **PIN Authentication**: Secure local authentication with Web Crypto API
- **Complete Workout Tracking**: Daily workout logs with exercise checklists
- **Nutrition Tracking**: Meal logging and water intake monitoring
- **Progress History**: Calendar view of completed workouts
- **Weight Tracking**: Log and visualize weight progress with charts
- **PWA**: Installable on mobile and desktop

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: IndexedDB via Dexie
- **PWA**: @ducanh2912/next-pwa
- **Charts**: Recharts
- **Authentication**: PIN-based (Web Crypto API)

## Getting Started

### Development

```bash
# Install dependencies
cd frontend
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build the app
npm run build

# Start production server
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy

# Deploy to production
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## PWA Installation

### Mobile (Chrome/Safari)
1. Open the app in your browser
2. Tap the Share button (iOS) or Menu (Android)
3. Select "Add to Home Screen"

### Desktop (Chrome/Edge)
1. Look for the install icon in the address bar
2. Click "Install"

## Architecture

### Offline-First Design

- **IndexedDB** is the source of truth for all data
- All operations work without internet connection
- Future Supabase sync can be added later (not in Release 1)

### Data Models

- **Profile**: User information and program settings
- **Workouts**: Exercise routines by day of week
- **Meals**: Nutrition templates
- **Daily Logs**: Workout and nutrition tracking per day
- **Weight Logs**: Weight measurements over time

### Authentication

- PIN-only authentication (4-6 digits)
- Hashed with PBKDF2 + salt (Web Crypto API)
- 24-hour session stored in localStorage

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── setup/             # Onboarding wizard
│   ├── login/             # PIN login
│   ├── dashboard/         # Main dashboard
│   ├── workout/           # Workout tracking
│   ├── nutrition/         # Nutrition tracking
│   ├── history/           # Calendar history
│   └── profile/           # User profile & weight
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── AppLayout.tsx     # Main app layout
├── db/                   # Dexie database
│   ├── schema.ts         # Database schema
│   └── repositories/     # Data access layer
├── hooks/                # Custom React hooks
├── lib/                  # Utilities
│   ├── crypto.ts         # PIN hashing
│   ├── types.ts          # TypeScript interfaces
│   └── utils.ts          # Helper functions
└── public/               # Static assets
    └── manifest.json     # PWA manifest
```

## Release 1 - MVP Scope

✅ **Included:**
- PIN-only authentication
- Complete onboarding wizard
- All 5 main tabs (Dashboard, Workout, Nutrition, History, Profile)
- Offline functionality
- PWA installation
- Weight tracking with charts
- Calendar history

❌ **Not Included (Future):**
- Supabase sync
- Cloud backup
- Progress photos
- Gamification/achievements
- Push notifications
- Social features

## Browser Support

- Chrome/Edge (latest)
- Safari (latest)
- Firefox (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT
