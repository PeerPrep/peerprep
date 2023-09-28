import { MatchingParameters, RoomState, WaitingUsersCount } from '../types';
import { createRoomId } from './room';

export const queueUserOrReturnMatchResult = (userId: string, parameters: MatchingParameters): [string, RoomState] | null => {
  const otherUserId = findWaitingUser(parameters);
  if (!otherUserId) {
    addUserToQueue(userId, parameters);
    return null;
  }

  removeUserFromQueue(otherUserId);
  return [otherUserId, createRoomId([userId, otherUserId])];
};

// Avoid issues regarding hashing objects.
type MatchingParametersHash = string;
const makeConsistentMatchingParameterObject = (parameters: MatchingParameters): MatchingParametersHash => {
  return `${parameters.questionDifficulty}`;
};

const matchingParameterToUserMap = new Map<MatchingParametersHash, string>();

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
