//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import express from 'express';
import { getErrorMessage } from '../utility/utils.js';
import { UserController } from '../controllers/user_controller.js';

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// USER ROUTE
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const router = express.Router();

// GET-routes for rendering the webpages.
router.use((req, res, next) => {
    console.log("USER ROUTER HIT:", req.method, req.originalUrl);
    next();
});

router.get("/login", (request, response) => {
    response.render("login");
});

router.get("/success", (request, response) => {
    response.render("success");
});

router.get("/register", (request, response) => {
    response.render("register");
});

router.get("/no-access/:type", (request, response) => {
    const { type } = request.params;
    const errorMessage = getErrorMessage(type);
    
    response.render("error", { 
        error: errorMessage
    });
});

router.get("/admin", (request, response) => {
    const users = UserController.getAllUsers();
    const owner = request.session.user.id;
    console.log("Admin users:", users);
    
    response.render("admin", {
        users: users,
        owner: owner,
    });
});

router.get("/change-role/:id", (request, response) => {
    const { id } = request.params;
    console.log("Changing role for user ID:", id);

    response.render("role", {
        userId: id,
    });
});

router.get("/logout", (request, response) => {
    request.session.destroy();
    response.redirect("/user/login");
});

// POST-routes for handling the form data.
router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.post("/update", UserController.updateUserLevel);
router.post("/delete/:id", UserController.deleteUser);

export default router;