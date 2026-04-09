//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
import { Chat } from "../models/chat.js";
import fs from "fs/promises";

const filePath = "./data/chats.json";

export class ChatController {
    static #chats = [];
    static #initialized = false;

    static async initialize() {
        if (this.#initialized) return;

        try {
            const data = await fs.readFile(filePath, "utf-8");
            this.#chats = JSON.parse(data);
        } catch {
            this.#chats = [];
        }

        this.#initialized = true;
    }

    static async saveChats() {
        await fs.writeFile(filePath, JSON.stringify(this.#chats, null, 2));
    }

    static findById(id) {
        return this.#chats.find(c => c.id == id);
    }

    // GET /chats/:id
    static async getOne(req, res) {
        await this.initialize();

        const chat = this.findById(req.params.id);
        if (!chat) return res.status(404).send("CHAT NOT FOUND");

        res.json(chat);
    }

    // POST /chats
    static async create(req, res) {
        await this.initialize();

        if (!req.session.user) return res.status(401).send("Log ind");

        if (req.session.user.level < 2) {
            return res.status(403).send("No Access");
        }

        const newChat = new Chat(
            req.body.name,
            new Date(),
            req.session.user.id
        );

        this.#chats.push(newChat);
        await this.saveChats();

        res.json(newChat);
    }

    // DELETE /chats/:id
    static async remove(req, res) {
        await this.initialize();

        const chat = this.findById(req.params.id);
        if (!chat) return res.status(404).send("Ikke fundet");

        if (req.session.user.level < 3 && chat.owner != req.session.user.id) {
            return res.status(403).send("No Access");
        }

        this.#chats = this.#chats.filter(c => c.id != req.params.id);
        await this.saveChats();

        res.send("Deleted");
    }
}