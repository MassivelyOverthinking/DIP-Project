import express from "express";

// const express = require ("express");
const app = express();
const PORT = 3000;
const chats = [
    { id: 1, name: "Generel chat" },
    { id: 2, name: "Studiegruppe" }
];

//Tester Serveren
app.get("/", (req, res) => {
    res.send("Serveren Virker");
});

//Henter Chats 
app.get("/chats", (req, res) => {
    res.json(chats);
});

//Starter Serveren 
app.listen(PORT, () => {
    console.log(`Serveren køre på http://localhost:${PORT}`);
});


