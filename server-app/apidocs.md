API Documentation
The API is documented using OpenAPI. You can view the documentation at http://localhost:3000/api-docs after starting the server.

Authentication
Register User

Endpoint: /api/auth/register
Method: POST
Body:
json
Copy code
{
  "username": "your_username",
  "email": "your_email",
  "password": "your_password"
}
Login User

Endpoint: /api/auth/login
Method: POST
Body:
json
Copy code
{
  "email": "your_email",
  "password": "your_password"
}
Protected Routes

Include the following header in requests to protected routes:

makefile
Copy code
Authorization: Bearer <token>
URL Management
Create Short URL

Endpoint: /api/urls
Method: POST
Requires Authentication
Body:
json
Copy code
{
  "longUrl": "http://example.com",
  "customUrl": "custom-url" // optional
}
Redirect Short URL

Endpoint: /api/urls/:shortUrl
Method: GET
Get URL Analytics

Endpoint: /api/urls/analytics/:shortUrl
Method: GET
Requires Authentication
Get User Link History

Endpoint: /api/urls/history
Method: GET
Requires Authentication