import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Debug middleware to log auth requests
router.use((req, res, next) => {
  console.log(`Auth route hit: ${req.method} ${req.originalUrl}`);
  next();
});

router.post('/signup', registerUser);
router.post('/login', loginUser);

export default router;