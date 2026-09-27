# Ride-Booking Platform

A full-stack ride-booking platform with separate experiences for riders and captains.  
It supports ride requests, fare estimates, location search, and real-time ride updates.

## Features

- **Dual role system** — separate registration, login, and dashboards for riders and captains
- **Secure authentication** — JWT-based auth with protected routes; tokens are blacklisted on logout to prevent reuse
- **Ride booking flow** — riders enter pickup and destination, choose a vehicle type (auto, car, or moto), and get a fare estimate before confirming
- **OTP-verified rides** — each ride is assigned a one-time password, used to confirm the correct rider-captain match at pickup
- **Real-time captain matching** — nearby captains are notified instantly via Socket.IO when a new ride request is created
- **Live ride tracking** — captain's live location is streamed to the rider in real time and rendered on a Leaflet map during an active ride
- **Location search & autocomplete** — address suggestions and geocoding powered by OpenStreetMap services (Nominatim, Photon)
- **Distance & fare calculation** — route distance and duration calculated via OSRM, used to dynamically compute fares per vehicle type
- **Ride status lifecycle** — full flow from request → captain confirmation → ride in progress → completion

## Tech Stack

### Frontend

- React `^19.2.8` and React DOM `^19.2.8`
- Vite `^8.2.0`
- React Router DOM `^7.18.2`
- Leaflet `^1.9.4` and React Leaflet `^5.0.0`
- Socket.IO Client `^4.8.3`
- Axios `^1.19.0`
- Tailwind CSS `^3.4.19`
- GSAP `^3.15.0` and `@gsap/react` `^2.1.2`

### Backend

- Node.js and Express `^5.2.1`
- MongoDB with Mongoose `^9.9.1`
- Socket.IO `^4.8.3`
- JWT authentication with `jsonwebtoken` `^9.0.3`
- `bcrypt` `^6.0.0` for password hashing
- Axios `^1.19.0` for HTTP requests
- OpenStreetMap services: Nominatim, Photon, and OSRM

## Project Structure

```text
uber/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/       # Ride, vehicle, location, and tracking UI
│       ├── context/          # User, captain, and socket contexts
│       └── pages/            # Rider and captain screens
├── backend/
│   ├── controllers/          # API request handlers
│   ├── database/             # Database connection
│   ├── middlewares/          # Authentication middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── services/              # Ride, map, user, and captain logic
│   ├── app.js
│   ├── server.js
│   └── socket.js
└── README.md
```

## Local Setup

Requirements: Node.js **20.19.0 or newer**, npm, and a MongoDB instance. The backend's MongoDB and Mongoose dependency versions require this Node.js version.

### 1. Configure environment variables

The backend requires `JWT_SECRET`. Configure the MongoDB connection variable used in `backend/database/database.js` as well. Check the frontend source for any `import.meta.env` variables required for API configuration.

Create local `.env` files as needed. Do not commit secret values.

### 2. Install and run the backend

```bash
cd backend
npm install
node server.js
```

The backend manifest also defines `npm run dev` using `nodemon`, but does not list `nodemon` as a dependency. To use that command, install it as a development dependency first:

```bash
npm install --save-dev nodemon
npm run dev
```

### 3. Install and run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Use the local URL printed by Vite to open the application.

## API Documentation

See [`backend/README.md`](backend/README.md) for the backend API documentation.