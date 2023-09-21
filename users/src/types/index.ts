export const EMPTY_OBJECT = {};

export enum StatusMessageType {
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export interface StatusMessage {
  type: StatusMessageType;
  message: string;
}

export interface ApiResponse {
  payload: Object;
  statusMessage: StatusMessage | null;
}
