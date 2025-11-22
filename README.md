
This is a **Secure Chat API** built with Node.js, Express, and TypeScript. It provides a backend for a chat app with user authentication, conversations, messaging, and profile picture management. It also supports **real-time chat** via Socket.io and has **Swagger/OpenAPI documentation**.

---

## Key Features

* **Authentication:** Register, Login, Logout, Refresh Token
* **Conversations:** Create and list conversations
* **Messages:** Send messages and fetch conversation messages
* **Users:** List users with pagination
* **Profile Pictures:** Upload, set default, delete
* **Real-time chat:** Powered by Socket.io
* **API Docs:** Swagger/OpenAPI at `/api-docs`

---

## Tech Stack

* Node.js + Express
* TypeScript
* Socket.io for real-time messaging
* PostgreSQL (or MySQL)
* Prisma ORM
* JWT for authentication
* Swagger/OpenAPI for documentation
* Helmet, CORS, compression, rate-limiting for security

---

## Getting Started

1. **Clone the repo**

```bash
git clone https://github.com/yourusername/secure-chat-api.git
cd secure-chat-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

Create a `.env` file in the root:

```
PORT=4000
NODE_ENV=development
DATABASE_URL="mysql://root:@localhost:3306/secure_chat"
JWT_ACCESS_TOKEN_SECRET=access_secret
JWT_REFRESH_TOKEN_SECRET=refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
UPLOADS_DIR=./uploads
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100

```

4. **Setup the database**

* Create the database:

```sql
CREATE DATABASE secure_chat;
```

* Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

* Seed the database:

```bash
npm run prisma:seed
```

5. **Start the server**

* Development mode:

```bash
npm run dev
```

* Production mode:

```bash
npm run build
npm start
```

* Server will run on **[http://localhost:4000](http://localhost:4000)**
* Swagger docs available at **[http://localhost:4000/api-docs](http://localhost:4000/api-docs)**

---

## Testing

* Run all tests:

```bash
npm run test
```

---

## Example API Usage

* **Register a new user:** `POST /auth/register`
* **Login:** `POST /auth/login`
* **Create a conversation:** `POST /conversations`
* **Send a message:** `POST /messages`
* **List messages in a conversation:** `GET /messages/conversations/{id}/messages`
* **Upload profile picture:** `POST /users/{id}/profile-pictures`

> Authentication required for most endpoints. Use **JWT Bearer token**.
