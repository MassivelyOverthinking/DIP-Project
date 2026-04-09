//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// CHAT CONTROLLER FUNCTIONS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import { Chat } from "../models/chat.js";
import fs from "fs/promises";

const filePath = "./data/chats.json";

export class ChatController {
    static #chats = [];
    static #initialized = false;

    static async startup() {
        if (ChatController.#initialized) return;

        try {
            const data = await fs.readFile(filePath, "utf-8");
            const JSONdata = JSON.parse(data);

            ChatController.#chats = JSONdata.map(chat => Chat.fromJSON(chat));

            const newId = ChatController.setChatID();
            
            Chat.id = newId + 1;
        } catch {
            ChatController.#chats = [];
            Chat.id = 0;
        }

        ChatController.#initialized = true;
    }

    static setChatID() {
        const maxId = ChatController.#chats.reduce((max, chat) => {
            return chat.id > max ? chat.id : max;
        }, -1);

        return maxId;
    }

    static async saveChats() {
        await fs.writeFile(filePath, JSON.stringify(ChatController.#chats, null, 2));
    }

    static getChats() {
        return ChatController.#chats;
    }

    static findById(id) {
        return ChatController.#chats.find(c => c.id == id);
    }

    // GET /chats/:id
    static async getOne(req, res) {
        await ChatController.startup();

        const chat = ChatController.findById(req.params.id);
        if (!chat) return res.status(404).send("Chat ikke fundet");

        res.json(chat);
    }

    // POST /chats
    static async create(req, res) {
        try {
            if (!req.session.user) {
                 return res.status(401).send("Log ind") 
            };
            
            if (req.session.user.level < 2) {
                return res.status(403).send("Ingen rettigheder");
            }

            const newChat = new Chat(
                req.body.name,
                new Date(),
                req.session.user.id
            );

            ChatController.#chats.push(newChat);
            await ChatController.saveChats();

            req.session.chats = ChatController.#chats;

            return res.redirect("/");
        } catch (error) {
            console.error("Error creating chat:", error);
            res.status(500).send("Fejl ved oprettelse af chat");
        }
    }

    // DELETE /chats/:id
    static async remove(req, res) {
        await ChatController.startup();

        const chat = ChatController.findById(req.params.id);
        if (!chat) return res.status(404).send("Ikke fundet");

        if (req.session.user.level < 3 && chat.owner != req.session.user.id) {
            return res.status(403).send("Ingen adgang");
        }

        ChatController.#chats = ChatController.#chats.filter(c => c.id != req.params.id);
        await ChatController.saveChats();

        res.send("Slettet");
    }
}