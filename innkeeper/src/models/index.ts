import crypto from 'crypto';
import { MatchingParameters, RoomState, WaitingUsersCount } from '../types';

// Avoid issues regarding hashing objects.
type MatchingParametersHash = string;

export class InnState {
  private matchingParameterToUserMap = new Map<MatchingParametersHash, string>();
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

  createRoomId(userIds: [string, string]): RoomState {
    const roomId = `ROOM_${crypto.randomUUID()}`;
    const newRoomState: RoomState = {
      roomId,
      questionId: '',
      userStates: [
        { userId: userIds[0], status: 'INACTIVE', lastSeen: 0 },
        { userId: userIds[1], status: 'INACTIVE', lastSeen: 0 },
      ],
      chatHistory: [],
    };
    this.roomStatesMap.set(roomId, newRoomState);

    return newRoomState;
  }

  queueUserOrReturnMatchResult(userId: string, parameters: MatchingParameters): [string, RoomState] | null {
    const otherUserId = this.findWaitingUser(parameters);
    if (!otherUserId) {
      this.addUserToQueue(userId, parameters);
      return null;
    }

    this.removeUserFromQueue(otherUserId);
    return [otherUserId, this.createRoomId([userId, otherUserId])];
  }

  findWaitingUser(parameters: MatchingParameters): string | null {
    const consistentMatchingParameterObject = this.makeConsistentMatchingParameterObject(parameters);
    const otherUserId = this.matchingParameterToUserMap.get(consistentMatchingParameterObject);
    return otherUserId ?? null; // Converting string | undefined to string | null.
  }

  removeUserFromQueue(userId: string): void {
    this.matchingParameterToUserMap.forEach((otherUserId, parameters) => {
      if (otherUserId === userId) {
        this.matchingParameterToUserMap.delete(parameters);
      }
    });
  }

  addUserToQueue(userId: string, parameters: MatchingParameters): void {
    this.matchingParameterToUserMap.set(this.makeConsistentMatchingParameterObject(parameters), userId);
  }

  getWaitingUsers(): WaitingUsersCount {
    return { totalWaitingUsers: this.matchingParameterToUserMap.size };
  }

  private makeConsistentMatchingParameterObject(parameters: MatchingParameters): MatchingParametersHash {
    return `${parameters.questionDifficulty}`;
  }
}
