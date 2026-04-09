//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// MODEL: CHAT-CLASS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
export class Chat {
    constructor(name, date, owner, participant) {
        this.name = name;
        this.date = date;
        this.owner = owner;
        this.participant = participant;
        this.messages = [];
        this.id = Chat.id++;
    }
    static id = 1;

    static fromJSON(json) {
        const chat = new Chat(json.name, json.date, json.owner, json.participant);
        chat.messages = json.messages ?? [];
        chat.id = json.id;
        
        return chat;
    }
}