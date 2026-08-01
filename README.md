# 🚩 Mahapath

**Mahapath** is an event & location tracker built for the Mahakumbh, Prayagraj — helping pilgrims and visitors discover, search, and locate spiritual events (Shahi Snan, Aarti, Satsang, processions, and more) on an interactive map.

Built as part of an internship project.

## Features

- **Event management (CRUD)** — organizers can add, edit, and delete events
- **Organizer authentication** — session-based login/registration; only logged-in organizers can manage events, while browsing (Home, Map, Schedule) is public
- **Interactive map** — live event locations plotted with Leaflet + OpenStreetMap, geocoded from a curated list of Mahakumbh-area landmarks
- **Search & filters** — filter the schedule and map by category, location, and date range, plus free-text search by title
- **Categorized events** — Shahi Snan, Aarti, Satsang, Procession, Cultural Program, Other
- **Responsive, themed UI** — warm saffron/maroon design system built on Bootstrap 5 + EJS

## Tech Stack

- **Backend:** Node.js, Express 5
- **Database:** MongoDB with Mongoose
- **Templating:** EJS
- **Auth:** express-session + bcryptjs (password hashing)
- **Map:** Leaflet.js + OpenStreetMap tiles
- **Styling:** Bootstrap 5 + custom CSS theme

## Project Structure

```
mahapath/
├── controllers/       # Route handler logic
│   ├── authController.js
│   └── mainController.js
├── middleware/
│   └── auth.js         # requireAuth, attachUser
├── models/
│   ├── event.js
│   └── user.js
├── routes/
│   ├── auth.js          # /login, /register, /logout
│   └── index.js          # /, /map, /schedule, /add, /edit, /delete
├── views/                # EJS templates
│   ├── partials/         # navbar, footer, head
│   └── *.ejs
├── public/                # Static assets (CSS, images)
├── utils/
│   └── locationCoords.js # Known location → [lat, lng] map
├── server.js
└── package.json
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

| Variable         | Description                                  |
|------------------|-----------------------------------------------|
| `MONGO_URI`      | MongoDB connection string                     |
| `PORT`           | Port to run the server on (default `3000`)    |
| `SESSION_SECRET` | Random string used to sign session cookies    |

### 3. Run the app
```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start
```

Visit `http://localhost:3000`.

### 4. Create an organizer account
Go to `/register` to create an organizer login — this lets you add/edit/delete events. Browsing the Home, Map, and Schedule pages doesn't require login.

## Adding a Location to the Map

Event locations must exist in `utils/locationCoords.js` to be plotted on the map. To add a new landmark:

```js
// utils/locationCoords.js
"New Landmark Name": [latitude, longitude],
```

Then add the same name as an `<option>` in `views/add.ejs` and `views/edit.ejs` location dropdowns.

## Notes for Deployment

- This project currently uses the default in-memory session store, which is fine for local development but **resets on server restart and doesn't scale across multiple instances**. For production, swap in `connect-mongo` to persist sessions in MongoDB.
- Set `SESSION_SECRET` to a long, random value in production (never commit real secrets — see `.gitignore`).
- Consider adding rate-limiting on `/login` and `/register` before deploying publicly.

## License

ISC
