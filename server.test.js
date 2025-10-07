// server.test.js

import { test, after, describe } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';

// Import the Express app and the HTTP server from the modified server.js
import { app, server } from './server.js';

// --- Cleanup Hook ---
// After all tests run, close the HTTP server to prevent "Address already in use" errors.
after(async () => {
    if (server) {
        // Use server.close() to shut down the server gracefully
        await new Promise(resolve => server.close(resolve));
        console.log('\n--- Test server shut down successfully ---');
    }
});
// --------------------


describe('Server Initialization and Basic Routes', () => {

    // IMPORTANT: This test requires a basic route to exist in your 'src/app.js'
    // E.g., app.get('/', (req, res) => res.status(200).send('OK'));
    test('GET / should return 200 OK', async () => {
        // Use supertest to make a request to the imported Express app
        const response = await request(app)
            .get('/');
        
        // Assert the HTTP status code
        assert.strictEqual(response.statusCode, 200, 'Expected status code to be 200');
    });

    // Example Test: Check a specific API endpoint
    // Replace '/api/health' with an actual route from your application
    test('GET /api/health should return application status', async () => {
        // Assuming you have a route that returns JSON data
        const response = await request(app)
            .get('/api/health')
            .expect('Content-Type', /json/); 

        assert.strictEqual(response.statusCode, 200, 'Expected status code for health check to be 200');
        
        // Example assertion based on expected JSON structure
         assert.ok(response.body.status === 'OK', 'Expected status property to be "OK"');
    });

    // You can add more tests for POST, PUT, DELETE routes here...
    
});