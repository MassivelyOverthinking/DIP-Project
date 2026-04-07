//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import express, { request, response } from "express"
import session from "express-session"
import User from "./user.js"
import fs from "fs/promises"
import bcrypt from "bcrypt"

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// EXPRESS INITIALIZATION
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const port = 8000                       // Port number
const app = express()                   // Express entry-point

const filePath = "./data/users.json"    // Internal file-path

let users = []
await fileExists()                      // Check file exists
await loadUsers()                       // Load users into memory

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// MIDDLEWARE & VIEW ENGINE
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// View Enginer => Setup
app.set('view engine', 'pug')
app.use(session({
    secret: 'RandomTextString',
    saveUninitialized: true,
    resave: true
}))

app.use(express.json());
app.use('/api', routes);

// Middleware
app.use(express.static('assets'))   // Middleware to properly utilise internal Assets-folder
app.use(express.urlencoded())       // Middleware to properly receive and parse URL-formatted data.
app.use(express.json())             // Middleware to properly receive and parse JSON-formatted data.

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// API ENDPOINTS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Authorization webpage.
app.get("/", (request, response) => {
    response.render('auth', {
        username: request.session.username, 
        valid: request.session.isValidUser
    })
})

// Adde User to persistent storage.
app.get("/user", (request, response) => {
    response.render('user', {

    })
})

// Sign In user to the website.
app.post("/login", async (request, response) => {
    // Retrieve data fromm Request Body
    const { username, password } = request.body

    // Validate user by helper-method
    const isValidUser = await validateUser(username, password)

    // If User is valid persist to session and redirect to new webpage.
    if (isValidUser) {
        request.session.isValidUser = true
        request.session.username = username
        response.redirect('/')
    } else {
        response.render('noAccess')
    }
})

// Add user to internal storage.
app.post("/adduser", async (request, response) => {
    const { username, password, repeat } = request.body

    // Check if User already exists.
    const exisitngUser = users.find(user => user.username === username);
    if (exisitngUser) {
        response.send("Username already exists!")
    }

    // check if passwords match for incoming user.
    if (password !== repeat) {
        response.send("Passwords do not match!")
    } 

    // Create Salt and Password hash.
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // Utilise information to construct a new User instance.
    let newUser = new User(username, hash)
    users.push(newUser)
    
    // Save Users unto Disk storage.
    await saveUser()

    // Redirect
    response.redirect('/')
})

// Sing out requested User and return to frontpage.
app.get("/logout", (request, response) => {
    request.session.destroy()
    response.redirect('/')
})

// Catch ALL incorrect endpoint requests.
app.use((request, response, next) => {
    response.status(404).send("404 - Could not find anything!")
})

// App configuration
app.listen(8000, ()=> {
    console.log(`Now listening on port ${port} 🔥`)
})

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// HELPER METHODS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Check if the requested User is correct and the related password is correct.
async function validateUser(username, password) {
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
async function fileExists() {
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
async function loadUsers() {
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
async function saveUser() {
    // write to file using JSON data.
    try {
        await fs.writeFile(filePath, JSON.stringify(users), "utf8")
    } catch (error) {
        console.log(`Failed to save users: ${error}`)
    }
}

// Utilise Bcrypt library to quickly compare hashed password with stored version.
async function comparePasswords(password, hash) {
    return await bcrypt.compare(password, hash)
}