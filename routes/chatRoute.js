//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import express, { request } from 'express';
import { ChatController } from '../controllers/chat_controller.js';
import { getErrorMessage } from '../utility/utils.js';

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// CHAT ROUTE
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const router = express.Router();

// GET-routes for rendering the webpages.

// Test for logging the route hits.
router.use((req, res, next) => {
    console.log("CHAT ROUTER HIT:", req.method, req.originalUrl);
    next();
});

router.get("/create", (request, response) => {
    response.render("chat");
});

router.get("/home", (request, response) => {
    response.render("home", {
        user: request.session.user,
        chats: request.session.chats,
    });
});

router.get("/no-access/:type", (request, response) => {
    const { type } = request.params;
    const errorMessage = getErrorMessage(type);
    
    response.render("error", { 
        error: errorMessage
    });
});

router.get("/:id", (request, response) => {
    const chatId = request.params.id;
    const chatObject = ChatController.findById(chatId);
    
    response.render("chatroom", { 
        user: request.session.user, 
        chat: chatObject
    });
});

// POST-routes for handling chatroom creation and deletion
router.post("/create", ChatController.create);
router.post("/delete/:id", ChatController.delete);

export default router;