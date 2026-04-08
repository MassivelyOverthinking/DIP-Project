//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import bcrypt from "bcrypt"
import fs from "fs/promises"

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// UTILITY FUNCTIONS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Utilise Bcrypt library to quickly compare hashed password with stored version.
export async function hashPassword(password) {
    return await bcrypt.hash(password, 10)
}

// Utilise Bcrypt library to quickly compare hashed password with stored version.
export async function comparePasswords(password, hash) {
    return await bcrypt.compare(password, hash)
}