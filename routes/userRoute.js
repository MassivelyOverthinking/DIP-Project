import express from 'express';
import { login, createUser } from '../controllers/user_controller.js';

const router = express.Router();

router.get('/login', (request, response) => {
    response.render('login');
});

router.get('/register', (request, response) => {
    response.render('register');
});

router.post('/login', login);
router.post('/register', createUser);

export default router;