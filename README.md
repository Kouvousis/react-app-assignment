# A full-stack property listing application built with React, Node.js, Express, and SQLite.

## Project Structure

```
react-app/
├── client/                         # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PropertyForm.jsx    # Main form component
│   │   │   └── AreaAutocomplete.jsx # Autocomplete input with caching
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css               # Tailwind imports
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── server/                         # Node.js backend
    ├── src/
    │   ├── routes/
    │   │   ├── autocomplete.js     # GET /api/autocomplete
    │   │   └── ads.js              # GET & POST /api/ads
    │   └── database.js             # SQLite setup
    ├── database.db                 # Auto-generated on first run
    ├── index.js                    # Express app entry point
    └── package.json
```

---

## Prerequisites

- Node.js v18 or higher
- npm

---

## Getting Started

You will need **two terminals** running simultaneously — one for the frontend and one for the backend.

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd react-app
```

### 2. Start the backend (Terminal 1)

```bash
cd server
npm install
npm run dev
```

The server will start on **http://localhost:3000**
The SQLite database file (`database.db`) will be created automatically on first run.

### 3. Start the frontend (Terminal 2)

```bash
cd client
npm install
npm run dev
```

The React app will start on **http://localhost:5173**

---

## API Endpoints
| GET | /api/autocomplete?input=athens | Returns area suggestions from XE API |
| POST | /api/ads | Creates a new property ad |

```json
{
  "title": "Beautiful apartment in Athens",
  "type": "Rent",
  "areaName": "Athens",
  "placeId": "1ee9a256c213540330ec272a9285f47912a30169",
  "price": 500,
  "description": "Optional description"
}
```

---

## Packages Used

### Frontend
- [react-hook-form](https://react-hook-form.com/) — Form state management and validation
- [use-debounce](https://www.npmjs.com/package/use-debounce) — Debouncing the autocomplete input
- [tailwindcss](https://tailwindcss.com/) — Utility-first CSS framework

### Backend
- [express](https://expressjs.com/) — Web framework for Node.js
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — SQLite database driver
