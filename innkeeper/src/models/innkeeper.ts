import crypto from 'crypto';
import { MatchingParameters, WaitingUsersCount } from 'types/lobby';
import { RoomState } from 'types/room';

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

// Avoid issues regarding hashing objects.
type ConsistentMatchingParameterObject = [MatchingParameters['questionDifficulty']];
const makeConsistentMatchingParameterObject = (parameters: MatchingParameters): ConsistentMatchingParameterObject => {
  return [parameters.questionDifficulty];
};

const matchingParameterToUserMap = new Map<ConsistentMatchingParameterObject, string>();

export const findWaitingUser = (parameters: MatchingParameters): string | null => {
  const consistentMatchingParameterObject = makeConsistentMatchingParameterObject(parameters);
  const otherUserId = matchingParameterToUserMap.get(consistentMatchingParameterObject);
  return otherUserId ?? null; // Converting string | undefined to string | null.
};

export const removeUserFromQueue = (userId: string): void => {
  matchingParameterToUserMap.forEach((otherUserId, parameters) => {
    if (otherUserId === userId) {
      matchingParameterToUserMap.delete(parameters);
    }
  });
};

export const addUserToQueue = (userId: string, parameters: MatchingParameters): void => {
  matchingParameterToUserMap.set(makeConsistentMatchingParameterObject(parameters), userId);
};

export const getWaitingUsers = (): WaitingUsersCount => {
  return { totalWaitingUsers: matchingParameterToUserMap.size };
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

export const queueUserOrReturnMatchResult = (userId: string, parameters: MatchingParameters): [string, RoomState] | null => {
  const otherUserId = findWaitingUser(parameters);
  if (!otherUserId) {
    addUserToQueue(userId, parameters);
    return null;
  }

  return [otherUserId, createRoomId([userId, otherUserId])];
};
