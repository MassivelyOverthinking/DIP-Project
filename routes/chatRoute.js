import express from 'express';

const router = express.Router();

router.post('/create', login);
router.post('/delete', user);

export default router;