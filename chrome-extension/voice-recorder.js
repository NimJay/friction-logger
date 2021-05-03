function isNonEmptyString(string) {
  return typeof string === 'string' && string !== '';
}

class AudioRecorder {

  constructor() {
    this.isRecording = false;
    this.shouldStopRecording = false;
    this.mediaRecorder = null;
    this.recordedBlobs = [];
  }

  startRecording() {
    // This will ask the user for permission to record.
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

        this.mediaRecorder.addEventListener('dataavailable', (e) => {
          if (e.data.size > 0) {
            this.recordedBlobs.push(e.data);
          }

          if (this.shouldStopRecording && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
          }
        });

        this.isRecording = true;
        this.mediaRecorder.start(1000); // Trigger dataavailable every second.
      })
  }

  stopRecording() {
    const promise = new Promise((resolve) => {
      this.mediaRecorder.addEventListener('stop', () => {
        const fullAudioBlob = new Blob(this.recordedBlobs);

        const reader = new FileReader();
        reader.readAsDataURL(fullAudioBlob);
        reader.onload = () => {
          const base64Audio = reader.result.split(',')[1];
          resolve(base64Audio);
        }
      });
    });

    this.shouldStopRecording = true;
    return promise;
  }

}

function createEventViaPostRequest(base64Audio, url, frictionLogSecretId) {
  return fetch('http://localhost:8080/back-end/create-event-from-chrome-extension', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audio: base64Audio,
      url,
      frictionLogSecretId,
    })
  });
}

async function getSecretIdAndUrl() {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      ['frictionLogSecretId', 'eventUrl'],
      ({ frictionLogSecretId, eventUrl }) => {
        resolve({ secretId: frictionLogSecretId, url: eventUrl });
      });
  });
}

let isSaving = false;
const audioRecorder = new AudioRecorder();

window.onload = () => {

  audioRecorder.startRecording();

  // When any key is pressed, we stop recording, save to the server, and close this tab!
  window.onkeydown = async function () {
    if (isSaving) {
      return;
    }
    isSaving = true;
    document.getElementById('status').innerHTML = 'Recording stopped.';
    const base64Audio = await audioRecorder.stopRecording();
    const { url, secretId } = await getSecretIdAndUrl();
    if (isNonEmptyString(url) && isNonEmptyString(secretId)) {
      document.getElementById('status').innerHTML = 'Saving to Friction Log...';
      await createEventViaPostRequest(base64Audio, url, secretId);
    } else {
      // TODO: Let the user know that they need to fill in the Secret ID.
    }
    window.close();
  };

};
