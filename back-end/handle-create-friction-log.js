const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const { checkGoogleIdToken } = require('./google-sign-in');

/**
 * @param {Request} req
 * @param {Response} res
 */
async function handleCreateFrictionLog(req, res) {
  const { name, googleIdToken } = req.body;

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

  // Validate name.
  if (typeof name !== 'string' || !name) {
    res.status(422);
    res.json({
      errorMessage: 'name must be a non-empty string.'
    });
    return;
  }

  // Generate a secretId for the Friction Log.
  const secretId = uuidv4();

  // Connect to the Firestore database.
  const firestoreDb = firebaseAdmin.firestore();

  // Create a FrictionLog!
  const frictionLog = {
    googleUserId,
    name,
    secretId,
  }
  const frictionLogDoc = firestoreDb.collection('frictionLog').doc();
  frictionLog.id = frictionLogDoc.id;
  await frictionLogDoc.set(frictionLog);

  res.json({
    frictionLog
  });
}

module.exports = { handleCreateFrictionLog };
