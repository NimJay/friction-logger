import { getMyFrictionLogs, updateFrictionLog } from "../../back-end-api";

class FrictionLogRouteData {

  constructor(frictionLogId) {
    this.frictionLogId = frictionLogId;
    this.frictionLog = null;
  }

  async load() {
    const { frictionLogs } = await getMyFrictionLogs();
    this.frictionLog = frictionLogs.find(fl => fl.id === this.frictionLogId);
  }

  getFrictionLogName() {
    return this.frictionLog ? this.frictionLog.name : '';
  }

  async updateFrictionLogNameWhenReady(frictionLogName) {
    this.frictionLog.name = frictionLogName;
    await updateFrictionLog(this.frictionLog);
  }

}

export default FrictionLogRouteData;
