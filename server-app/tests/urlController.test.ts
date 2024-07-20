import request from 'supertest';
import app from '../src/app';

describe('URL Controller', () => {
    it('should create a short URL', async () => {
        const res = await request(app)
            .post('/api/urls/shorten')
            .send({ longUrl: 'https://example.com' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('shortUrl');
    });

    it('should get analytics for a URL', async () => {
        const shortUrl = 'testShortUrl';
        const res = await request(app).get(`/api/urls/${shortUrl}/analytics`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('clicks');
    });

    it('should get link history', async () => {
        const res = await request(app).get('/api/urls/history');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});
