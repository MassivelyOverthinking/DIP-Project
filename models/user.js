//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// MODEL: USER-CLASS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

export class User {
    static id = 1;
    
    constructor(username, password, firstName, lastName, date, level) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.date = date;
        this.level = level;
        this.chats = [];
        this.id = User.id++;
    }

    static fromJSON(json) {
        const user = new User(json.username, json.password, json.firstName, json.lastName, json.date, json.level);
        user.chats = json.chats || [];
        user.id = json.id;
        return user;
    }

    async addChat(chatID) {
        this.chats.push(chatID);
    }

    async setLevel(level) {
        this.level = level;
    }
}