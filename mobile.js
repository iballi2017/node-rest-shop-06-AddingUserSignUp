const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.status(200).json({
        Firstname: "Ibrahim",
        Lastname : "Alli",
        Age: 90,
    });
});

module.exports = app;