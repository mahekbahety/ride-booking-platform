# Ride-Booking Platform Backend API

This document describes the HTTP API provided by the backend of the Ride-Booking Platform.

## Authentication

Protected endpoints accept a JWT in the header:

```http
Authorization: Bearer <token>
```

User endpoints require a user token; captain endpoints require a captain token. The authentication middleware also accepts an authentication cookie named `token`. Login and registration return a JWT in the JSON response.

Validation failures generally return `400` with an `errors` array. Error examples below show the response shape; messages depend on the failure.

## Users

### `POST /api/users/register`

Register a user. No authentication required.

**Request body**

| Field | Type | Required | Validation |
|---|---|---:|---|
| `email` | string | Yes | Must be a valid email |
| `fullname.firstname` | string | Yes | At least 2 characters |
| `fullname.lastname` | string | Yes | At least 2 characters |
| `password` | string | Yes | At least 6 characters |

**Example request**

```http
POST /api/users/register
Content-Type: application/json
```

```json
{
  "email": "rider@example.com",
  "fullname": {
    "firstname": "Taylor",
    "lastname": "Rider"
  },
  "password": "example-password"
}
```

**Success response — `201 Created`**

```json
{
  "token": "<jwt>",
  "user": {
    "_id": "<user-id>",
    "email": "rider@example.com",
    "fullname": {
      "firstname": "Taylor",
      "lastname": "Rider"
    }
  }
}
```

**Possible errors**

- `400` — validation failed or the user already exists.

```json
{
  "message": "User already exists"
}
```

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

---

### `POST /api/users/login`

Log in a user. No authentication required.

**Request body**

| Field | Type | Required | Validation |
|---|---|---:|---|
| `email` | string | Yes | Must be a valid email |
| `password` | string | Yes | At least 6 characters |

**Example request**

```http
POST /api/users/login
Content-Type: application/json
```

```json
{
  "email": "rider@example.com",
  "password": "example-password"
}
```

**Success response — `200 OK`**

```json
{
  "token": "<jwt>",
  "user": {
    "_id": "<user-id>",
    "email": "rider@example.com"
  }
}
```

The controller also sets the `token` cookie.

**Possible errors**

- `400` — validation failed.
- `401` — email or password is incorrect.

```json
{
  "message": "Invalid Email or Password"
}
```

---

### `GET /api/users/profile`

Get the authenticated user’s profile. User JWT required.

**Example request**

```http
GET /api/users/profile
Authorization: Bearer <user-jwt>
```

**Success response — `200 OK`**

```json
{
  "user": {
    "_id": "<user-id>",
    "email": "rider@example.com"
  }
}
```

**Possible errors**

- `401` — token is missing, invalid, or blacklisted.

```json
{
  "message": "Unauthorized"
}
```

---

### `POST /api/users/logout`

Log out the authenticated user and blacklist the token. User JWT required.

**Example request**

```http
POST /api/users/logout
Authorization: Bearer <user-jwt>
```

**Success response — `200 OK`**

```json
{
  "message": "Logged out successfully"
}
```

**Possible errors**

- `401` — token is missing, invalid, or blacklisted.

```json
{
  "message": "Unauthorized"
}
```

## Captains

### `POST /api/captains/register`

Register a captain and vehicle. No authentication required.

**Request body**

| Field | Type | Required | Validation |
|---|---|---:|---|
| `email` | string | Yes | Must be a valid email |
| `fullname.firstname` | string | Yes | At least 2 characters |
| `fullname.lastname` | string | Yes | At least 2 characters |
| `password` | string | Yes | At least 6 characters |
| `vehicle.color` | string | Yes | At least 3 characters |
| `vehicle.plate` | string | Yes | At least 3 characters |
| `vehicle.capacity` | integer | Yes | At least 1 |
| `vehicle.vehicleType` | string | Yes | `car`, `moto`, or `auto` |

**Example request**

```http
POST /api/captains/register
Content-Type: application/json
```

