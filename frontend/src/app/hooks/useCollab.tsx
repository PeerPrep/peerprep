import { socketAtom } from "@/libs/room-jotai";
import {
  Update,
  collab,
  getSyncedVersion,
  receiveUpdates,
  sendableUpdates,
} from "@codemirror/collab";
import { ChangeSet } from "@codemirror/state";
import { EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { Socket } from "socket.io-client";

function pullUpdates(
  socket: Socket,
  version: number,
): Promise<readonly Update[]> {
  return new Promise(function (resolve) {
    socket.emit("pullUpdates", version);

    socket.once("pullUpdateResponse", function (updates: any) {
      resolve(JSON.parse(updates));
    });
  }).then((updates: any) =>
    updates.map((u: any) => ({
      changes: ChangeSet.fromJSON(u.changes),
      clientID: u.clientID,
    })),
  );
}

const editorViewStateAtom = atom<EditorView | null>(null);

export const writeChangeSetAtom = atom(
  null,
  (get, set, updates: readonly Update[]) => {
    if (updates.length !== 0)
      console.log(`pulled ${updates.length} updates from server`);
    const state = get(editorViewStateAtom);
    if (!state) {
      console.error("editorViewStateAtom not set but updates received");
      return;
    }
    state.dispatch(receiveUpdates(state.state, updates));
  },
);

export const useCollab = (startVersion: number) => {
  const socket = useAtomValue(socketAtom);
  const setEditorViewState = useSetAtom(editorViewStateAtom);

  const plugin = ViewPlugin.define((editorViewState: EditorView) => {
    console.log("defining viewPlugin for pushing updates");
    setEditorViewState(editorViewState);

    // If a view update happens, push (locally made) changes to the server (actual param ignored).
    const update = (_update: ViewUpdate) => {
      const updates = sendableUpdates(editorViewState.state);
      if (updates.length === 0) {
        return;
      }

      if (!socket) {
        console.error("socket not set but updates to push");
        return;
      }

      const lastKnownVersion = getSyncedVersion(editorViewState.state);
      console.log(
        `syncing ${updates.length} updates from ver ${lastKnownVersion}`,
      );
      socket.emit(
        "syncDocument",
        lastKnownVersion,
        updates.map((u) => ({
          stringifiedChangeSet: JSON.stringify(u.changes),
          clientId: u.clientID,
        })),
      );
    };

    // Doesn't seem necessary for us?
    const destroy = () => {
      console.log("destroyed called on peerExtension");
    };

    return { update, destroy };
  });

  return [collab({ startVersion }), plugin];
};
