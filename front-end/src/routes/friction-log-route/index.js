import { Component, h } from 'preact';
import { Link, route } from 'preact-router';
import SecretIdSection from '../../components/secret-id-section';
import { isSignedInViaGoogle } from '../../google-sign-in';
import EventDiv from './event-div';
import EventsData from './events-data';
import FrictionLogData from './friction-log-data';
import style from './style.css';

class FrictionLogRoute extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isInitialDataLoaded: false,
      name: '',
      status: '',
      events: [],
    };
    this.frictionLogData = new FrictionLogData(props.frictionLogId);
    this.eventsData = new EventsData(props.frictionLogId);
    this.onInputName = this.onInputName.bind(this);
    this.updateHtmlDocumentTitle = this.updateHtmlDocumentTitle.bind(this);
  }

  async componentDidMount() {
    this.updateHtmlDocumentTitle();
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
    await this.eventsData.load();
    this.eventsData.listenToOnNewEvent((newEvent) => {
      const { events } = this.state;
      events.unshift(this.clone(newEvent));
      this.setState({ events });
    });
    this.setState({
      events: this.clone(this.eventsData.getEvents()),
      name: this.frictionLogData.getFrictionLogName(),
      isInitialDataLoaded: true
    }, this.updateHtmlDocumentTitle);
  }

  updateHtmlDocumentTitle() {
    const { name } = this.state;
    document.title = name ? `${name}` : 'Loading...';
  }

  clone(thing) {
    return JSON.parse(JSON.stringify(thing));
  }

  componentWillUnmount() {
    this.frictionLogData.stopListeningToOnChangeStatus();
    this.eventsData.stopListeningToOnNewEvent();
  }

  onInputName(e) {
    const name = e.target.value;
    this.setState({ name }, async () => {
      this.updateHtmlDocumentTitle();
      await this.frictionLogData.updateFrictionLogNameWhenReady(name);
    });
  }

  render() {
    const { isInitialDataLoaded, name, status, events } = this.state;

    if (!isInitialDataLoaded) {
      return;
    }

    const frictionLog = this.frictionLogData.frictionLog;
    if (!frictionLog) {
      return;
    }

    const eventDivs = events.map((event, index) => {
      const prevEventTimeWise = events[index + 1];
      const nextEventTimeWise = events[index - 1];
      const dateNumber = (new Date(event.serverCreateTime)).getDate();
      const isLastEventOfDay = !nextEventTimeWise
        || dateNumber < (new Date(nextEventTimeWise.serverCreateTime)).getDate();
      const isFirstEventOfDay = !prevEventTimeWise
        || dateNumber > (new Date(prevEventTimeWise.serverCreateTime)).getDate();
      const isUrlDiffFromPrev = event.url !== prevEventTimeWise?.url;
      const shouldShowUrl = isFirstEventOfDay || isUrlDiffFromPrev;
      return (
        <EventDiv
          event={event} shouldShowDate={isLastEventOfDay} shouldShowUrl={shouldShowUrl}
          key={event.id} />
      );
    });

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
          <div className={style.FrictionLogRouteEvents}>
            {eventDivs}
          </div>
        </main>
      </div>
    );
  }

}

export default FrictionLogRoute;
