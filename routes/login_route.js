import express from 'express';
import { validateUser } from '../controllers/user_controller.js';

const router = express.Router();

router.post('/login', validateUser());

export default router;