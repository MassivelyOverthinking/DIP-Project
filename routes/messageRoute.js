//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import express from 'express';
import {
    sendMessage,
    getMessage,
    editMessage,
    deleteMessage,
    deleteAllSentMessages,
} from '../controllers/message_controller.js'

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// MESSAGE ROUTE
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const router = express.Router();

router.post('/send', sendMessage);
router.get('/', getMessage);
router.patch('/id:', editMessage);
router.delete('/sent/all', deleteAllSentMessages);
router.delete('/id', deleteMessage)

export default router;