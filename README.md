# Weather Dashboard

A comprehensive dashboard for visualizing weather data.

## Setup and Run Instructions

1. Enable Corepack to ensure the correct package manager version is used:
   ```bash
   corepack enable
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Run the development server:
   ```bash
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture and Key Technical Decisions

- **Framework**: Built with Next.js (App Router) and React for robust client-side rendering and routing.
- **State Management**: Uses Zustand (in `storage/stores`) for global location storage (with localStorage persistence) and Nuqs or Next.js native hooks (e.g., `use-dashboard-params.ts`) for URL query parameter persistence.
- **Styling**: Tailwind CSS combined with Radix UI primitives (shadcn/ui) for accessible, consistent, and customizable UI components.
- **Map Integration**: Interactive maps integrated for location selection and viewing saved locations.
- **Data Fetching**: Modular data fetching through `lib/weather-api.ts` with custom React Hooks (`hooks/use-weather.ts`) to manage loading, empty, and error states seamlessly.

## Known Limitations and Tradeoffs

- **API Limits**: Dependent on the open historical weather API, which may have rate limits or downtime.
- **Responsive Design**: While built with responsive principles, the map and complex multi-chart views are best viewed on desktop or larger screens.
- **Storage Limits**: Saved locations use `localStorage`, which is tied to the browser profile. Large amounts of data could theoretically hit quota limits, though unlikely for location IDs.

## Implementation Checklist

### Required Items

- [C] Global toolbar implemented (MANDATORY)
- [C] Global date range selection implemented (MANDATORY)
- [C] Global metric checkbox list implemented (MANDATORY)
- [C] Global computed-series checkbox list implemented (MANDATORY)
- [C] Interactive map implemented (MANDATORY)
- [C] Add and save location flow implemented (MANDATORY)
- [C] Remove location flow implemented (MANDATORY)
- [C] Saved locations displayed on the map (MANDATORY)
- [C] One active/selected location displayed in the location detail view (MANDATORY)
- [C] Multiple selected metrics displayed as stacked charts within the active location detail view (MANDATORY)
- [C] Location-specific date override implemented
- [C] Location-specific override resets when global date range changes
- [C] URL query parameter persistence implemented for selected metrics, selected computed series, global date range, and selected location
- [C] localStorage persistence implemented for saved locations
- [C] Time-series weather data loaded from a no-auth API or documented mock server (MANDATORY)
- [C] At least one computed series implemented (MANDATORY)
- [C] Loading states implemented
- [C] Empty states implemented
- [C] Error states implemented
- [C] Graceful failure handling implemented
- [C] README setup instructions included (MANDATORY)
- [C] Architecture and technical decisions documented
- [C] Known limitations or tradeoffs documented
- [C] AI Usage Disclosure included (MANDATORY)

### Extra Items

- [-] Share Dashboard button opens a dialog with a copyable self-contained URL
- [-] Shared URL restores the full dashboard state when opened by another user, including state that would otherwise only exist in localStorage
- [-] Multiple saved locations can be selected at the same time
- [-] Separate chart/widget rendered for each selected location
- [-] Charts/widgets grouped by location when multiple locations are selected
- [C] All 3 computed series implemented: 7-day moving average, min and max lines, and simple trend/regression line
- [C] Request cancellation or caching implemented for rapidly changing filters
- [-] Unit tests added for transformation logic
- [-] Dockerfile included
- [-] docker-compose.yaml included
- [-] docker-compose.yaml builds the application image from the provided Dockerfile
- [-] Docker Compose setup is self-contained enough that, preferably, cloning the repository and running docker compose up is sufficient to build and start the application
- [-] Docker setup includes clear instructions for building and running the application locally
- [-] Self-signed HTTPS certificate support included
- [-] Simple authentication gate added for the dashboard
- [C] Mobile-responsive layout support included

## AI Usage Disclosure

- **Tools Used**: GitHub Copilot, Gemini 3.1 Pro.
- **Purpose**: AI tools were used during development to bootstrap boilerplate code, help implement state synchronization logic between URLs and local storage, brainstorm architectural structures, refine the styling of complex UI components like the dashboard layout and charts, and assist with project documentation.
