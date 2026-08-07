# LocoMap 🚇🗺️

LocoMap is a modern train mapping and tracking web application powered by Next.js. It integrates various services like RailRadar, MapTiler, OpenWeather, and OpenTopography to display real-time train tracking, routes, weather, and topographical information.

---

## 🚀 Getting Started

Follow these steps to initialize, configure, and run the LocoMap project locally.

### 📋 Prerequisites

Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.x or higher recommended)
*   [npm](https://www.npmjs.com/) or another package manager like yarn/pnpm

---

## 🛠️ Initialization & Setup

### 1. Install Dependencies
Run the following command in the project root to install the necessary packages:
```bash
npm install
```

### 2. Configure Environment Variables
LocoMap relies on external APIs to fetch maps, weather, elevation, and live train data.
1. Locate the `.env.example` file in the root directory.
2. Create a copy named `.env` (if not already present):
   ```bash
   cp .env.example .env
   ```
3. Fill in the required API keys inside `.env`:
   *   `NEXT_PUBLIC_MAPTILER_API_KEY`: API Key for MapTiler to load maps.
   *   `OPENWEATHER_API_KEY`: Server-side API key for weather information.
   *   `OPENTOPOGRAPHY_API_KEY`: Server-side API key for elevation and topography information.
   *   `RAILRADAR_API_KEY`: API key for the live RailRadar tracking API.

---

## 🏃 Running the Application

LocoMap contains scripts defined in [package.json](file:///d:/dev/The%20Projects/LocoMap/package.json):

### Development Server
Run the local Next.js development server:
```bash
npm run dev
```
Once started, open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build
To build the application for production, compile the code, and optimize it:
```bash
npm run build
```

### Start Production Server
Start the production server after creating a build:
```bash
npm run start
```

### Code Linting
To check the code for syntax or style issues using ESLint:
```bash
npm run lint
```

---

## 📁 Project Structure

*   `app/` - Next.js App Router pages and API routes.
*   `components/` - Shared UI components.
*   `config/` - App configurations including environment validation (`config/env.ts`).
*   `features/` - Core domain modules (e.g. Map features, Search).
*   `hooks/` - Custom React hooks.
*   `lib/` - Integrations, services, caching mechanism, and local databases:
    *   [trains-db.ts](file:///d:/dev/The%20Projects/LocoMap/lib/trains-db.ts): Static offline Indian railway database.
    *   [cache.ts](file:///d:/dev/The%20Projects/LocoMap/lib/cache.ts): In-memory cache wrapper.
*   `providers/` - React context providers (e.g., QueryClientProvider).
*   `store/` - Global state management with Zustand.
*   `utils/` - Shared helper/utility functions.
