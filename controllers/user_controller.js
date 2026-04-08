//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import { hashPassword, comparePasswords } from "../utility/utils.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt"
import fs from "fs/promises"

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// USER CONTROLLER FUNCTIONS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const filePath = "./data/users.json"    // Internal file-path

export class UserController {
    static users = [];
    static initialized = false;

    static async initialize() {
        if (UserController.initialized) return;

        try {
            const data = await fs.readFile(filePath, "utf-8");
            UserController.users = JSON.parse(data);
        } catch (error) {
            console.error("Error loading users:", error);
            UserController.users = [];
        }

        UserController.initialized = true;
    }

    static async saveUsers() {
        await fs.writeFile(filePath, JSON.stringify(UserController.users, null, 2), "utf-8");
    }

    static findUserByUsername(username) {
        return UserController.users.find(user => user.username === username);
    }

    static async validateUser(username, password) {
        const user = UserController.findUserByUsername(username);

        if (!user) {
            return false;
        }

        return await comparePasswords(password, user.password);
    }

    static async login(request, response) {
        try {
            const { username, password } = request.body;
            const isValidUser = await UserController.validateUser(username, password);

            if (isValidUser) {
                request.session.isValidUser = true;
                request.session.user = UserController.findUserByUsername(username);
                return response.render("home", { user: request.session.user });
            }

            return response.redirect(`/user/no-access`);
        } catch (error) {
            console.error("Error during login:", error);
            return response.status(500).send("Internal Server Error");
        }
    }

    static async register(request, response) {
        try {
            const { username, password, repeat, first_name, last_name, level } = request.body;

            if (UserController.findUserByUsername(username)) {
                return response.status(400).send("User already exists");
            }

            if (password !== repeat) {
                return response.status(400).send("Passwords do not match");
            }

            const hashedPassword = await hashPassword(password);
            const date = new Date();

            const newUser = new User(
                username,
                hashedPassword,
                first_name,
                last_name,
                date,
                level
            );

            UserController.users.push(newUser);
            await UserController.saveUsers();

            return response.redirect("/user/success");
        } catch (error) {
            console.error("Error during user registration:", error);
            return response.status(500).send("Internal Server Error");
        }
    }
}