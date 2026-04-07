import express from 'express';
import { validateUser } from '../controllers/user_controller.js';

const router = express.Router();

router.post('/register', user);

export default router;