# Break Calculator

A work time calculator that helps you track your working hours, breaks, and calculate net work time.

## Features

- Enter start and end times in flexible formats (e.g., `923`, `9:23`, `1547`)
- Support for AM/PM time selection
- Add multiple breaks:
  - **Time Range**: Specify start and end times for a break
  - **Direct Minutes**: Enter break duration in minutes
- Automatic calculation of:
  - Total time at work
  - Total break time
  - Net work time

## Architecture

This project follows **Hexagonal Architecture** (Clean Architecture) with clear separation of concerns:

```
src/time-calculator/
├── domain/           # Business logic (entities, value objects, services)
├── application/      # Use cases and ports
└── infrastructure/   # UI components, adapters, and external integrations
```

### Domain Layer
- **Value Objects**: `TimeOfDay`, `Duration`, `BreakType`
- **Entities**: `Break`, `WorkSession`
- **Services**: `TimeCalculationService`

### Application Layer
- **Use Cases**: `CalculateWorkTimeUseCase`
- **Ports**: `StoragePort`

### Infrastructure Layer
- **Adapters**: `LocalStorageAdapter`, `LocalStorageWorkSessionRepository`
- **UI**: Preact components with Tailwind CSS styling

## Tech Stack

- [Astro](https://astro.build/) - Web framework
- [Preact](https://preactjs.com/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vitest](https://vitest.dev/) - Testing framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Commands

| Command | Action |
| :------ | :----- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build for production to `./dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm test` | Run tests |

## Usage

1. Enter your **start time** (e.g., `930` for 9:30) and select AM/PM
2. Enter your **end time** (e.g., `630` for 6:30) and select AM/PM
3. Add breaks as needed:
   - Click "+ Add Break"
   - Choose "Time Range" or "Direct Minutes"
   - Enter the break details
4. Click "Calculate Time" to see your results
