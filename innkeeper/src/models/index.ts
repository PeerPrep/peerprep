/// <reference path="../codemirror__index.d.ts" />
import { Update, rebaseUpdates } from '@codemirror/collab';
import { ChangeSet, Text } from '@codemirror/state';
import crypto from 'crypto';
import { DocumentUpdate, MatchingParameters, RoomState, WaitingUsersCount } from '../types';

// Avoid issues regarding hashing objects.
type MatchingParametersHash = string;

export class InnState {
  private matchingParameterToUserMap = new Map<MatchingParametersHash, string>();
  private roomStatesMap = new Map<string, RoomState>();
  private documentChangesMap = new Map<string, Update[]>();

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

  getDocumentChanges(roomId: string): Update[] | undefined {
    return this.documentChangesMap.get(roomId);
  }

  syncDocumentChanges(roomId: string, docUpdates: DocumentUpdate[]): void {
    const documentChanges = this.documentChangesMap.get(roomId);
    const roomState = this.roomStatesMap.get(roomId);
    if (!documentChanges || !roomState) {
      console.error(`Unexpected undefined roomState / documentChange for roomId ${roomId}.`);
      return;
    }

    const updates: readonly Update[] = docUpdates.map(update => ({
      changes: ChangeSet.fromJSON(update.stringifiedChangeSet),
      clientID: update.clientId,
    }));

    const rebasedUpdates = rebaseUpdates(updates, documentChanges);
    for (const update of rebasedUpdates) {
      roomState.textEditor.doc = update.changes.apply(Text.of(roomState.textEditor.doc.split('\n'))).toString();
    }

    this.roomStatesMap.set(roomId, roomState);
    documentChanges.push(...rebasedUpdates);
  }

  removeRoom(roomId: string): void {
    this.roomStatesMap.delete(roomId);
  }

  createRoomId(userIds: [string, string]): RoomState {
    const roomId = `ROOM_${crypto.randomUUID()}`;
    const newRoomState: RoomState = {
      roomId,
      questionId: '',
      textEditor: { version: 0, doc: `console.log('Hello world!');` },
      userStates: [
        { userId: userIds[0], status: 'INACTIVE', lastSeen: 0, version: 0 },
        { userId: userIds[1], status: 'INACTIVE', lastSeen: 0, version: 0 },
      ],
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
