//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import bcrypt from "bcrypt"

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// UTILITY FUNCTIONS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Get Error message based on the type of error.
export function getErrorMessage(type) {
    switch (type) {
        case "username-taken":
            return "Username is already taken.";
        case "passwords-dont-match":
            return "Passwords do not match.";
        case "cant-find-user":
            return "Could not find user with that ID.";
        case "chat-with-yourself":
            return "You cant chat with yourself.";
        case "no-owner":
            return "Chat must have an owner.";
        case "no-chat":
            return "Chat could not be created.";
        case "no-credentials":
            return "You do not have the credentials to perform this action.";
        default:
            return "An unknown error occurred.";
    }
}

// Utilise Bcrypt library to hash a password.
export async function hashPassword(password) {
    return await bcrypt.hash(password, 10)
}

// Utilise Bcrypt library to compare hashed password.
export async function comparePasswords(password, hash) {
    return await bcrypt.compare(password, hash)
}