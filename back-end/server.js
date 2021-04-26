'use strict';

const express = require('express');
const cors = require('cors');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./private-stuff/nimjay-starter-project-eaa5f55fd0fe.json');
const { handleGetMyFrictionLogs } = require('./handle-get-my-friction-logs');
const { handleCreateFrictionLog } = require('./handle-create-friction-log');
const { handleGetEventsByFrictionLogId } = require('./handle-get-events-by-friction-log-id');
const { handleCreateEventFromChromeExtension } = require(
  './handle-create-event-from-chrome-extension');
const { handleUpdateFrictionLog } = require('./handle-update-friction-log');

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, _, next) => {
  console.log(`Just got a request at: ${req.url}`);
  next();
});

// Serve the static front-end files.
app.use(express.static(__dirname + '/front-end-build'));

// Every endpoint uses POST for simplicity.
app.post('/back-end/get-my-friction-logs', handleGetMyFrictionLogs);
app.post('/back-end/create-friction-log', handleCreateFrictionLog);
app.post('/back-end/get-events-by-friction-log-id', handleGetEventsByFrictionLogId);
app.options('/back-end/create-event-from-chrome-extension', cors());
app.post('/back-end/create-event-from-chrome-extension', cors(),
  handleCreateEventFromChromeExtension);
app.post('/back-end/update-friction-log', handleUpdateFrictionLog);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`The Friction Logger Node.js server is now running on port ${PORT}.`);
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
  });
});

module.exports = app;
