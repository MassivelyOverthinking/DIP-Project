//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import express from 'express';
import { UserController } from '../controllers/user_controller.js';

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// USER ROUTE
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const router = express.Router();

// GET-routes for rendering the webpages.
router.get("/login", (request, response) => {
    response.render("login");
});

router.get("/register", (request, response) => {
    response.render("register");
});

router.get("/no-access", (request, response) => {
    response.render("error");
});

router.get("/success", (request, response) => {
    response.render("success");
});

router.get("/admin", (request, response) => {
    response.render("admin", {
        users: UserController.getAllUsers(),
    });
});

router.get("/logout", (request, response) => {
    request.session.destroy();
    response.redirect("/user/login");
});

// POST-routes for handling the form data.
router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.post("/update", UserController.updateUserChat);

export default router;