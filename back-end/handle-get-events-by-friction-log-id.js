const firebaseAdmin = require('firebase-admin');
const { checkGoogleIdToken } = require('./google-sign-in');

/**
 * @param {Request} req
 * @param {Response} res
 */
async function handleGetEventsByFrictionLogId(req, res) {
  const { googleIdToken, frictionLogId } = req.body;

  // Validate input (request body).
  const errorMessage = validateRequestBody(req.body);
  if (errorMessage) {
    res.status(422);
    res.json({ errorMessage });
    return;
  }

  // Check Google Sign-in.
  const googleSignInInfo = await checkGoogleIdToken(googleIdToken);
  if (!googleSignInInfo) {
    res.status(401);
    res.json({ errorMessage: 'googleIdToken is invalid or expired.' });
    return;
  }
  const googleUserId = googleSignInInfo.userId;

  // Connect to the Firestore database.
  const firestoreDb = firebaseAdmin.firestore();

  // Get the FrictionLog.
  const frictLogSnapshot = await firestoreDb.collection('frictionLog').doc(frictionLogId).get();
  const frictionLog = frictLogSnapshot.data();
  if (!frictionLog || frictionLog.googleUserId !== googleUserId) {
    res.status(422);
    res.json({
      errorMessage: 'Invalid frictionLogId.'
    });
    return;
  }

  // Get all Events of the FrictionLog.
  const eventsRef = firestoreDb.collection(`frictionLog/${frictionLog.id}/event`);
  const snapshot = await eventsRef.get();
  const events = [];
  snapshot.forEach((doc) => {
    events.push(doc.data());
  });
  res.json({
    events
  }).end();
}

function isNonEmptyString(string) {
  return typeof string === 'string' && string !== '';
}

/**
 * @returns {string|null} If there's an error, the error message string will be returned.
 */
function validateRequestBody(requestBody) {
  const { googleIdToken, frictionLogId } = requestBody;
  if (!isNonEmptyString(googleIdToken)) {
    return 'googleIdToken must be a non-empty string.';
  }
  if (!isNonEmptyString(frictionLogId)) {
    return 'frictionLogId must be a non-empty string.';
  }
  return null;
}

module.exports = { handleGetEventsByFrictionLogId };
