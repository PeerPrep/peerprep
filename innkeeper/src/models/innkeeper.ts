import { MatchingParameters, WaitingUsersCount } from 'types/lobby';
import { RoomState, UserState } from 'types/room';

export const getRoomId = (userId: string): string | null => {
  // TODO: Connect to redis for this.
  return 'ROOM_1';
};

export const getRoomState = (roomId: string): RoomState => {
  const user1: UserState = { userId: '1', status: 'ACTIVE', lastSeen: 0 };
  const user2: UserState = { userId: '2', status: 'INACTIVE', lastSeen: 0 };
  return { roomId: 'ROOM_1', question: {}, textEditor: {}, userStates: [user1, user2] };
};

export const findWaitingUser = (parameters: MatchingParameters): string | null => {
  // TODO: after setting up redis.
  return 'user_2';
};

export const removeUserFromQueue = (userId: string): void => {
  // TODO: after setting up redis.
};

export const addUserToQueue = (userId: string, parameters: MatchingParameters): void => {
  // TODO: after setting up redis.
};

export const getWaitingUsers = (): WaitingUsersCount => {
  // TODO: after setting up redis.
  return { totalWaitingUsers: 0, totalWaitingUsersByDifficulty: { EASY: 0, MEDIUM: 0, HARD: 0 } };
};

export const createRoomId = (): string => {
  // TODO: after setting up redis.
  return 'ROOM_1';
};

export const assignUserToRoom = (userId: string, roomId: string): void => {
  // TODO: after setting up redis.
};

export const queueUserOrReturnMatchResult = (
  userId: string,
  parameters: MatchingParameters,
): { roomId: string; otherUserId: string } | null => {
  const otherUserId = findWaitingUser(parameters);
  if (!otherUserId) {
    addUserToQueue(userId, parameters);
    return null;
  }

  const roomId = createRoomId();
  assignUserToRoom(userId, roomId);
  assignUserToRoom(otherUserId, roomId);
  return { roomId, otherUserId };
};
