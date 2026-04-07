export default class Message {
    constructor(message, date, owner) {
        this.message = message;
        this.date = date;
        this.owner = owner;
        this.id = Message.id++;
    }
    static id = 0;
}