# School Management API


## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Setup Instructions](#-setup-instructions)
- [API Reference](#-api-reference)
- [Response Format](#-response-format)
- [Postman Collection Test](#-postman-collection-test)
---

## ✨ Features

- You can run postman tests given in repo directly, everything is configured, just start the backend by visiting it.
-  Add school records with geo-coordinates
-  List schools sorted by proximity (Haversine formula)
-  Input validation with **Zod** (body + query params)
-  Rate limiting, CORS, and security headers (Helmet)
-  Consistent JSON response format across all endpoints
-  MVC architecture

---

## 🛠 Tech Stack

| Layer         | Technology          |
|---------------|---------------------|
| Runtime       | Node.js         |
| Framework     | Express           |
| Database      | MySQL    |
| DB Client     | Prisma  |
| Validation    | Zod                 |
| Rate Limiting | express-rate-limit  |
| Config        | dotenv              |

---

## 📦 Prerequisites

- **Node.js** v18 or higher
- **MySQL** 8.0+ (or MariaDB 10.5+)
- **npm** v9+

---

## 🚀 Setup Instructions

### 1. Clone / Download the project

```bash
git clone https://github.com/Shankey33/Node-APIs-School-Management.git
cd Node-APIs-School-Management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your MySQL database

Log in to MySQL and run:

```sql
CREATE DATABASE IF NOT EXISTS school_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

> The `schools` table is created automatically on first startup.

### 4. Configure environment variables

Create a copy of `.env.example` file with your MySQL credentials as mentioned in the file itself.

### 5. Initialize the database schema with Prisma

Push your Prisma schema to your database to create the necessary tables, then generate the Prisma Client:

```bash
npx prisma db push
npx prisma generate
```

### 6. Start the server

```bash
# Production
npm start

# Development
npm run dev
```
---

## 📡 API Reference

### Base URL
*local:
```
http://localhost:3000
```

---

### `POST /addSchool`

Register a new school.

**Request**

```http
POST /addSchool
Content-Type: application/json

{
  "name":      "St. Pauls School",
  "address":   "Morar, Gwalior, MP, 474002",
  "latitude":  39.7684,
  "longitude": -86.1581
}
```

**Validation Rules**

| Field       | Type   | Rules                          |
|-------------|--------|--------------------------------|
| `name`      | string | Required · 3–255 chars         |
| `address`   | string | Required · 5–500 chars         |
| `latitude`  | number | Required · –90 to +90          |
| `longitude` | number | Required · –180 to +180        |

**Success Response – 201 Created**

```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Springfield Elementary",
    "address": "123 Main Street, Springfield, IL",
    "latitude": 39.7684,
    "longitude": -86.1581
  }
}
```

**Error Response – 422 Validation Failure**

```json
{
  "success": false,
  "message": "Validation failed. Please check your input.",
  "errors": [
    { "field": "name", "message": "Name must be at least 3 characters" },
    { "field": "latitude", "message": "Latitude must be between –90 and +90" }
  ]
}
```

---

### `GET /listSchools`

Retrieve all schools sorted by proximity to the given coordinates.

**Request**

```http
GET /listSchools?latitude=28.6139&longitude=77.2090
```

**Query Parameters**

| Param       | Type   | Rules                   |
|-------------|--------|-------------------------|
| `latitude`  | number | Required · –90 to +90   |
| `longitude` | number | Required · –180 to +180 |

**Success Response – 200 OK**

```json
{
  "success": true,
  "message": "3 school(s) retrieved, sorted by proximity",
  "data": [
    {
      "id": 3,
      "name": "Delhi Public School",
      "address": "Mathura Road, New Delhi",
      "latitude": 28.5494,
      "longitude": 77.2663,
      "distance_km": 8.72
    },
    {
      "id": 1,
      "name": "Ryan International School",
      "address": "Sector 25, Noida, UP",
      "latitude": 28.5706,
      "longitude": 77.3219,
      "distance_km": 12.34
    }
  ]
}
```

---

### `GET /health`

health-check endpoint

```json
{
  "success": true,
  "message": "Server is Up and running",
  "timestamp": "2024-08-01T10:00:00.000Z",
  "environment": "production"
}
```

---

## 📐 Response Format

All API responses follow this consistent envelope:

```json
{
  "success": true | false,
  "message": "Human-readable status message",
  "data": { } | [ ] | null
}
```

Error responses additionally include:

```json
{
  "success": false,
  "message": "What went wrong",
  "errors": [ { "field": "name", "message": "..." } ]
}
```

---

## 📮 Postman Collection Test
I have included a postman test collection `.json` file in the repo root directory, you can import it into Postman to run the API tests. 
