import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { RoomState } from "./innkeeper-api-types";
import { InnkeeperSocketHandlers } from "./innkeeper-types";

const initialRoomState: RoomState = {
  roomId: "",
  questionId: "",
  textEditor: {
    code: `console.log("Hello World");`,
  },
  userStates: [
    { userId: "user_A", status: "ACTIVE", lastSeen: 0 },
    { userId: "user_A", status: "ACTIVE", lastSeen: 0 },
  ],
};

export const roomStateAtom = atom<RoomState>(initialRoomState);
export const textEditorAtom = focusAtom(
  roomStateAtom,
  (state) => state.textEditor,
);
export const userStatesAtom = focusAtom(
  roomStateAtom,
  (state) => state.userStates,
);
