//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import express, { request, response } from "express"
import { fileExists, loadUsers } from "./utility/utils.js"
import session from "express-session"

import userRouter from "./routes/userRoute.js"
import chatRouter from "./routes/chatRoute.js"
import messageRouter from "./routes/messageRoute.js"

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// EXPRESS INITIALIZATION
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const port = 8000                       // Port number
const app = express()                   // Express entry-point

const filepath = "/data/users.json"     // Internal file-path

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
app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.use('/messages', messageRouter);

// Middleware
app.use(express.static('assets'))   // Middleware to properly utilise internal Assets-folder
app.use(express.urlencoded())       // Middleware to properly receive and parse URL-formatted data.
app.use(express.json())             // Middleware to properly receive and parse JSON-formatted data.

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// EXPRESS ROUTES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


// Catch ALL incorrect endpoint requests.
app.use((request, response, next) => {
    response.status(404).send("404 - Could not find anything!")
})

// App configuration
app.listen(8000, () => {
    console.log(`Chat project is now running on port: ${port} 🔥`)
})