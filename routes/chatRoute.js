//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import express from 'express';
import { ChatController } from '../controllers/chat_controller.js';

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// CHAT ROUTE
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const router = express.Router();

// GET-routes for rendering the webpages.
router.get("/home", (request, response) => {
    response.render("home", {
        user: request.session.user 
    });
});

router.get("/create", (request, response) => {
    response.render("chat");
});

// POST-routes for handling the form data.
router.post("/create", ChatController.create);

export default router;