//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// MODEL: MESSAGE-CLASS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

export class Message {
    static id = 1;

    constructor(message, date, owner, username, chatID) {
        this.message = message;
        this.date = date;
        this.owner = owner;
        this.username = username;
        this.chatID = chatID;
        this.id = Message.id++;
    }

    static fromJSON(json) {
        const chat = new Message(json.message, json.date, json.owner, json.username, json.chatID);
        chat.id = json.id;
        
        return chat;
    }
}