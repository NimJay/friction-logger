import { Component, h } from 'preact';
import { route } from 'preact-router';
import { GoogleLogin } from 'react-google-login';
import style from './style.css';

class HomeRoute extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.onGoogleSignIn = this.onGoogleSignIn.bind(this);
  }

  onComponentDidMount() {
    const isLoggedIn = false; // TODO
    if (isLoggedIn) {
      route('/friction-logs');
    }
  }

  onGoogleSignIn(googleSignInInfo) {
    // TODO: Make use of googleSignInInfo.
  }

  render() {
    return (
      <div>
        <main class={style.HomeRoute}>
          <img src="/assets/icons/mstile-150x150.png" alt="Friction Logger logo. 3 horizontal, squiggly lines." />
          <h1>friction logger</h1>
          <GoogleLogin
            clientId="1052534869599-cecih1nddg81jh8dnpjckbsmj8912aj6.apps.googleusercontent.com"
            buttonText="Sign in with Google"
            onSuccess={this.onGoogleSignIn}
            onFailure={this.onGoogleSignIn}
            cookiePolicy={'single_host_origin'} />
        </main>
      </div>
    );
  }
}

export default HomeRoute;
