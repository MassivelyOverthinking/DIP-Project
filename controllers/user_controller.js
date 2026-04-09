import { hashPassword, comparePasswords } from "../utility/utils.js";
import { User } from "../models/user.js";
import fs from "fs/promises";
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX



const filePath = "./data/users.json";

export class UserController {
    static #users = [];
    static #initialized = false;

    static async initialize() {
        if (this.#initialized) return;

        try {
            const data = await fs.readFile(filePath, "utf-8");
            this.#users = JSON.parse(data);
        } catch {
            this.#users = [];
        }

        this.#initialized = true;
    }

    static async saveUsers() {
        await fs.writeFile(filePath, JSON.stringify(this.#users, null, 2));
    }

    static findUserByUsername(username) {
        return this.#users.find(u => u.username === username);
    }

    static async validateUser(username, password) {
        const user = this.findUserByUsername(username);
        if (!user) return false;

        return await comparePasswords(password, user.password);
    }

    static async login(req, res) {
        await this.initialize();

        const { username, password } = req.body;
        const valid = await this.validateUser(username, password);

        if (!valid) return res.redirect("/user/no-access");

        const user = this.findUserByUsername(username);

        req.session.user = user;
        req.session.isValidUser = true;

        res.render("home", { user });
    }

    static async register(req, res) {
        await this.initialize();

        const { username, password, repeat, first_name, last_name, level } = req.body;

        if (this.findUserByUsername(username)) {
            return res.status(400).send("User exists");
        }

        if (password !== repeat) {
            return res.status(400).send("Passwords mismatch");
        }

        const hashed = await hashPassword(password);

        const newUser = new User(
            username,
            hashed,
            first_name,
            last_name,
            new Date(),
            level
        );

        this.#users.push(newUser);
        await this.saveUsers();

        res.redirect("/user/success");
    }

    static async updateLevelAdmin(userId,changeLevel){
        const user = this.#users.find(u => u.id == userId)
        if(!user) return
        user.level = parseInt(changeLevel)
        await this.saveUsers
    }



}