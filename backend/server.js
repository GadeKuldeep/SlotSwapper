import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import swapRoutes from './routes/swapRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

// CORS setup: allow multiple origins and read from env var when provided
// Set ALLOWED_ORIGINS in production to a comma-separated list (no trailing slashes),
// e.g. 'https://slotswappe1.netlify.app,https://your-other-domain.com'
const defaultOrigins = ['http://localhost:5173', 'http://localhost:3000'];
const productionDefault = ['https://slotswappe1.netlify.app'];

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
  : process.env.NODE_ENV === 'production'
  ? productionDefault
  : defaultOrigins;

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Middleware: dynamically validate origin and support credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests like Postman (no origin)
      if (!origin) return callback(null, true);
      const allowed = allowedOrigins.indexOf(origin) !== -1;
      if (!allowed) {
        console.warn('Blocked CORS origin:', origin);
      }
      return callback(null, allowed);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', swapRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
