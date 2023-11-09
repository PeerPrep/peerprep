import crypto from 'crypto';
import { UserId } from 'types/innkeeper-api-types';
import { MatchingParameters, RoomState, WaitingUsersCount } from '../types';

// Avoid issues regarding hashing objects.
type MatchingParametersHash = string;

export class InnState {
  private matchingParameterToUserMap = new Map<MatchingParametersHash, UserId>();
  private roomStatesMap = new Map<string, RoomState>();

  getRoomId(userId: string): string | null {
    const roomStates = Array.from(this.roomStatesMap.values());
    const matchingRooms = roomStates.filter(roomState => roomState.userStates.some(userState => userState.userId === userId));
    return matchingRooms.length === 0 ? null : matchingRooms[0].roomId;
  }

  getRoomState(roomId: string): RoomState | undefined {
    return this.roomStatesMap.get(roomId);
  }

  setRoomState(roomId: string, roomState: RoomState): void {
    this.roomStatesMap.set(roomId, roomState);
  }

  removeRoom(roomId: string): void {
    this.roomStatesMap.delete(roomId);
  }

  createRoomId(users: [UserId, UserId], parameters: MatchingParameters): RoomState {
    const roomId = `ROOM_${crypto.randomUUID()}`;
    const newRoomState: RoomState = {
      roomId,
      questionId: '',
      userStates: [
        { ...users[0], status: 'INACTIVE', lastSeen: 0 },
        { ...users[1], status: 'INACTIVE', lastSeen: 0 },
      ],
      chatHistory: [],
      questionDifficulty: parameters.questionDifficulty,
    };
    this.roomStatesMap.set(roomId, newRoomState);

    return newRoomState;
  }

  queueUserOrReturnMatchResult(userId: UserId, parameters: MatchingParameters): [UserId, RoomState] | null {
    const otherUserId = this.findWaitingUser(parameters);
    if (!otherUserId) {
      this.addUserToQueue(userId, parameters);
      return null;
    }

    this.removeUserFromQueue(otherUserId);
    return [otherUserId, this.createRoomId([userId, otherUserId], parameters)];
  }

  findWaitingUser(parameters: MatchingParameters): UserId | null {
    const consistentMatchingParameterObject = this.makeConsistentMatchingParameterObject(parameters);
    const otherUserId = this.matchingParameterToUserMap.get(consistentMatchingParameterObject);
    return otherUserId ?? null; // Converting string | undefined to string | null.
  }

  removeUserFromQueue(userId: UserId): void {
    this.matchingParameterToUserMap.forEach((otherUserId, parameters) => {
      if (otherUserId.userId === userId.userId) {
        this.matchingParameterToUserMap.delete(parameters);
        console.log(`[LOBBY][INTERNAL] Removed user ${userId.userId} from queue.`);
      }
    });
  }

  addUserToQueue(userId: UserId, parameters: MatchingParameters): void {
    this.removeUserFromQueue(userId);
    this.matchingParameterToUserMap.set(this.makeConsistentMatchingParameterObject(parameters), userId);
    console.log(`[LOBBY][INTERNAL] Added user ${userId.userId} to queue.`);
  }

  getWaitingUsers(): WaitingUsersCount {
    return { totalWaitingUsers: this.matchingParameterToUserMap.size };
  }

  private makeConsistentMatchingParameterObject(parameters: MatchingParameters): MatchingParametersHash {
    return `${parameters.questionDifficulty}`;
  }
}
