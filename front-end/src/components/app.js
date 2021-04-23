import { h } from 'preact';
import { Router } from 'preact-router';

// Code-splitting is automated for `routes` directory
import HomeRoute from '../routes/home-route';
import FrictionLogRoute from '../routes/friction-log-route';
import FrictionLogsRoute from '../routes/friction-logs-route';

const App = () => (
  <div id="app">
    <Router>
      <HomeRoute path="/" />
      <FrictionLogsRoute path="/friction-logs" />
      <FrictionLogRoute path="/friction-logs/:frictionLogId" />
    </Router>
  </div>
)

export default App;
