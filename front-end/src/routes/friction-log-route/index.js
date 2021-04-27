import { Component, h } from 'preact';
import { Link, route } from 'preact-router';
import SecretIdSection from '../../components/secret-id-section';
import { isSignedInViaGoogle } from '../../google-sign-in';
import FrictionLogData from './friction-log-data';
import style from './style.css';

class FrictionLogRoute extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isInitialDataLoaded: false,
      name: '',
      status: '',
    };
    this.frictionLogData = new FrictionLogData(props.frictionLogId);
    this.onInputName = this.onInputName.bind(this);
  }

  async componentDidMount() {
    if (!isSignedInViaGoogle()) {
      route('/');
      return;
    }
    this.frictionLogData.listenToOnChangeStatus((newStatus) => {
      if (newStatus === 'Inactive') {
        this.setState({ status: '' });
      }
      if (newStatus === 'Saving') {
        this.setState({ status: 'Saving...' });
      }
    });
    await this.frictionLogData.load();
    this.setState({
      name: this.frictionLogData.frictionLog.name,
      isInitialDataLoaded: true
    });
  }

  componentWillUnmount() {
    this.frictionLogData.stopListeningToOnChangeStatus();
  }

  onInputName(e) {
    const name = e.target.value;
    this.setState({ name }, async () => {
      await this.frictionLogData.updateFrictionLogNameWhenReady(name);
    });
  }

  render() {
    const { isInitialDataLoaded, name, status } = this.state;

    if (!isInitialDataLoaded) {
      return;
    }

    const frictionLog = this.frictionLogData.frictionLog;
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
