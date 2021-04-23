'use strict';

const express = require('express');
const cors = require('cors');
const { handleGetMyFrictionLogs } = require('./handle-get-my-friction-logs');
const { handleCreateFrictionLog } = require('./handle-create-friction-log');
const { handleGetEventsByFrictionLogId } = require('./handle-get-events-by-friction-log-id');
const { handleCreateEventFromChromeExtension } = require(
  './handle-create-event-from-chrome-extension.js');

const app = express();

// Serve the static front-end files.
app.use(express.static(__dirname + '/front-end-build'));

// Every endpoint uses POST for simplicity.
app.post('/back-end/get-my-friction-logs', handleGetMyFrictionLogs);
app.post('/back-end/create-friction-log', handleCreateFrictionLog);
app.post('/back-end/get-events-by-friction-log-id', handleGetEventsByFrictionLogId);
app.options('/back-end/create-event-from-chrome-extension', cors());
app.post('/back-end/create-event-from-chrome-extension', cors(),
  handleCreateEventFromChromeExtension);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`The Friction Logger Node.js server is now running on port ${PORT}.`);
});

module.exports = app;
