require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/database');
const { initializeFirebase } = require('./config/firebase');

const PORT = process.env.PORT || 4000;

// Initialize Firebase
initializeFirebase();

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || '*',
        methods: ['GET', 'POST']
    }
});

// Make io accessible to routes
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Join room for specific class/section
    socket.on('join:class', ({ class: className, section }) => {
        const room = `${className}-${section}`;
        socket.join(room);
        console.log(`📚 Socket ${socket.id} joined room: ${room}`);
    });

    // Leave room
    socket.on('leave:class', ({ class: className, section }) => {
        const room = `${className}-${section}`;
        socket.leave(room);
        console.log(`📚 Socket ${socket.id} left room: ${room}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║  Solomon's Secondary School Management System - Server   ║
╠═══════════════════════════════════════════════════════════╣
║  🚀 Server running on port ${PORT}                         ║
║  🌍 Environment: ${process.env.NODE_ENV || 'development'}                       ║
║  📡 Socket.IO enabled                                     ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

module.exports = server;
