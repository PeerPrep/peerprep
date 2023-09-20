import crypto from 'crypto';
import { RoomState } from 'types/room';

// TODO: Eventually the roomStatesMap should be moved to Redis. In memory for now.
const roomStatesMap = new Map<string, RoomState>();

export const getRoomId = (userId: string): string | null => {
  const roomStates = Array.from(roomStatesMap.values());
  const matchingRooms = roomStates.filter(roomState => roomState.userStates.some(userState => userState.userId === userId));
  return matchingRooms.length === 0 ? null : matchingRooms[0].roomId;
};

export const getRoomState = (roomId: string): RoomState => {
  return roomStatesMap.get(roomId);
};

export const setRoomState = (roomId: string, roomState: RoomState): void => {
  roomStatesMap.set(roomId, roomState);
};

export const removeRoom = (roomId: string): void => {
  roomStatesMap.delete(roomId);
};

export const createRoomId = (userIds: [string, string]): RoomState => {
  const roomId = `ROOM_${crypto.randomUUID()}`;
  const newRoomState: RoomState = {
    roomId,
    questionId: '',
    textEditor: {},
    userStates: [
      { userId: userIds[0], status: 'INACTIVE', lastSeen: 0 },
      { userId: userIds[1], status: 'INACTIVE', lastSeen: 0 },
    ],
  };
  roomStatesMap.set(roomId, newRoomState);

  return newRoomState;
};
