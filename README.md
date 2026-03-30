# # trainItera

A mobile workout tracking app built with Ionic React and Capacitor. Track your workouts, manage routines, and stay on top of your training with built-in timer functionality.

---

## Features

- **Workout Tracking** – Log exercises, sets, reps, and weight for every workout session
- **Routine Management** – Create and manage reusable routines with exercises and target sets
- **Rest Timer** – Automatic per-set rest timer with configurable duration per exercise
- **Exercise Timer** – Track time spent on each exercise during a workout
- **Exercise Library** – Preloaded exercise library with muscle group tagging, fully extensible
- **Muscle Group Filtering** – Search and filter exercises by muscle group
- **Settings** – Configure rest timer, default rest duration, weight unit (kg/lbs), and language

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Ionic React](https://ionicframework.com/) 8.5 |
| Runtime | [React](https://react.dev/) 19 |
| Language | TypeScript 5.9 |
| Native Bridge | [Capacitor](https://capacitorjs.com/) 8.2 |
| Database | [SQLite](https://github.com/capacitor-community/sqlite) via `@capacitor-community/sqlite` 8.0 |
| Routing | React Router 5 |
| Build Tool | Vite 5 |
| Icons | Ionicons 7 |

---

## Project Structure

```
src/
├── db/
│   ├── connection.ts           # SQLite connection & init
│   ├── seed.ts                 # Seed data (exercises, muscle groups, routines)
│   ├── settings.ts             # App settings via localStorage
│   ├── migrations/             # SQL migrations
│   ├── models/                 # TypeScript interfaces
│   ├── repositories/           # Data access layer
│   └── schema/                 # Table definitions
├── components/
│   ├── ExercisePicker.tsx      # Reusable exercise picker with search
│   ├── ExerciseTimer.tsx       # Per-exercise stopwatch
│   ├── RestTimer.tsx           # Per-set rest countdown
│   └── WorkoutTimer.tsx        # Overall workout duration
├── hooks/
│   ├── useExerciseTimer.ts
│   ├── useRestTimer.ts
│   └── useWorkoutTimer.ts
└── pages/
    ├── Workouts.tsx
    ├── WorkoutDetail.tsx
    ├── Routines.tsx
    ├── RoutineDetail.tsx
    ├── Exercises.tsx
    └── Settings.tsx
```

---

## Prerequisites

- Node.js 18+
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)
- Android SDK at `~/Android/Sdk`

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run in browser (dev mode)

```bash
npm run dev
```

> Note: SQLite is not available in the browser. Use a device or emulator for full functionality.

---

## Build & Deploy

### Android

```bash
npm run build
npx cap sync android
```

Then open Android Studio and run the app:

```bash
npx cap open android
```

Or build and install directly:

```bash
npx cap run android
```

### iOS

```bash
npm run build
npx cap sync ios
npx cap open ios
```

> Requires an active Apple Developer Account for device deployment.

---

## Database

The app uses SQLite via `@capacitor-community/sqlite`. The database is initialized on first launch and seeded.

Migrations are tracked in a `migrations` table and run automatically on startup.

---

## License

Private project – all rights reserved.