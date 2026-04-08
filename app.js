//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import express, { request, response } from "express"
import session from "express-session"

import { UserController } from "./controllers/user_controller.js"

import userRouter from "./routes/userRoute.js"
import chatRouter from "./routes/chatRoute.js"
import messageRouter from "./routes/messageRoute.js"

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// EXPRESS INITIALIZATION
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const port = 8000                       // Port number
const app = express()                   // Express entry-point

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

// Middleware
app.use(express.json());            // Middleware to properly receive and parse JSON-formatted data.
app.use(express.static('assets'))   // Middleware to properly utilise internal Assets-folder
app.use(express.urlencoded())       // Middleware to properly receive and parse URL-formatted data.
app.use(express.json())             // Middleware to properly receive and parse JSON-formatted data.

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// LOAD CONTROLLERS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

await UserController.initialize();

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// EXPRESS ROUTES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Default route => Check if user is currently stored in Session.
app.get('/', (request, response) => {
    if (request.session.isValidUser) {
        response.render("home", { user: request.session.user });
    } else {
        response.redirect("/user/login")
    }
})

// User, Chat and Message routes.
app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.use('/messages', messageRouter);

// Catch ALL incorrect endpoint requests.
app.use((request, response, next) => {
    response.render("404")
})

// App configuration
app.listen(8000, () => {
    console.log(`Chat project is now running on port: ${port} 🔥`)
})