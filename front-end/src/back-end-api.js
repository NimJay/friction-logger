import { getGoogleIdToken } from './google-sign-in';

const SERVER_URL = 'http://localhost:8080';

function getEventsByFrictionLogId(frictionLogId) {
  return makePostRequest('/back-end/get-events-by-friction-log-id', {
    frictionLogId,
    googleIdToken: getGoogleIdToken(),
  });
}

function getMyFrictionLogs() {
  return makePostRequest('/back-end/get-my-friction-logs', {
    googleIdToken: getGoogleIdToken(),
  });
}

function createFrictionLog(frictionLogName) {
  return makePostRequest('/back-end/create-friction-log', {
    name: frictionLogName,
    googleIdToken: getGoogleIdToken(),
  });
}

function updateFrictionLog(frictionLog) {
  return makePostRequest('/back-end/update-friction-log', {
    frictionLog,
    googleIdToken: getGoogleIdToken(),
  });
}

function makePostRequest(path, body) {
  const headers = {
    'Content-Type': 'application/json',
  };
  const promise = fetch(SERVER_URL + path, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  });
  return promise.then((response) => response.json());
}

export {
  getEventsByFrictionLogId,
  getMyFrictionLogs,
  createFrictionLog,
  updateFrictionLog,
};
