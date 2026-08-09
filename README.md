# LocoMap 🚇🗺️

LocoMap is a premium, high-fidelity train tracking and route mapping application inspired by Apple's design aesthetics. It integrates real-time coordinates, elevation profiles, weather metrics, and topographical telemetry to display live journeys in a beautiful, glassmorphic layout.

---

## ✨ Key Features

*   **🌊 3D Particle Wave Hero**: A high-performance canvas-based particle grid animation that runs continuously at 60 FPS.
*   **⛰️ Interactive Elevation Profiles**: Live mountain-peak telemetry powered by **OpenTopography**. Features dynamic SVG line drawings, spring-damped guide markers, and sliding Glassmorphic tooltips.
*   **📊 Delay Analytics Board**: Per-station delay charts showing Average Delay, Peak Delay, Peak Location, and custom gradient status gauges.
*   **🌉 Terrain & POI Detection**: Leverages **Overpass API** to detect rivers, bridges, mountains, cities, and attractions along the train route. Renders as a sliding card deck with custom hover glow backlights.
*   **🎟️ iOS Wallet "Recent Passports"**: Presents recent train searches as a horizontally scrollable iOS Wallet Pass deck with touch-snap physics.
*   **📱 Apple Typography & Dark Mode**: Styled globally with Apple's typography stack (`SF Pro`, `-apple-system`) and fully responsive premium layouts.

---

## 🛠️ Technology Stack

*   **Core**: [Next.js](https://nextjs.org/) (App Router, React 18, TypeScript)
*   **Styling**: [TailwindCSS](https://tailwindcss.com/) & Vanilla CSS variables
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand) (with LocalStorage persistence)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Map Engine**: [MapTiler SDK](https://www.maptiler.com/) (using Vector maps overlay)
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.x or higher recommended)
*   [npm](https://www.npmjs.com/)

---

## ⚙️ Initialization & Setup

### 1. Install Dependencies
Install all required packages from the project root:
```bash
npm install
```

### 2. Configure Environment Variables
LocoMap fetches maps, weather, elevation, and live train data from external APIs.
1. Locate the `.env.example` file in the root directory.
2. Create a copy named `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in the required API keys inside `.env`:
   *   `NEXT_PUBLIC_MAPTILER_API_KEY`: API Key for MapTiler maps.
   *   `OPENWEATHER_API_KEY`: API key for weather information.
   *   `OPENTOPOGRAPHY_API_KEY`: API key for topographical information.
   *   `RAILRADAR_API_KEY`: API key for live train coordinates.

---

## 🏃 Running the Application

### Development Server
Start the local Next.js development server:
```bash
npm run dev
```
Once started, navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build
Compile and optimize the codebase for production:
```bash
npm run build
```

### Start Production Server
Launch the production server after compilation:
```bash
npm run start
```

### Code Linting
Run syntax and style analysis using ESLint:
```bash
npm run lint
```

---

## 📁 Project Structure

*   `app/` - Next.js App Router pages and server-side API routes.
*   `components/` - Shared UI elements (Navigation, layouts, buttons).
*   `config/` - App environment validation variables (`config/env.ts`).
*   `features/` - Core domain feature modules (Maps, Analytics, Terrain).
*   `hooks/` - Custom reusable React hooks.
*   `lib/` - Integrations, services, caching mechanism, and local databases:
    *   [trains-db.ts](file:///d:/dev/The%20Projects/LocoMap/lib/trains-db.ts): Static offline Indian railway database.
    *   [cache.ts](file:///d:/dev/The%20Projects/LocoMap/lib/cache.ts): In-memory cache wrapper.
*   `store/` - Global state management with Zustand.
*   `utils/` - Shared helper/utility functions.

