require('dotenv').config();
const http = require('http');
const app = require('./app');
const { initSuperAdmin } = require('./controllers/authController');

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

// Initialize Server
const startServer = async () => {
    try {
        // Initialize Super Admin on startup
        await initSuperAdmin();

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
