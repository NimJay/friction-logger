import { getMyFrictionLogs, updateFrictionLog } from "../../back-end-api";

const MILLISEC_WAIT_BEFORE_SAVING = 1000;
const MILLISEC_WAIT_BEFORE_SAVING_MAX = 3000;

class FrictionLogData {

  constructor(frictionLogId) {
    this.frictionLogId = frictionLogId;
    this.frictionLog = null;
    this.lastChangeId = 0;
    this.timeLoadedFromServer = 0;
    this.timeOfLastSave = 0;

    this.status = 'Inactive';
    this.onChangeStatusCallback = () => {};
  }

  async load() {
    const { frictionLogs } = await getMyFrictionLogs();
    this.timeLoadedFromServer = Date.now();
    this.frictionLog = frictionLogs.find(fl => fl.id === this.frictionLogId);
  }

  getFrictionLogName() {
    return this.frictionLog ? this.frictionLog.name : '';
  }

  waitXMilliseconds(xMilliseconds) {
    const promise = new Promise((resolve) => {
      return setTimeout(() => {
        resolve();
      }, xMilliseconds);
    });
    return promise;
  }

  isWaitingTooLongToSaveChanges() {
    const timeNow = Date.now();
    const timeOfLastSync = this.timeOfLastSave !== 0
      ? this.timeOfLastSave
      : this.timeLoadedFromServer;
    return timeNow - timeOfLastSync > MILLISEC_WAIT_BEFORE_SAVING_MAX;
  }

  async updateFrictionLogNameWhenReady(frictionLogName) {
    this.frictionLog.name = frictionLogName;
    this.lastChangeId += 1;
    const changeId = this.lastChangeId;
    await this.waitXMilliseconds(MILLISEC_WAIT_BEFORE_SAVING);
    // A few moments later...
    const hasNewChangeTriggeredNewSave = changeId !== this.lastChangeId;
    if (!hasNewChangeTriggeredNewSave || this.isWaitingTooLongToSaveChanges()) {;
      this.timeOfLastSave = Date.now();
      this.updateStatus('Saving');
      await updateFrictionLog(this.frictionLog);
      this.updateStatus('Inactive');
    }
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    this.onChangeStatusCallback(this.status);
  }

  listenToOnChangeStatus(listenerCallback) {
    this.onChangeStatusCallback = listenerCallback;
  }

  stopListeningToOnChangeStatus() {
    this.onChangeStatusCallback = () => {};
  }

}

export default FrictionLogData;
