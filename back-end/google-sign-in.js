const { OAuth2Client } = require('google-auth-library');

/**
 * @typedef {Object} GoogleSignInInfo
 * @property {string} userId
 */

/**
 * When a user logs into the front-end through Google, Google gives our front-end a token.
 * The token is a string with more than 1000 characters.
 * The token basically says "Google user X has signed in".
 * This method helps verify the token and also extract its info.
 *
 * @param {string} googleIdToken
 * @returns {GoogleSignInInfo|null}
 */
async function checkGoogleIdToken(googleIdToken) {
  const CLIENT_ID = '1052534869599-cecih1nddg81jh8dnpjckbsmj8912aj6.apps.googleusercontent.com';
  const client = new OAuth2Client(CLIENT_ID);
  try {
    console.log("Foo: " + googleIdToken);
    const ticket = await client.verifyIdToken({
      idToken: googleIdToken,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return { userId: payload.sub };
  } catch (error) {
    console.log('Verification of Google Sign-in token failed.', error);
    return null;
  }
}

module.exports = { checkGoogleIdToken };
