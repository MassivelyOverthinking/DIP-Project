//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import { hashPassword, comparePasswords } from "../utility/utils.js";
import { User } from "../models/user.js";
import fs from "fs/promises"

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// USER CONTROLLER FUNCTIONS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const filePath = "./data/users.json"    // Internal file-path

export class UserController {
    static #users = [];             // Private static variable.
    static #initialized = false;    // Private static variable.

    // Method for initializing the UserController by loading users from a JSON file.
    static async startup() {
        if (UserController.#initialized) return;

        try {
            const data = await fs.readFile(filePath, "utf-8");
            UserController.#users = JSON.parse(data);

            const newId = UserController.setUserID();

            User.id = newId + 1;
        } catch (error) {
            console.error("Error loading users:", error);
            UserController.#users = [];
            User.id = 0;
        }

        UserController.#initialized = true;
    }

    static async setUserID() {
        const maxId = UserController.#users.reduce((max, user) => {
            return user.id > max ? user.id : max;
        }, -1);

        return maxId;
    }

    // Method for saving current users to JSON file.
    static async saveUsers() {
        await fs.writeFile(filePath, JSON.stringify(UserController.#users, null, 2), "utf-8");
    }

    // Find the individual user by their username.
    static findUserByUsername(username) {
        return UserController.#users.find(user => user.username === username);
    }

    // Find the individual user by their ID.
    static async getUserByID(id) {
        return UserController.#users.find(user => user.id === id);
    }

    // Validate the user by comparing the provided password with stored hashed password.
    static async validateUser(username, password) {
        const user = UserController.findUserByUsername(username);

        if (!user) {
            return false;
        }

        return await comparePasswords(password, user.password);
    }

    static async getAllUsers() {
        return UserController.#users;
    }

    static async updateUserChat(id, chat) {
        const user = UserController.getUserByID(id);
        if (user) {
            user.chats.push(chat);
            await UserController.saveUsers();
        }
    }

    // Handle user login by validating credentials and managing session state.
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

    // Handle user registration by validating input, hashing the password, and storing the new user.
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

            UserController.#users.push(newUser);
            await UserController.saveUsers();

            return response.redirect("/user/success");
        } catch (error) {
            console.error("Error during user registration:", error);
            return response.status(500).send("Internal Server Error");
        }
    }
}