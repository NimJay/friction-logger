const firebaseAdmin = require('firebase-admin');
const { convertSpeechToText } = require('./google-speech-to-text');

/**
 * @param {Request} req
 * @param {Response} res
 */
async function handleCreateEventFromChromeExtension(req, res) {
  const { audio, frictionLogSecretId, url } = req.body;

  // Validate input (request body).
  const errorMessage = validateRequestBody(req.body);
  if (errorMessage) {
    res.status(422);
    res.json({ errorMessage });
    return;
  }

  // Connect to the Firestore database.
  const firestoreDb = firebaseAdmin.firestore();

  // Get the Friction Log.
  const frictionLog = await getFrictionLogBySecretId(firestoreDb, frictionLogSecretId);
  if (!frictionLog) {
    res.status(422);
    res.json({ errorMessage: 'Invalid frictionLogSecretId.' });
    return;
  }

  // Speech-to-text!
  const textTranscription = await convertSpeechToText(audio);
  if (textTranscription === '') {
    res.status(422);
    res.json({ errorMessage: 'Invalid audio.' });
    return;
  }

  // Create event.
  const event = {
    text: textTranscription,
    url,
    frictionLogId: frictionLog.id,
    serverCreateTime: Date.now(),
  };
  const eventDoc = firestoreDb.collection(`frictionLog/${frictionLog.id}/event`).doc();
  event.id = eventDoc.id;
  await eventDoc.set(event);

  res.json({ event }).end();
}

function isNonEmptyString(string) {
  return typeof string === 'string' && string !== '';
}

/**
 * @returns {string|null} If there's an error, the error message string will be returned.
 */
function validateRequestBody(requestBody) {
  const { audio, frictionLogSecretId, url } = requestBody;
  if (!isNonEmptyString(audio)) {
    return 'audio must be a non-empty string.';
  }
  if (!isNonEmptyString(frictionLogSecretId)) {
    return 'frictionLogSecretId must be a non-empty string.';
  }
  if (!isNonEmptyString(url)) {
    return 'url must be a non-empty string.';
  }
  return null;
}

async function getFrictionLogBySecretId(firestoreDb, frictionLogSecretId) {
  const frictionLogDocRef = firestoreDb.collection('frictionLog');
  const snapshot = await frictionLogDocRef.where('secretId', '==', frictionLogSecretId).get();
  const frictionLogs = [];
  snapshot.forEach((doc) => {
    frictionLogs.push(doc.data());
  });
  return frictionLogs[0];
}

module.exports = { handleCreateEventFromChromeExtension };
