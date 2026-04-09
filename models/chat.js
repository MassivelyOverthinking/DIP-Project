//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
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
    static id = 1;

    static fromJSON(json) {
        const chat = new Chat(json.name, json.date, json.owner);
        chat.messages = json.messages ?? [];
        chat.id = json.id;
        
        return chat;
    }
}