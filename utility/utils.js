//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import bcrypt from "bcrypt"
import fs from "fs/promises"

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// UTILITY FUNCTIONS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Check if the requested User is correct and the related password is correct.
export async function validateUser(username, password) {
    // Check if the requested User is found in internal User-list.
    const foundUser = users.find(
        user => user.username === username
    )

    // If User was not properly located -> Return False.
    if (!foundUser) {
        return false
    }
    
    // Compare password hashes.
    return await comparePasswords(password, foundUser.password)
}

// Check if the File for Reads & Writes currently exists (Safety Check).
export async function fileExists(filepath) {
    // Check if the file at 'filePath' exists.
    try {
        await fs.access(filepath)
        return true
    } catch (error) {
        // Cast error is the File is non-existent.
        console.log(`Failed to find file: ${error}`)
        return false
    }
}

// Load users from persistent storage into memory.
export async function loadUsers(filepath) {
    // Read the internal file to JSON.
    try {
        const data = await fs.readFile(filepath, "utf8")
        return JSON.parse(data)
    } catch (error) {
        // Catch error if the users are unable to be uploaded.
        console.error("Failed to load users:", error)
        return []
    }
}

// Save all users in memmory to persistent storage on Disk.
export async function saveUser(filepath, users) {
    // write to file using JSON data.
    try {
        await fs.writeFile(filepath, JSON.stringify(users), "utf8")
    } catch (error) {
        console.log(`Failed to save users: ${error}`)
        throw error
    }
}

// Check if the requested User is already stored in the internal User-list.
export async function checkUser(username, filepath) {
    try {
        const users = await loadUsers(filepath);
        return users.some(user => user.username === username);
    } catch (error) {
        // Catch error if the users are unable to be uploaded.
        console.error("Failed to load users:", error)
        return false
    }
}

// Load the current users, add the new user and save the updated list back to persistent storage.
export async function loadAndSaveUser(user, filepath) {
    const users = await loadUsers(filepath);
    users.push(user);
    await saveUser(filepath, users);
}

// Utilise Bcrypt library to quickly compare hashed password with stored version.
export async function hashPassword(password) {
    return await bcrypt.hash(password, 10)
}

// Utilise Bcrypt library to quickly compare hashed password with stored version.
export async function comparePasswords(password, hash) {
    return await bcrypt.compare(password, hash)
}