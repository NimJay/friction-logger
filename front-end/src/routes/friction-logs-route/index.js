import { Component, h } from 'preact';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';
import { getMyFrictionLogs, createFrictionLog } from '../../back-end-api';
import LoadingSection from '../../components/loading-section';
import { isSignedInViaGoogle } from '../../google-sign-in';
import style from './style.css';

class FrictionLogsRoute extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isInitialDataLoaded: false,
      isCreatingFrictionLog: false,
      frictionLogs: [],
    };
    this.createFrictionLog = this.createFrictionLog.bind(this);
  }

  async componentDidMount() {
    document.title = 'My Friction Logs';
    if (!isSignedInViaGoogle()) {
      route('/');
    }
    await this.loadFrictionLogs();
    this.setState({ isInitialDataLoaded: true });
  }

  async loadFrictionLogs() {
    const { frictionLogs } = await getMyFrictionLogs();
    this.setState({ frictionLogs });
  }

  createFrictionLog() {
    this.setState({ isCreatingFrictionLog: true }, async () => {
      const { frictionLog } = await createFrictionLog("Untitled Friction Log");
      route(`/friction-logs/${frictionLog.id}`);
    });
  }

  render() {
    const {
      isInitialDataLoaded, frictionLogs, isCreatingFrictionLog
    } = this.state;

    if (!isInitialDataLoaded) {
      return (
        <div className={style.FrictionLogsRoute}>
          <LoadingSection />
        </div>
      );
    }

    const frictionLogLis = frictionLogs.map((frictionLog) => (
      <li key={frictionLog.id}>
        <Link href={`/friction-logs/${frictionLog.id}`}>
          {frictionLog.name}
        </Link>
      </li>
    ));

    return (
      <div className={style.FrictionLogsRoute}>
        <main>
          <h1>My Friction Logs</h1>
          {frictionLogs.length === 0
            && <p>You don't have any friction logs.</p>}
          {frictionLogs.length > 0
            && <ol>{frictionLogLis}</ol>}
          <button onClick={this.createFrictionLog} disabled={isCreatingFrictionLog}>
            + New Friction Log
          </button>
        </main>
      </div>
    );
  }
}

export default FrictionLogsRoute;
