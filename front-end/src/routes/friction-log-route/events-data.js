import { getEventsByFrictionLogId } from '../../back-end-api';

const MILLISEC_WAIT_BETWEEN_POLLS = 5000;

class EventsData {

  constructor(frictionLogId) {
    this.frictionLogId = frictionLogId;
    this.events = [];
    this.timeLoadedFromServer = 0;

    this.onNewEventCallback = () => {};
    this.shouldPollServerForNewEvents = false;
    this.doesEventWithIdExistMap = new Map();
  }

  async load() {
    const { events } = await getEventsByFrictionLogId(this.frictionLogId);
    this.timeLoadedFromServer = Date.now();
    this.sortListOfEvents(events);
    this.events = events;
    this.events.forEach((event) => {
      this.doesEventWithIdExistMap.set(event.id, true);
    });
  }

  sortListOfEvents(events) {
    events.sort((eventA, eventB) => {
      return eventB.serverCreateTime - eventA.serverCreateTime;
    });
  }

  getEvents() {
    return this.events;
  }

  waitXMilliseconds(xMilliseconds) {
    return new Promise((resolve) => {
      return setTimeout(resolve, xMilliseconds);
    });
  }

  listenToOnNewEvent(listenerCallback) {
    this.onNewEventCallback = listenerCallback;
    this.shouldPollServerForNewEvents = true;
    this.periodicallyPollServerForNewEvents();
  }

  async periodicallyPollServerForNewEvents() {
    await this.waitXMilliseconds(MILLISEC_WAIT_BETWEEN_POLLS);
    await this.pollServerForNewEvents();
    if (this.shouldPollServerForNewEvents) {
      this.periodicallyPollServerForNewEvents();
    }
  }

  async pollServerForNewEvents() {
    const { events } = await getEventsByFrictionLogId(this.frictionLogId);
    const newEvents = [];
    events.forEach((event) => {
      if (!this.doesEventWithIdExistMap.has(event.id)) {
        newEvents.push(event);
      }
    });
    newEvents.forEach(this.addNewEventToEvents.bind(this));
    this.sortListOfEvents(newEvents);
  }

  addNewEventToEvents(event) {
    this.events.unshift(event);
    this.doesEventWithIdExistMap.set(event.id, true);
    this.onNewEventCallback(event);
  }

  stopListeningToOnNewEvent() {
    this.shouldPollServerForNewEvents = false;
    this.onNewEventCallback = () => {};
  }

}

export default EventsData;
