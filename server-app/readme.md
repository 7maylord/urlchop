# UrlChop URL Shortener

Brief is the new black. UrlChop is a simple tool that makes URLs as short as possible. Inspired by the importance of brevity in today's world, UrlChop aims to disrupt the URL-shortening industry and give competitors like bit.ly and ow.ly a run for their money within 2 years.

## Features

- **URL Shortening**: Paste a long URL into UrlChop and get a shorter URL automatically generated.
- **Custom URLs**: Customize your shortened URLs to reflect your brand or content.
- **QR Code Generation**: Generate QR codes for your shortened URLs and download them for use in promotional materials.
- **Analytics**: Track the performance of your shortened URLs, including the number of clicks and their origins.
- **Link History**: View the history of links you’ve created for easy reference and reuse.

## Requirements

- Node.js (v14 or higher)
- MongoDB
- Redis
- npm

## Setup and Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/7maylord/urlchop.git
   cd urlchop

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
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

4. Build the Project:
    ```sh
    npm run build
    ```
5. Start the Server:
    ```sh
    npm run start
    ```
6. Development Mode: To run the server in development mode with hot-reloading.
    ```sh
    npm run dev
    ```
## API Documentation
The API is documented using OpenAPI. You can view the documentation at http://localhost:3000/api-docs after starting the server.

# Available Scripts
- npm start: Runs the compiled server.
- npm run dev: Runs the server in development mode using ts-node-dev.
- npm run build: Compiles the TypeScript code.
- npm test: Runs the tests.

# Contributing
Contributions are welcome! Please open an issue or submit a pull request for any changes.