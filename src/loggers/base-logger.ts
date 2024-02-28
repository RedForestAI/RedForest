import { arrayToCsv } from "./log_utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default class BaseLogger {
  loggedData: [string[]];
  supabase: any;
  createTracelogFile: any;

  constructor() {
    this.loggedData = [[]];
    this.supabase = createClientComponentClient();
  }

  name() {
    return "base"
  }

  init() {}

  log(event: any) {}

  clear() {
    this.init();
  }

  getBlob() {
    let content = arrayToCsv(this.loggedData);
    let blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    this.init();
    return blob;
  }

  async upload(
    createTracelogFile: any,
    profileId: string,
    activityId: string,
    activityDataId: string,
    filepath: string,
  ) {
    const file = this.getBlob();
    const db_result = await createTracelogFile.mutateAsync({
      profileId: profileId,
      activityId: activityId,
      activityDataId: activityDataId,
      filepath: filepath,
    });
    if (db_result.error) {
      console.error("Failed to create tracelog file");
      return db_result;
    }

    const storage_result = await this.supabase.storage
      .from("tracelogs")
      .upload(filepath, file);

    if (storage_result.error) {
      console.error("Failed to upload gaze data");
    }
    return storage_result;
  }
}
