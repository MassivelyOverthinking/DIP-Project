//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import { validateUser, checkUser, hashPassword, loadAndSaveUser } from "../utility/utils.js";
import { User } from "../models/user.js";

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// USER CONTROLLER FUNCTIONS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const filePath = "./data/users.json"    // Internal file-path

export async function login(request, response) {
    try {
        const { username, password } = request.body;
        const isValidUser = await validateUser(username, password);

        if (isValidUser) {
            request.session.isValidUser = true;
            request.session.username = username;
            response.redirect('/home');
        } else {
            response.render('noAccess');
        }
    } catch (error) {
        console.error("Error during login:", error);
        response.status(500).send("Internal Server Error");
    }
}

export async function createUser(request, response) {
    try {
        const { username, password, first_name, last_name, level } = request.body;
        
        const userExists = await checkUser(username, filePath);

        if (!userExists) {
            return response.status(400).send("User already exists");
        }

        const hashedPassword = await hashPassword(password);
        const date = new Date();

        const newUser = new User(username, hashedPassword, first_name, last_name, date, level);

        await loadAndSaveUser(newUser, filePath);

        response.redirect('/login');
    } catch (error) {
        console.error("Error during user registration:", error);
        response.status(500).send("Internal Server Error");
    }
}