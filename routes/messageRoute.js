//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES

import express from "express"
import { MessageController } from "../controllers/messageController.js"
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX



const router = express.Router({ mergeParams: true });

// Create
router.post("/", (req, res) => {
    MessageController.create(req, res);
});

// UPDATE
router.put("/:mid", (req, res) => {
    MessageController.update(req, res);
});

// DELETE
router.delete("/:mid", (req, res) => {
    MessageController.remove(req, res);
});

export default router;