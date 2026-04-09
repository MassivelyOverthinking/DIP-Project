import express from "express"
import session from "express-session"

import userRouter from "./routes/userRoute.js"
import chatRouter from "./routes/chatRoute.js"
import messageRouter from "./routes/messageRoute.js"

const port = 8000
const app = express()

// View engine
app.set('view engine', 'pug')

// Session
app.use(session({
    secret: 'RandomTextString',
    saveUninitialized: true,
    resave: true
}))

// Middleware
app.use(express.json())
app.use(express.static('assets'))
app.use(express.urlencoded({ extended: true }))

// Forside
app.get('/', (req, res) => {
    if (req.session.user) {
        res.render("home", { user: req.session.user })
    } else {
        res.redirect("/users/login")
    }
})

// Routes
app.use('/users', userRouter)
app.use('/chats', chatRouter)
app.use('/messages',messageRouter)

// 404
app.use((req, res) => {
    res.status(404).send("404 - Kan ikke finde noget!")
})

// Start
app.listen(port, () => {
    console.log(`Server kører på port: ${port}`)
})