```json
{
  "email": "captain@example.com",
  "fullname": {
    "firstname": "Jordan",
    "lastname": "Captain"
  },
  "password": "example-password",
  "vehicle": {
    "color": "blue",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

**Success response — `201 Created`**

```json
{
  "token": "<jwt>",
  "captain": {
    "_id": "<captain-id>",
    "email": "captain@example.com"
  }
}
```

**Possible errors**

- `400` — validation failed or the captain already exists.

```json
{
  "message": "Captain already exists"
}
```

---

### `POST /api/captains/login`

Log in a captain. No authentication required.

**Request body**

| Field | Type | Required | Validation |
|---|---|---:|---|
| `email` | string | Yes | Must be a valid email |
| `password` | string | Yes | At least 6 characters |

**Example request**

```http
POST /api/captains/login
Content-Type: application/json
```

```json
{
  "email": "captain@example.com",
  "password": "example-password"
}
```

**Success response — `200 OK`**

```json
{
  "token": "<jwt>",
  "captain": {
    "_id": "<captain-id>",
    "email": "captain@example.com"
  }
}
```

**Possible errors**

- `400` — validation failed.
- `401` — email or password is incorrect.

```json
{
  "message": "Invalid Email or Password"
}
```

---

### `GET /api/captains/profile`

Get the authenticated captain’s profile. Captain JWT required.

**Example request**

```http
GET /api/captains/profile
Authorization: Bearer <captain-jwt>
```

**Success response — `200 OK`**

```json
{
  "captain": {
    "_id": "<captain-id>",
    "email": "captain@example.com"
  }
}
```

**Possible errors**

- `401` — token is missing, invalid, or blacklisted.

```json
{
  "message": "Unauthorized"
}
```

---

### `POST /api/captains/logout`

Log out the authenticated captain and blacklist the token. Captain JWT required.

**Example request**

```http
POST /api/captains/logout
Authorization: Bearer <captain-jwt>
```

**Success response — `200 OK`**

```json
{
  "message": "Logged out successfully"
}
```

**Possible errors**

- `401` — token is missing, invalid, or blacklisted.

```json
{
  "message": "Unauthorized"
}
```

## Maps

All map endpoints require a user JWT.

### `GET /api/maps/get-coordinates`

Geocode an address.

**Query parameters**

| Parameter | Type | Required | Validation |
|---|---|---:|---|
| `address` | string | Yes | At least 3 characters |

**Example request**

```http
GET /api/maps/get-coordinates?address=Connaught%20Place%2C%20Delhi
Authorization: Bearer <user-jwt>
```

**Success response — `200 OK`**

The response is the coordinate object returned by the map service. Example:

```json
{
  "ltd": 28.6315,
  "lng": 77.2167
}
```

**Possible errors**

- `400` — query validation failed.
- A service-specific status, or `500`, if geocoding fails.

```json
{
  "message": "Internal server error"
}
```

---

### `GET /api/maps/get-distance-time`

Get route distance and travel time between two addresses.

**Query parameters**

| Parameter | Type | Required | Validation |
|---|---|---:|---|
| `origin` | string | Yes | At least 3 characters |
| `destination` | string | Yes | At least 3 characters |

**Example request**

```http
GET /api/maps/get-distance-time?origin=Connaught%20Place%2C%20Delhi&destination=India%20Gate%2C%20Delhi
Authorization: Bearer <user-jwt>
```

**Success response — `200 OK`**

The response is the distance/time object returned by the map service. Its fields depend on the service result.

```json
{
  "distance": "<distance result>",
  "duration": "<duration result>"
}
```

**Possible errors**

- `400` — query validation failed.
- A service-specific status, or `500`, if route lookup fails.

```json
{
  "message": "Internal server error"
}
```

---

### `GET /api/maps/get-suggestions`

Get autocomplete suggestions for a location search.

**Query parameters**

| Parameter | Type | Required | Validation |
|---|---|---:|---|
| `input` | string | Yes | At least 3 characters |

**Example request**

```http
GET /api/maps/get-suggestions?input=Connaught%20Place
Authorization: Bearer <user-jwt>
```

**Success response — `200 OK`**

The response is the suggestions array returned by the map service. Example:

```json
[
  {
    "description": "<location suggestion>"
  }
]
```

**Possible errors**

- `400` — query validation failed.
- A service-specific status, or `500`, if suggestions cannot be retrieved.

```json
{
  "message": "Internal server error"
}
```

## Rides

### `POST /api/rides/create`

Create a ride request. User JWT required.

**Request body**

| Field | Type | Required | Validation |
|---|---|---:|---|
| `pickup` | string | Yes | At least 3 characters |
| `destination` | string | Yes | At least 3 characters |
| `vehicleType` | string | Yes | `auto`, `car`, or `moto` |

**Example request**

```http
POST /api/rides/create
Authorization: Bearer <user-jwt>
Content-Type: application/json
```

```json
{
  "pickup": "Connaught Place, Delhi",
  "destination": "India Gate, Delhi",
  "vehicleType": "car"
}
```

**Success response — `201 Created`**

Returns the created ride document.

```json
{
  "_id": "<ride-id>",
  "pickup": "Connaught Place, Delhi",
  "destination": "India Gate, Delhi",
  "vehicleType": "car"
}
```

The controller also emits a `new-ride` Socket.IO event to captains found near the pickup location.

**Possible errors**

- `400` — request validation failed.
- `401` — user authentication failed.
- `500` — ride creation or a dependent service failed.

```json
{
  "message": "<error message>"
}
```

---

### `GET /api/rides/get-fare`

Get fare estimates. User JWT required.

**Query parameters**

| Parameter | Type | Required | Validation |
|---|---|---:|---|
| `pickup` | string | Yes | At least 3 characters |
| `destination` | string | Yes | At least 3 characters |

**Example request**

```http
GET /api/rides/get-fare?pickup=Connaught%20Place%2C%20Delhi&destination=India%20Gate%2C%20Delhi
Authorization: Bearer <user-jwt>
```

**Success response — `200 OK`**

Returns the fare object from the ride service. Example values and object contents depend on the service calculation.

```json
{
  "auto": "<fare>",
  "car": "<fare>",
  "moto": "<fare>"
}
```

**Possible errors**

- `400` — query validation failed.
- `401` — user authentication failed.
- `500` — fare calculation failed.

```json
{
  "message": "<error message>"
}
```

---

### `POST /api/rides/confirm`

Confirm a ride request. Captain JWT required.

**Request body**

| Field | Type | Required | Validation |
|---|---|---:|---|
| `rideId` | string | Yes | Must be a MongoDB ObjectId |

**Example request**

```http
POST /api/rides/confirm
Authorization: Bearer <captain-jwt>
Content-Type: application/json
```

```json
{
  "rideId": "<ride-id>"
}
```

**Success response — `200 OK`**

Returns the confirmed ride document.

```json
{
  "_id": "<ride-id>",
  "status": "<updated status>"
}
```

The controller emits a `ride-confirmed` Socket.IO event to the user.

**Possible errors**

- `400` — ride ID validation failed.
- `401` — captain authentication failed.
- `500` — ride confirmation failed.

```json
{
  "message": "<error message>"
}
```

---

### `GET /api/rides/start-ride`

Start a confirmed ride using its OTP. Captain JWT required.

**Query parameters**

| Parameter | Type | Required | Validation |
|---|---|---:|---|
| `rideId` | string | Yes | Must be a MongoDB ObjectId |
| `otp` | string | Yes | Exactly 6 characters |

**Example request**

```http
GET /api/rides/start-ride?rideId=<ride-id>&otp=123456
Authorization: Bearer <captain-jwt>
```

**Success response — `200 OK`**

Returns the updated ride document.

```json
{
  "_id": "<ride-id>",
  "status": "<updated status>"
}
```

The controller emits a `ride-started` Socket.IO event to the user.

**Possible errors**

- `400` — query validation failed.
- `401` — captain authentication failed.
- `500` — ride could not be started, including an invalid OTP.

```json
{
  "message": "<error message>"
}
```

---

### `POST /api/rides/end-ride`

End a ride. Captain JWT required.

**Request body**

| Field | Type | Required | Validation |
|---|---|---:|---|
| `rideId` | string | Yes | Must be a MongoDB ObjectId |

**Example request**

```http
POST /api/rides/end-ride
Authorization: Bearer <captain-jwt>
Content-Type: application/json
```

```json
{
  "rideId": "<ride-id>"
}
```

**Success response — `200 OK`**

Returns the completed ride document.

```json
{
  "_id": "<ride-id>",
  "status": "<updated status>"
}
```

The controller emits a `ride-ended` Socket.IO event to the user.

**Possible errors**

- `400` — ride ID validation failed.
- `401` — captain authentication failed.
- `500` — ride could not be ended.

```json
{
  "message": "<error message>"
}
```

## Notes

- Ride and profile response fields are based on the Mongoose documents returned by the services; exact fields depend on the model definitions.
- Map response properties and errors depend on the configured geocoding and routing services.
- Socket.IO events are sent separately from the HTTP response. Relevant events include `new-ride`, `ride-confirmed`, `ride-started`, and `ride-ended`.