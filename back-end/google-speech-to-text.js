const speech = require('@google-cloud/speech');

/**
 * We use Google Cloud's "Speech-to-Text" service.
 *
 * @param {string} base64EncodedAudio
 * @returns {Promise<string>} The textual transcription.
 */
async function convertSpeechToText(base64EncodedAudio) {
  const client = new speech.SpeechClient();
  const request = {
    audio: { content: base64EncodedAudio },
    config: { languageCode: 'en-US' },
  };
  const [response] = await client.recognize(request);
  transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcription;
}

module.exports = { convertSpeechToText };
