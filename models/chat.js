//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

//IMPORTS

import fs from "fs"
const filePath = "./data/chats.json"

///XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// MODEL: CHAT-CLASS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
export class Chat {
    constructor(name, date, owner) {
        this.name = name;
        this.date = date;
        this.owner = owner;
        this.messages = [];
        this.id = Chat.id++;
    }
    static id = 0;

}