import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user';
import mongoose, { Types } from 'mongoose';
import dotenv from 'dotenv';
import connectToMongoDB from '../src/config/connectMongoDb';

// Load environment variables from .env.test file
dotenv.config({ path: '.env.test' });

// Define a test user interface
interface TestUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  urls?: Types.ObjectId[];
  token?: string;
}

// Define test users
const testUser: TestUser = {
  _id: new mongoose.Types.ObjectId(),
  username: 'testuser',
  email: 'testuser@example.com',
  password: 'TestPassword123',
};

let token: string;
let userId: string;
let urlId: string;

beforeAll(async () => {
  // Connect to the database
  await connectToMongoDB();

  // Register a test user
  await request(app)
    .post('/api/auth/register')
    .send(testUser)
    .then((res) => {
      userId = res.body.user._id;
      token = res.body.token;
    });
});

afterAll(async () => {
  // Clean up database and disconnect
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  await mongoose.disconnect();
});

describe('Auth Controller Tests', () => {
  it('should register a new user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'NewPassword123',
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('message', 'User created successfully');
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('_id');
        expect(res.body.user).not.toHaveProperty('password');
      });
  });

  it('should reject registration with invalid input', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: '', email: 'not-an-email', password: '123' })
      .expect(422)
      .then((res) => {
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors.length).toBeGreaterThan(0);
      });
  });

  it('should not register a user with an existing email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(409)
      .then((res) => {
        expect(res.body).toHaveProperty('error', 'User already exists');
      });
  });

  it('should not login with invalid credentials', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword',
      })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('error', 'Invalid credentials');
      });
  });

  it('should login with valid credentials', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('_id');
        expect(res.body.user.email).toBe(testUser.email);
        expect(res.body.user).not.toHaveProperty('password');
        token = res.body.token;
      });
  });

  it('should get the current user', async () => {
    await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('_id', userId);
        expect(res.body).toHaveProperty('email', testUser.email);
        expect(res.body).not.toHaveProperty('password');
      });
  });
});

describe('URL Controller Tests', () => {
  it('should reject shortening without auth', async () => {
    await request(app)
      .post('/api/url')
      .send({ longUrl: 'http://example.com' })
      .expect(401);
  });

  it('should reject an invalid URL', async () => {
    await request(app)
      .post('/api/url')
      .set('Authorization', `Bearer ${token}`)
      .send({ longUrl: 'not-a-url' })
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('message', 'Invalid URL');
      });
  });

  it('should reject a custom ID that is already taken', async () => {
    await request(app)
      .post('/api/url')
      .set('Authorization', `Bearer ${token}`)
      .send({ longUrl: 'http://first.example.com', customId: 'dupe-slug' })
      .expect(201);

    await request(app)
      .post('/api/url')
      .set('Authorization', `Bearer ${token}`)
      .send({ longUrl: 'http://second.example.com', customId: 'dupe-slug' })
      .expect(409);
  });

  it('should 404 on redirect for an unknown short URL', async () => {
    await request(app)
      .get('/api/does-not-exist')
      .expect(404)
      .then((res) => {
        expect(res.body).toHaveProperty('error', 'URL not found');
      });
  });

  it('should 404 when deleting a URL that does not exist', async () => {
    await request(app)
      .delete('/api/url/does-not-exist')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then((res) => {
        expect(res.body).toHaveProperty('error', 'URL not found or not authorized');
      });
  });

  it('should shorten a URL', async () => {
    await request(app)
      .post('/api/url')
      .set('Authorization', `Bearer ${token}`)
      .send({
        longUrl: 'http://example.com',
        customId: 'custom123',
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('shortUrl');
        urlId = res.body.urlId;
      });
  }, 10000); // Increased the test timeout to 10 seconds.

  it('should redirect a URL', async () => {
    await request(app)
      .get(`/api/${urlId}`)
      .expect(302)
      .then((res) => {
        expect(res.header.location).toBe('http://example.com');
      });
  });

  it('should get URL analytics', async () => {
    await request(app)
      .get(`/api/analytics/${urlId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('clicks');
      });
  });

  it('should get user link history', async () => {
    await request(app)
      .get(`/api/history/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('urls');
        expect(res.body.urls).toBeInstanceOf(Array);
      });
  });

  it('should delete a URL', async () => {
    await request(app)
      .delete(`/api/url/${urlId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('message', 'URL deleted successfully');
      });
  });
});
