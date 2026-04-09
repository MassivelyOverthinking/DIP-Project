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
    const users = UserController.getAllUsers();
    console.log("Admin users:", users);
    
    response.render("admin", {
        users: users,
    });
});

router.get("/logout", (request, response) => {
    request.session.destroy();
    response.redirect("/user/login");
});

// POST-routes for handling the form data.
router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.post("/update/:id&:level", UserController.updateUserLevel);
router.post("/delete/:id", UserController.deleteUser);

export default router;