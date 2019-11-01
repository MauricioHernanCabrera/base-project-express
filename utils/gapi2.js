const { google } = require('googleapis');
const { readFileSync } = require('fs');
const REDIRECT_URL = 'http://localhost:3000';
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const getToken = () => {
  const credentials = JSON.parse(readFileSync('credentials.json', 'utf8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });

  return authUrl;
};

const setToken = code => {
  const credentials = JSON.parse(readFileSync('credentials.json', 'utf8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  return new Promise((res, rej) => {
    oAuth2Client.getToken(code, (err, token) => {
      if (err) rej(err);
      // Store the token to disk for later program executions
      res(token);
    });
  });
};

module.exports = {
  getToken,
  setToken
};
