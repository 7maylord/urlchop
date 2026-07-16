# UrlChop URL Shortener

Brief is the new black. UrlChop is a simple tool that makes URLs as short as possible. Inspired by the importance of brevity in today's world, This project is built as capstone project for [AltSchool](https://altschoolafrica.com/)

## Features

- **URL Shortening**: Paste a long URL into UrlChop and get a shorter URL automatically generated.
- **Custom URLs**: Customize your shortened URLs to reflect your brand or content.
- **QR Code Generation**: Generate QR codes for your shortened URLs and download them for use in promotional materials.
- **Analytics**: Track the performance of your shortened URLs, including the number of clicks and their origins.
- **Link History**: View the history of links you’ve created for easy reference and reuse.

## Requirements

- Node.js >= 20 and [pnpm](https://pnpm.io) (this is a pnpm workspace)
-   **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4
-   **Backend**: Node.js, TypeScript, Express 5, MongoDB (Mongoose), and Redis
-   **Deployment**: Vercel (client) / Render (server)

## Usage

### Web Interface

-   Frontend application is deployed  at [urlchop.vercel.app](https://urlchop.vercel.app/)

### API

- Backend is deployed at [uchop.onrender.com](https://uchop.onrender.com)
- Deployed documentation is at [uchop.onrender.com/api-docs](https://uchop.onrender.com/api-docs)


## Setup and Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/7maylord/urlchop.git
   cd urlchop

2. Install dependencies (once, from the repo root — installs both apps):
    ```sh
    pnpm install
    ```

3. Set up environment variables:
    Create a `.env` file in the `server-app` directory (see `server-app/.env.sample`):
    ```env
    # Server
    PORT=3030
    BASE=http://localhost:3030          # base used to build short URLs

    # Database
    MONGO_URI=mongodb://localhost:27017/urlchop

    # Redis (optional — the app runs uncached if Redis is not configured)
    REDIS_HOST=localhost
    REDIS_PORT=6379
    REDIS_PASSWORD=your_redis_password

    # Rate limiter
    RATE_LIMIT_WINDOW=15
    RATE_LIMIT_MAX=100

    # Auth & QR
    JWT_SECRET=your_jwt_secret          # required — the server refuses to start without it
    QR_API_URL=https://api.qrserver.com/v1/create-qr-code/

    # CORS allowlist (comma-separated)
    ALLOWED_ORIGINS=http://localhost:5174
    ```

    Create a `.env` file in the `client-app` directory (see `client-app/.env.sample`):
    ```env
    VITE_APP_ENV=development
    VITE_API_URL=http://localhost:3030/api   # backend server
    VITE_APP_URL=http://localhost:5174       # frontend server
    ```

4. Run in development (from the repo root):
    ```sh
    pnpm dev          # runs client + server together
    pnpm dev:server   # backend only (ts-node-dev, hot reload)
    pnpm dev:client   # frontend only (Vite)
    ```

5. Build and test (from the repo root):
    ```sh
    pnpm build        # builds both apps
    pnpm test         # runs the server test suite
    pnpm lint         # lints the client
    ```

## API Documentation
The API is documented using OpenAPI. You can view the documentation on [http://localhost:3030/api-docs](http://localhost:3030/api-docs) after starting the server.


## Available Scripts (run from the repo root)
- `pnpm dev`: Runs the client and server together.
- `pnpm dev:server` / `pnpm dev:client`: Runs one app in development mode.
- `pnpm build`: Builds both apps.
- `pnpm test`: Runs the server test suite.
- `pnpm lint`: Lints the client.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any changes.