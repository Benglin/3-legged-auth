
const express = require("express");
const path = require("path");
const request = require("request");
const querystring = require('querystring');

// =============================================================================
// Helper/utility functions
// =============================================================================

function exchangeForAccessToken(authCode, callback) {

    let requestData = {

        url: "https://developer.api.autodesk.com/authentication/v1/gettoken",

        form: {
            client_id: "G8gnbczTX6mBQAg1Air5qMxHlgpk0bs3",
            client_secret: "K592544e7f3074d1",
            grant_type: "authorization_code",
            code: authCode,
            redirect_uri: "http://localhost:8088/oauth-callback"
        }
    };

    request.post(requestData, function (error, response, bodyJson) {

        if (error) {
            callback(null, error);
            return;
        }

        // 'bodyJson' is of the following structure:
        // 
        //  {
        //      "access_token": "...",
        //      "refresh_token": "...",
        //      "token_type": "...",
        //      "expires_in": "..."
        //  }
        // 
        callback(JSON.parse(bodyJson), null);
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

    exchangeForAccessToken(authCode, function (bodyJson, error) {
        if (error) {
            res.send(`Error received ${error}`);
            return;
        }

        let accessToken = bodyJson.access_token;
        res.send(accessToken);
    });
});

app.listen(8088);
console.log("Listening on port 8088...");
