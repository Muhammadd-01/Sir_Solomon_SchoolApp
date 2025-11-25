const request = require('supertest');
const app = require('../src/app');

describe('API Health Check', () => {
    it('should return 200 for /health endpoint', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'ok');
    });

    it('should return 404 for unknown routes', async () => {
        const response = await request(app).get('/unknown-route');
        expect(response.status).toBe(404);
    });
});

describe('Authentication', () => {
    it('should reject requests without token', async () => {
        const response = await request(app).get('/api/students');
        expect(response.status).toBe(401);
    });
});
