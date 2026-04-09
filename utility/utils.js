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
        case "404":
            return "The page you are looking for does not exist.";
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