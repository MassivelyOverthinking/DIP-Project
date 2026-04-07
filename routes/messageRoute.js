import express from 'express';

const router = express.Router();

router.post('/send', login);
router.post('/delete', user);

export default router;