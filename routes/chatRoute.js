//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import express from 'express';
import { ChatController } from '../controllers/chat_controller.js';
import { getErrorMessage } from '../utility/utils.js';

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// CHAT ROUTE
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const router = express.Router();

// GET-routes for rendering the webpages.
router.use((req, res, next) => {
    console.log("CHAT ROUTER HIT:", req.method, req.originalUrl);
    next();
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

router.get("/create", (request, response) => {
    response.render("chat");
});

// POST-routes for handling the form data.
router.post("/create", ChatController.create);
router.post("/delete/:id", ChatController.remove);

export default router;