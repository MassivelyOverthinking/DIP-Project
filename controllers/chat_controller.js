//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import { Chat } from "../models/chat.js";
import { UserController } from "./user_controller.js";
import { MessageController } from "./message_controller.js";
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

        if (!chat) {
            return null
        };

        if (!Array.isArray(chat.messages)) {
            chat.messages = [];
        }

        chat.messages = chat.messages.filter(
            message => Number(message.id) !== Number(messageId)
        );

        await ChatController.saveChats();

        return chat;
    }

    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // CONTROLLER: REQUEST HANDLERS
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    // Create a new chat and save it.
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
            response.redirect("/chat/no-access/no-chat");
        }
    }

    // Delete a chat by its ID.
    static async delete(request, response) {
        const chat = ChatController.findById(request.params.id);
        if (!chat) return response.status(404).send("Chat not found");

        if (request.session.user.level < 3 && chat.owner != request.session.user.id) {
            return response.redirect("/chat/no-access/no-credentials");
        }


        await MessageController.deleteById(request.params.id)

        ChatController.#chats = ChatController.#chats.filter(c => c.id != request.params.id);
        await ChatController.saveChats();

        response.redirect("/");
    }
}