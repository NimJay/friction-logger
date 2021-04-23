import { Component, h } from 'preact';
import { route } from 'preact-router';
import { isSignedInViaGoogle } from '../../google-sign-in';
import style from './style.css';

class FrictionLogsRoute extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    if (!isSignedInViaGoogle()) {
      route('/');
    }
  }

  render() {
    return (
      <div>
        <main class={style.FrictionLogsRoute}>
          FrictionLogsRoute
        </main>
      </div>
    );
  }
}

export default FrictionLogsRoute;
