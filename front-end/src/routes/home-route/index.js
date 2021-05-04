import { Component, h } from 'preact';
import { route } from 'preact-router';
import { GoogleLogin } from 'react-google-login';
import { isSignedInViaGoogle, signInViaGoogle } from '../../google-sign-in';
import style from './style.css';

class HomeRoute extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.onGoogleSignInSuccess = this.onGoogleSignInSuccess.bind(this);
    this.onGoogleSignInFailure = this.onGoogleSignInFailure.bind(this);
  }

  componentDidMount() {
    document.title = 'Friction Logger';
    if (isSignedInViaGoogle()) {
      route('/friction-logs');
    }
  }

  onGoogleSignInSuccess(googleSignInInfo) {
    const { tokenId } = googleSignInInfo;
    signInViaGoogle(tokenId);
    route('/friction-logs');
  }

  onGoogleSignInFailure() {
    // TODO: Handle failures.
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
            onSuccess={this.onGoogleSignInSuccess}
            onFailure={this.onGoogleSignInFailure}
            cookiePolicy={'single_host_origin'} />
        </main>
      </div>
    );
  }
}

export default HomeRoute;
