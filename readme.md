# UrlChop URL Shortener

Brief is the new black. UrlChop is a simple tool that makes URLs as short as possible. Inspired by the importance of brevity in today's world, This project is built as capstone project for [AltSchool](https://altschoolafrica.com/)

## Features

- **URL Shortening**: Paste a long URL into UrlChop and get a shorter URL automatically generated.
- **Custom URLs**: Customize your shortened URLs to reflect your brand or content.
- **QR Code Generation**: Generate QR codes for your shortened URLs and download them for use in promotional materials.
- **Analytics**: Track the performance of your shortened URLs, including the number of clicks and their origins.
- **Link History**: View the history of links you’ve created for easy reference and reuse.

## Requirements

- npm
-   **Frontend**: React, and TypeScript
-   **Backend**: Node.js, TypeScript, Express, MongoDB, and Redis.
-   **Deployment**: Vercel

## Usage

### Web Interface

-   Frontend application is deployed  at [urlchop.vercel.app](https://urlchop.vercel.app/)

### API

- Backend is deployed at [uchop.onrender.com](https://uchop.onrender.com)
- Deployed documentation is at [uchop.onrender.com/api/docs](https://uchop.onrender.com/api/docs)
## Setup and Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/7maylord/urlchop.git
   cd urlchop

2. Install dependencies:
    ```sh
    cd client-app && npm install
    cd ../server-app && npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the server-app directory and add the following:
    ```env
    # Server configuration
    PORT=3030

    # Database configuration
    REDIS_URL=redis://localhost:6379
    REDIS_HOST=localhost
    REDIS_PORT=6379
    REDIS_PASSWORD=your_redis_password
    MONGODB_URI=mongodb://localhost:27017/urlchop

    # Rate limiter configuration
    RATE_LIMIT_WINDOW=15
    RATE_LIMIT_MAX=100
        
    JWT_SECRET=your_jwt_secret
    QR_API_URL=https://api.qrserver.com/v1/create-qr-code/
      ```
    
    Create a `.env` file in the client-app directory and add the following:
    ```env
    VITE_APP_ENV=development

    #this is your backend server
    VITE_API_URL=http://localhost:3030/api 

    #this is your frontend server
    VITE_APP_URL=http://localhost:5174  
    ```

4. Build the Project:
    ```sh
    # Backend Server
    npm run build
    # Frontend Server
    npm run build
    ```
5. Development Mode: To run the server in development mode with hot-reloading.
    ```sh
    # Backend Server
    npm run start
    # Frontend Server
    npm run dev
    ```

## API Documentation
The API is documented using OpenAPI. You can view the documentation on [http://localhost:3030/api/docs](http://localhost:3030/api/docs) after starting the server.


# Available Scripts
- npm start: Runs the compiled server.
- npm run dev: Runs the server in development mode using ts-node-dev.
- npm run build: Compiles the TypeScript code.
- npm test: Runs the tests.

# Contributing
Contributions are welcome! Please open an issue or submit a pull request for any changes.