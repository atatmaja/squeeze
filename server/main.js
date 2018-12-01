const express = require('express');
const bodyParser = require('body-parser');  

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());
const port = process.env.PORT || 4000;

var fs = require("fs");

const {google} = require('googleapis')

var content = fs.readFileSync("../client_id.json");
var credentialsJson = JSON.parse(content);

const googleConfig = {
    clientId: credentialsJson.web.client_id, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
    clientSecret: credentialsJson.web.client_secret, // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: credentialsJson.web.redirect_uris[0] // this must match your google api settings
};

/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}


/**
 * This scope tells google what information we want to request.
 */
const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
];

/**
 * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
 */
function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
        scope: defaultScope
    });
}

  /**
 * Create the google url to be sent to the client.
 */
function urlGoogle() {
    const auth = createConnection(); // this is from previous step
    const url = getConnectionUrl(auth);
    return url;
}

function getGooglePlusApi(auth) {
    return google.plus({ version: 'v1', auth });
  }

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
async function getGoogleAccountFromCode(code) {
    console.log(code);
    const auth = createConnection();
    const data = await auth.getToken(code);
    const tokens = data.tokens;
    auth.setCredentials(tokens);
    const plus = getGooglePlusApi(auth);
    const me = await plus.people.get({ userId: 'me' });
    const userGoogleId = me.data.id;
    const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
    return {
      id: userGoogleId,
      email: userGoogleEmail,
      tokens: tokens,
    };
  }

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

app.get('/api/test', (req, res) => {
  res.send({ "hi": 'Hello From Express' });
});

app.get('/api/signIn', (req, res) => {
    const url = urlGoogle();
    res.send({'url': url});
});

app.get('/api/signInInfo', async (req, res) => {
    const code = req.query.code;
    const accountInfo = await getGoogleAccountFromCode(code);
    res.send({'info': accountInfo});
});

app.listen(port, () => console.log(`Listening on port ${port}`));