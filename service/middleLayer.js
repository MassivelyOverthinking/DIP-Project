//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import fs from "fs/promises";
import { ChatController } from "../controllers/chat_controller.js";
import { MessageController } from "../controllers/message_controller.js";
import { UserController } from "../controllers/user_controller.js";

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// CONTROLLER: MIDDLE LAYER
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

export class MiddleLayer {
    static async deleteMessage(chatId, messageId) {
        const message = MessageController.findById(messageId);
        if (!message) {
            throw new Error("No Message found!")
        }

        const chat = ChatController.findById(chatId);
        if (!chat) {
            throw new Error("No chat found!")
        }

        await ChatController.deleteMessageFromChat(chatId, messageId);

        await MessageController.deleteById(messageId);

        await ChatController.saveChats();
        await MessageController.saveMessages();

        return { success: true }
    }

    static async createMessage(text, ownerId, username, chatId) {
        const newMsg = new Message(
            text,
            new Date(),
            ownerId,
            username,
            chatId
        );

        const chat = ChatController.findById(chatId);
        if (!chat) {
            throw new Error("No chat found!")
        }

        chat.addMessage(newMsg);
        await ChatController.saveChats();

        MessageController.addMessage(newMsg);
        await MessageController.saveMessages();

        return { success: true }
    }
}