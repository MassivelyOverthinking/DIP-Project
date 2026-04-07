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
export async function fileExists() {
    // Check if the file at 'filePath' exists.
    try {
        await fs.access(filePath)
        return true
    } catch (error) {
        // Cast error is the File is non-existent.
        console.log(`Failed to find file: ${error}`)
        return false
    }
}

// Load users from persistent storage into memory.
export async function loadUsers() {
    // Read the internal file to JSON.
    try {
        const data = await fs.readFile(filePath, "utf8")
        users = JSON.parse(data)
    } catch (error) {
        // Catch error if the users are unable to be uploaded.
        console.error("Failed to load users:", error)
        users = []
    }
}

// Save all users in memmory to persistent storage on Disk.
export async function saveUser() {
    // write to file using JSON data.
    try {
        await fs.writeFile(filePath, JSON.stringify(users), "utf8")
    } catch (error) {
        console.log(`Failed to save users: ${error}`)
    }
}

// Utilise Bcrypt library to quickly compare hashed password with stored version.
export async function comparePasswords(password, hash) {
    return await bcrypt.compare(password, hash)
}