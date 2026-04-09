//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// MODEL: MESSAGE-CLASS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

export class Message {
    static id = 1;

    constructor(message, date, owner, chatID) {
        this.message = message;
        this.date = date;
        this.owner = owner;
        this.chatID = chatID;
        this.id = Message.id++;
    }
}