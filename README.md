# City Weather App

A monorepo web application for managing cities and viewing their real-time weather data. Built with Next.js, Express, and SQLite.

## Tech Stack

- **Frontend** — Next.js 15, React 19, Tailwind CSS 4
- **Backend** — Express 4, better-sqlite3
- **Shared** — TypeScript types package
- **Tooling** — pnpm workspaces, Vitest

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v10+
- [OpenWeatherMap API key](https://openweathermap.org/api) (free tier works)

## Installation

```bash
git clone https://github.com/1a/city-weather-app.git
cd city-weather-app
pnpm install
```

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and add your OpenWeatherMap API key:

```
OPENWEATHERMAP_API_KEY=your_api_key_here
PORT=3001
```

## Usage

### Development

Start both the API and web app:

```bash
pnpm dev
```

This runs:
- **API** at `http://localhost:3001`
- **Web** at `http://localhost:3000`

To run them individually:

```bash
pnpm dev:api   # API only
pnpm dev:web   # Web only
```

### Testing

```bash
pnpm test
```

### Production

```bash
pnpm --filter web build
pnpm --filter web start
pnpm --filter api start
```

## Project Structure

```
city-weather-app/
├── apps/
│   ├── api/             # Express API server
│   │   ├── src/
│   │   │   ├── db/          # SQLite connection, migrations, repository
│   │   │   ├── routes/      # Cities and countries endpoints
│   │   │   ├── services/    # OpenWeatherMap and REST Countries clients
│   │   │   └── middleware/  # Request validation
│   │   └── tests/
│   └── web/             # Next.js frontend
│       └── src/
│           ├── app/         # Pages (home, add, edit)
│           ├── components/  # CityCard, CityForm, WeatherBadge, etc.
│           └── lib/         # API client and types
├── packages/
│   └── shared/          # Shared TypeScript types
└── pnpm-workspace.yaml
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/cities` | Create a city |
| `GET` | `/api/cities/search?name=` | Search cities by name |
| `GET` | `/api/cities/:id` | Get a city by ID |
| `PUT` | `/api/cities/:id` | Update a city |
| `DELETE` | `/api/cities/:id` | Delete a city |
| `GET` | `/api/countries` | List all countries |

Search results are enriched with live weather data from OpenWeatherMap and country info from REST Countries.
