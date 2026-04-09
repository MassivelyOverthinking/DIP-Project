//IMPORTS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
import express from "express";
import { UserController } from "../controllers/userController.js";
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


const router = express.Router();

// Login
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    UserController.login(req, res);
});

// Registration form (GET)
router.get("/register", (req, res) => {
    res.render("register");
});

// Register action (POST)
router.post("/register", (req, res) => {
    UserController.register(req, res);
});

// Manage / update level (admin)
router.post("/update-level", (req, res) => {
    const { userId, changeLevel } = req.body;

    UserController.updateLevelAdmin(userId, changeLevel)
        .then(() => res.send("Level updated"))
        .catch(err => res.status(404).send("ERROR: " + err));
});

export default router;