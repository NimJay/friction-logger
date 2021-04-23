import { h } from 'preact';
import { Router } from 'preact-router';

// Code-splitting is automated for `routes` directory
import HomeRoute from '../routes/home-route';

const App = () => (
  <div id="app">
    <Router>
      <HomeRoute path="/" />
    </Router>
  </div>
)

export default App;
