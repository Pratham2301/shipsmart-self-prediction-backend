const express = require("express");
const app = express();

const cors = require("cors");
const dotenv = require("dotenv");

const errorMiddleware = require("./middlewares/error");



app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://rcoem-coderz.netlify.app', 
        'https://rcoem-coderz.netlify.app/', 
        'https://rcoem-coderz.netlify.app/*', 
        'https://indian-coderz.netlify.app', 
        'https://indian-coderz.netlify.app/', 
        'https://indian-coderz.netlify.app/*', 
        '*'
    ],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
}));


app.use(express.json());


// Route Imports
const user = require("./routes/userRoutes");
const leaderboard = require("./routes/leaderboardRoutes");
const contests = require("./routes/contestRoute");
const shipsmart = require("./routes/shipsmart.js");


app.use("/api/v1", user);
app.use("/api/v1/leaderboard", leaderboard);
app.use("/api/v1/contests", contests);
app.use("/api/v1/shipsmart", shipsmart);



app.get("*", (req, res) => {
    res.send("Hello");
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;