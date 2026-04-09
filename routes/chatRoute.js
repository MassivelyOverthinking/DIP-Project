//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import express from "express";
import { ChatController } from "../controllers/chatController.js";
import messageRouter from "./messageRoute.js";

// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


const router = express.Router();

// Opret chat
router.post("/", (req, res) => {
    ChatController.create(req, res);
});

// Opdater chat
router.put("/:id", (req, res) => {
    ChatController.update(req, res);
});

// Slet chat
router.delete("/:id", (req, res) => {
    ChatController.remove(req, res);
});

// Nested messages
router.use("/:id/messages", messageRouter);

export default router;
