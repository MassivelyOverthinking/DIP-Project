export default class User {
    constructor(username, password, date, level) {
        this.username = username;
        this.password = password;
        this.date = date;
        this.level = level;
        this.chats = [];
        this.id = User.id++;
    }

    static id = 0;
}
