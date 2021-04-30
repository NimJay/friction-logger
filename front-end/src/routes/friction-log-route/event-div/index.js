import { Component, h } from 'preact';
import style from './style.css';

function cleanUrl(url) {
  url = url.replace(/http(s)?:\/\/(www\.)?|/g, '');
  if (url.length > 50) {
    url = url.substring(0, 20) + '...' + url.substring(url.length - 20);
  }
  return url;
}

class EventDiv extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { event, shouldShowDate, shouldShowUrl } = this.props;
    return (
      <div class={style.EventDiv}>
        {shouldShowDate
          && <span class={style.EventDivDate}>
            {(new Date(event.serverCreateTime)).toDateString()}
          </span>}
        <span className={style.EventDivText}>{event.text}</span>
        {shouldShowUrl
          && <span class={style.EventDivUrl}>
            <a href={event.url} target="_blank">{cleanUrl(event.url)}</a>
          </span>}
        <span class={style.EventDivTime}>
          {(new Date(event.serverCreateTime)).toLocaleTimeString()}
        </span>
      </div>
    );
  }

}

export default EventDiv;
