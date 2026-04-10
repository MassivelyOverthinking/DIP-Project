//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import { Chat } from "../models/chat.js";
import { UserController } from "./user_controller.js";
import fs from "fs/promises";

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// CONSTANTS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const filePath = "./data/chats.json";

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// CONTROLLER: CHAT CONTROLLER
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

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

    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // CONTROLLER: HELPER METHODS
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    static setChatID() {
        const maxId = ChatController.#chats.reduce((max, chat) => {
            return chat.id > max ? chat.id : max;
        }, -1);

        return maxId;
    }

    static async saveChats() {
        await fs.writeFile(filePath, JSON.stringify(ChatController.#chats));
    }

    static getChats() {
        return ChatController.#chats;
    }

    static findById(id) {
        return ChatController.#chats.find(c => c.id == id);
    }

    static async deleteMessageFromChat(chatId, messageId) {
        const chat = ChatController.findById(chatId);
        if (!chat) return null;

        if (!Array.isArray(chat.messages)) {
            chat.messages = [];
        }

        console.log("Deleting message with ID", messageId, "from chat", chatId);

        chat.messages = chat.messages.filter(
            message => Number(message.id) !== Number(messageId)
        );

        await ChatController.saveChats();

        console.log("Updated chat messages:", chat.messages);

        return chat;
    }

    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // CONTROLLER: REQUEST HANDLERS
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    // GET /chats/:id
    static async getOne(request, response) {
        const chat = ChatController.findById(request.params.id);
        if (!chat) return response.status(404).send("Chat not found");

        response.json(chat);
    }

    // POST /chats
    static async create(request, response) {
        try {
            const owner = UserController.getUserByID(request.session.user.id);
            const participantId = parseInt(request.body.participant);
            const participant = UserController.getUserByID(participantId);

            if (!owner) {
                return response.redirect("/chat/no-access/no-owner");
            }

            if (!participant) {
                return response.redirect("/chat/no-access/cant-find-user");
            }

            if (owner.id === participant.id) {
                return response.redirect(`/chat/no-access/chat-with-yourself`);
            }
            
            const newChat = new Chat(
                request.body.name,
                new Date(),
                owner.id,
                participant.id
            );

            owner.addChat(newChat.id);
            participant.addChat(newChat.id);
            await UserController.saveUsers();

            ChatController.#chats.push(newChat);
            await ChatController.saveChats();

            request.session.chats = ChatController.#chats;

            return response.redirect("/");
        } catch (error) {
            console.error("Error creating chat:", error);
            response.redirect("/chat/no-access/no-chat");
        }
    }

    // DELETE /chats/:id
    static async remove(request, response) {
        const chat = ChatController.findById(request.params.id);
        if (!chat) return response.status(404).send("Chat not found");

        if (request.session.user.level < 3 && chat.owner != request.session.user.id) {
            return response.status(403).send("Ingen adgang");
        }

        ChatController.#chats = ChatController.#chats.filter(c => c.id != request.params.id);
        await ChatController.saveChats();

        response.redirect("/");
    }
}