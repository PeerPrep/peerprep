import { InnState } from '../models';
import { MatchingParameters } from '../types';

describe('InnState', () => {
  let innState: InnState;

  beforeEach(() => {
    innState = new InnState();
  });

  afterEach(() => {
    // Clean up after each test
    innState = null!;
  });

  it('should create a room and return the room state', () => {
    const userIds: [string, string] = ['user1', 'user2'];
    const roomState = innState.createRoomId(userIds);

    expect(roomState).toBeTruthy();
    expect(roomState.roomId).toMatch(/^ROOM_/);
    expect(roomState.userStates.length).toBe(2);
    expect(roomState.userStates[0].userId).toBe(userIds[0]);
    expect(roomState.userStates[1].userId).toBe(userIds[1]);
  });

  it('should queue a user and return null when there are no matching users', () => {
    const userId = 'user1';
    const parameters: MatchingParameters = { questionDifficulty: 'EASY' };
    const result = innState.queueUserOrReturnMatchResult(userId, parameters);

    expect(result).toBeNull();
    expect(innState.findWaitingUser(parameters)).toBe(userId);
    expect(innState.getWaitingUsers().totalWaitingUsers).toBe(1);
  });

  it('should remove a room when given its roomId', () => {
    const userIds: [string, string] = ['user1', 'user2'];
    const roomState = innState.createRoomId(userIds);
    const roomId = roomState.roomId;

    innState.removeRoom(roomId);

    expect(innState.getRoomState(roomId)).toBeUndefined();
  });

  it('should add a user to the queue and remove the user when necessary', () => {
    const userId1 = 'user1';
    const userId2 = 'user2';
    const parameters: MatchingParameters = { questionDifficulty: 'EASY' };

    innState.addUserToQueue(userId1, parameters);
    innState.removeUserFromQueue(userId1);

    expect(innState.findWaitingUser(parameters)).toBeNull();
  });

  it('should successfully match two users', () => {
    const userIds: [string, string] = ['user1', 'user2'];
    const parameters: MatchingParameters = { questionDifficulty: 'EASY' };

    innState.addUserToQueue(userIds[0], parameters);
    innState.addUserToQueue(userIds[1], parameters);

    const result = innState.queueUserOrReturnMatchResult(userIds[0], parameters);

    expect(result).toBeTruthy();
    expect(result![0]).toBe(userIds[1]);
    expect(innState.getWaitingUsers().totalWaitingUsers).toBe(0);
  });

  it('should match correct user pairs only', () => {
    const parameters1: MatchingParameters = { questionDifficulty: 'EASY' };
    const parameters2: MatchingParameters = { questionDifficulty: 'MEDIUM' };

    const result1 = innState.queueUserOrReturnMatchResult('user1', parameters1);
    const result3 = innState.queueUserOrReturnMatchResult('user3', parameters2);
    const result2 = innState.queueUserOrReturnMatchResult('user2', parameters1);

    expect(result1).toBeNull();
    expect(result3).toBeNull();
    expect(result2![0]).toBe('user1');
    expect(innState.getWaitingUsers().totalWaitingUsers).toBe(1);
    expect(innState.findWaitingUser(parameters2)).toBe('user3');
  });
});
