
const express = require("express");
const path = require("path");
const request = require("request");
const querystring = require('querystring');

// =============================================================================
// Helper/utility functions
// =============================================================================

function exchangeForAccessToken(authCode, redirectUrl,callback) {

    let requestData = {

        url: "https://developer.api.autodesk.com/authentication/v1/gettoken",

        form: {
            client_id: "G8gnbczTX6mBQAg1Air5qMxHlgpk0bs3",
            client_secret: "K592544e7f3074d1",
            grant_type: "authorization_code",
            code: authCode,
            redirect_uri: redirectUrl
        }
    };

    request.post(requestData, function(error, response, body) {

        if (error) {
            callback(null, error);
            return;
        }

        callback(response, null);
    });
}

// =============================================================================
// Express related routes
// =============================================================================

var app = express();

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/oauth-callback", function (req, res) {

    // Obtain authorization code from URL
    let authCode = req.query.code;
    console.log("Gotten authorization code: " + authCode);
    console.log("Host: " + req.headers.host);

    let redirectUrl = req.headers.host + "/";
    exchangeForAccessToken(authCode, redirectUrl, function(accessToken, error) {
        if (error) {
            res.send(`Error received ${error}`);
            return;
        }

        res.send(`No error, received ${accessToken}`);
    });    
});

app.listen(8088);
console.log("Listening on port 8088...");
