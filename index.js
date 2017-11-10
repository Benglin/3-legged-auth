
const express = require("express");
const path = require("path");
const http = require("http");
const querystring = require('querystring');

var app = express();

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/oauth-callback", function (req, res) {

    // Obtain authorization code from URL
    let authCode = req.query.code;
    console.log("Gotten authorization code: " + authCode);
    console.log("Host: " + req.headers.host)
    console.log("Host name: " + req.headers.hostname)
    
    // Post data to exchange for an access token
    const postData = queryString.stringify({
        "client_id": "G8gnbczTX6mBQAg1Air5qMxHlgpk0bs3",
        "client_secret": "K592544e7f3074d1",
        "grant_type": "authorization_code",
        "code": authCode,
        "redirect_uri": req.headers.host
    });

    // Call 'gettoken' endpoint to exchange for an access token
    const options = {
        hostname: "https://developer.api.autodesk.com",
        path: "/authentication/v1/gettoken",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(postData)            
        }
    };

    const request = http.request(options, (response) => {
        console.log(`Response status: ${response.statusCode}`);
        console.log(`Response headers: ${JSON.stringify(response.headers)}`);

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
            console.log(`Response ${chunk}`);
        });
    });

});

app.listen(8088);
console.log("Listening on port 8088...");
