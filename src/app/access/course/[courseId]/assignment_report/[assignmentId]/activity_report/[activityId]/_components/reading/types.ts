export type Log = {
  name: string;
  contentType: string;
  data: any;
}

export type PerStudentData = {
  id: string;
  logs: {[key: string]: Log};
  dataStore?: {[key: string]: any}; // Processed data from logs
}