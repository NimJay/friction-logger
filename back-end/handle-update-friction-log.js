const firebaseAdmin = require('firebase-admin');
const { checkGoogleIdToken } = require('./google-sign-in');

/**
 * @param {Request} req
 * @param {Response} res
 */
async function handleUpdateFrictionLog(req, res) {
  const { googleIdToken, frictionLog } = req.body;

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

  // Get FrictionLog with matching id from database.
  const firestoreDb = firebaseAdmin.firestore();
  const frictLogSnapshot = await firestoreDb.collection('frictionLog').doc(frictionLog.id).get();
  const frictionLogFromDb = frictLogSnapshot.data();
  if (!frictionLogFromDb || frictionLogFromDb.googleUserId !== googleUserId) {
    res.status(422);
    res.json({
      errorMessage: 'Invalid frictionLog.id.'
    });
    return;
  }

  // Validate name.
  if (typeof frictionLog.name !== 'string' || frictionLog.name === '') {
    res.status(422);
    res.json({
      errorMessage: 'frictionLog.name must be a non-empty string.'
    });
    return;
  }

  // Save frictionLog.
  frictionLogFromDb.name = frictionLog.name;
  await firestoreDb.collection('frictionLog').doc(frictionLog.id).set(frictionLogFromDb);
  res.json({
    frictionLog: frictionLogFromDb
  });
}

module.exports = { handleUpdateFrictionLog };
