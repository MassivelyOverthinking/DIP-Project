//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import fs from "fs/promises";
import { Message } from "../models/message.js";
import { ChatController } from "./chat_controller.js";

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// CONSTANTS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const filePath = "./data/messages.json";

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// CONTROLLER: MESSAGE CONTROLLER
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

export class MessageController {
    static #messages = [];
    static #initialized = false;

    static async startup() {
        if (MessageController.#initialized) return;

        try {
            const data = await fs.readFile(filePath, "utf-8");
            const JSONdata = JSON.parse(data);
            
            MessageController.#messages = JSONdata.map(msg => Message.fromJSON(msg));

            const newId = MessageController.setMessageID();
            
            Message.id = newId + 1;
        } catch {
            MessageController.#messages = [];
            Message.id = 0;
        }

        MessageController.#initialized = true;
    }

    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // HELPER METHODS
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    static setMessageID() {
        const maxId = MessageController.#messages.reduce((max, msg) => {
            return msg.id > max ? msg.id : max;
        }, -1);

        return maxId;
    }

    static async saveMessages() {
        await fs.writeFile(filePath, JSON.stringify(MessageController.#messages));
    }

    static findById(id) {
        return MessageController.#messages.find(m => m.id == id);
    }

    static findByChat(chatID) {
        return MessageController.#messages.filter(m => m.chatID == chatID);
    }

    static async deleteById(id) {
        MessageController.#messages = MessageController.#messages.filter(
            m => m.chatID != id
        );

        MessageController.saveMessages();
    }

    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // REQUEST HANDLERS
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    static async create(request, response) {
        const newMsg = new Message(
            request.body.text,
            new Date(),
            request.session.user.id,
            request.session.user.username,
            request.body.chatId
        );

        const chat = ChatController.findById(request.body.chatId);
        if (!chat) return response.status(404).send("Chat ikke fundet");

        chat.messages.push(newMsg);
        await ChatController.saveChats();

        MessageController.#messages.push(newMsg);
        await MessageController.saveMessages();

        response.redirect(`/chat/${request.body.chatId}`);
    }

    static async delete(request, response) {
        const msg = MessageController.findById(request.params.id);
        if (!msg) return response.status(404).send("Ikke fundet");

        ChatController.deleteMessageFromChat(request.params.chatID, request.params.id);

        MessageController.#messages = MessageController.#messages.filter(m => m.id != request.params.id);
        await MessageController.saveMessages();

        response.redirect(`/chat/${request.params.chatID}`);
    }
}

