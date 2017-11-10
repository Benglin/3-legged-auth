
const express = require('express');
const path = require('path');

var app = express();

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/oauth-callback", function (req, res) {

    // Obtain authorization code from URL
    let authCode = req.query.code;
    console.log("Gotten authorization code: " + authCode);

    // 
});

app.listen(8088);
console.log("Listening on port 8088...");
