const firebaseAdmin = require('firebase-admin');
const { checkGoogleIdToken } = require('./google-sign-in');

/**
 * @param {Request} req
 * @param {Response} res
 */
async function handleGetMyFrictionLogs(req, res) {
  const { googleIdToken } = req.body;

  // Check Google Sign-in.
  const googleSignInInfo = await checkGoogleIdToken(googleIdToken);
  if (!googleSignInInfo) {
    res.status(401);
    res.json({
      errorMessage: 'googleIdToken is invalid or expired.'
    });
    return;
  }
  const googleUserId = googleSignInInfo.userId;

  // Connect to the Firestore database.
  const firestoreDb = firebaseAdmin.firestore();

  // Get the user's FrictionLogs from the database.
  const frictionLogDocRef = firestoreDb.collection('frictionLog');
  const snapshot = await frictionLogDocRef.where('googleUserId', '==', googleUserId).get();
  const frictionLogs = [];
  snapshot.forEach((doc) => {
    frictionLogs.push(doc.data());
  });
  res.json({
    frictionLogs
  }).end();
}

module.exports = { handleGetMyFrictionLogs };
