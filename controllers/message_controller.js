//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import fs from "fs/promises";
import { Message } from "../models/message.js";
import { ChatController } from "./chat_controller.js";

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// MESSAGE CONTROLLER FUNCTIONS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const filePath = "./data/messages.json";

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

    // GET /chats/:id/messages
    static async getByChat(req, res) {
        const msgs = MessageController.findByChat(req.params.id);
        res.json(msgs);
    }

    // GET /chats/:id/messages/:mid
    static async getOne(req, res) {
        const msg = MessageController.findById(req.params.mid);
        if (!msg) return res.status(404).send("Ikke fundet");

        res.json(msg);
    }

    // POST /chats/:id/messages
    static async create(req, res) {
        if (!req.session.user) return res.status(401).send("Log ind");

        if (req.session.user.level < 2) {
            return res.status(403).send("Ingen rettigheder");
        }

        const newMsg = new Message(
            req.body.text,
            new Date(),
            req.session.user.id,
            req.body.chatId
        );

        const chat = ChatController.findById(req.body.chatId);
        if (!chat) return res.status(404).send("Chat ikke fundet");

        chat.messages.push(newMsg);
        await ChatController.saveChats();

        console.log("id", req.body.chatId);
        console.log("message", req.body.text);

        MessageController.#messages.push(newMsg);
        await MessageController.saveMessages();

        res.redirect(`/`);
    }

    // DELETE /chats/:id/messages/:mid
    static async remove(req, res) {
        const msg = MessageController.findById(req.params.id);
        if (!msg) return res.status(404).send("Ikke fundet");

        if (req.session.user.level < 3 && msg.owner != req.session.user.id) {
            return res.status(403).send("Ingen adgang");
        }

        MessageController.#messages = MessageController.#messages.filter(m => m.id != req.params.id);
        await MessageController.saveMessages();

        res.redirect(`/`);
    }
}

