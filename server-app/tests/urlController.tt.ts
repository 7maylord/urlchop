import request from 'supertest';
import app from '../src/app'; 
import User from '../src/models/user'; 
import mongoose, { Types, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateToken } from '../src/controllers/authController'
import { MongoMemoryServer } from 'mongodb-memory-server';

// Load environment variables from .env file
dotenv.config();

// Define a test user interface
interface User {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    urls?: Schema.Types.ObjectId[];
    token?: string;
  }
  
  // Define test users
const testUser: User= {
  _id: new mongoose.Types.ObjectId(),
  username: 'testuser',
  email: 'testuser@example.com',
  password: 'TestPassword123',
};


let token: string;
let userId: string;
let urlId: string;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Connect to the in-memory database
  mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

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
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Controller Tests', () => {
  it('should register a new user', async () => {
    return request(app)
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
      });
  });

  it('should not register a user with an existing email', async () => {
    return request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('error', 'User already exists');
      });
  });

  it('should not login with invalid credentials', async () => {
    return request(app)
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
    return request(app)
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
        token = res.body.token;
      });
  });

  it('should get the current user', async () => {
    return request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('_id', userId);
        expect(res.body).toHaveProperty('email', testUser.email);
      });
  });
});
describe('URL Controller Tests', () => {
  it('should shorten a URL', async () => {
    return request(app)
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
  });

  it('should redirect a URL', async () => {
    return request(app)
      .get(`/api/${urlId}`)
      .expect(302)
      .then((res) => {
        expect(res.header.location).toBe('http://example.com');
      });
  });

  it('should get URL analytics', async () => {
    return request(app)
      .get(`/api/analytics/${urlId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('clicks');
      });
  });

  it('should get user link history', async () => {
    return request(app)
      .get('/api/history/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('urls');
        expect(res.body.urls).toBeInstanceOf(Array);
      });
  });

  it('should delete a URL', async () => {
    return request(app)
      .delete(`/url/${urlId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('message', 'URL deleted successfully');
      });
  });
});
