import { Component, h } from 'preact';
import { Link, route } from 'preact-router';
import SecretIdSection from '../../components/secret-id-section';
import { isSignedInViaGoogle } from '../../google-sign-in';
import FrictionLogRouteData from './friction-log-route-data';
import style from './style.css';

class FrictionLogRoute extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isInitialDataLoaded: false,
      name: '',
      status: '',
    };
    this.data = new FrictionLogRouteData(props.frictionLogId);
    this.onInputName = this.onInputName.bind(this);
  }

  async componentDidMount() {
    if (!isSignedInViaGoogle()) {
      route('/');
      return;
    }
    this.data.listenToOnChangeStatus((newStatus) => {
      if (newStatus === 'Inactive') {
        this.setState({ status: '' });
      }
      if (newStatus === 'Saving') {
        this.setState({ status: 'Saving...' });
      }
    });
    await this.data.load();
    this.setState({
      name: this.data.frictionLog.name,
      isInitialDataLoaded: true
    });
  }

  componentWillUnmount() {
    this.data.stopListeningToOnChangeStatus();
  }

  onInputName(e) {
    const name = e.target.value;
    this.setState({ name }, async () => {
      await this.data.updateFrictionLogNameWhenReady(name);
    });
  }

  render() {
    const { isInitialDataLoaded, name, status } = this.state;

    if (!isInitialDataLoaded) {
      return;
    }

    const frictionLog = this.data.frictionLog;
    if (!frictionLog) {
      return;
    }

    return (
      <div class={style.FrictionLogRoute}>
        <main>
          <header>
            <Link href="/friction-logs">
              &larr; All Friction Logs
            </Link>
            <span>{status}</span>
          </header>
          <form>
            <input type="text" value={name} onInput={this.onInputName} />
          </form>
          <SecretIdSection secretId={frictionLog.secretId} />
        </main>
      </div>
    );
  }

}

export default FrictionLogRoute;
