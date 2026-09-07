import { createDraft, hasWork, parseDraft, type Draft } from "./drafts";
import type { FrameworkId } from "./frameworks";

export type DraftStatus = "loading" | "ready" | "saved" | "unavailable" | "corrupt" | "conflict";
export type DraftState = { draft: Draft; status: DraftStatus };
export const storageKey = (id: FrameworkId) => `decision-frameworks:v1:${id}`;
type StoragePort = Pick<Storage, "getItem" | "setItem" | "removeItem">;

// A single store serves both the worksheet and browser tools. Writes happen in
// the edit action, not an effect, so hydration cannot overwrite a saved draft.
export function createDraftStore(id: FrameworkId, getStorage: () => StoragePort) {
  const initial: DraftState = { draft: createDraft(id), status: "loading" };
  let state = initial;
  let initialized = false;
  let protectedData = false;
  let lastRaw: string | null = null;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((listener) => listener());
  function load() {
    initialized = true;
    try {
      lastRaw = getStorage().getItem(storageKey(id));
      const draft = lastRaw === null ? createDraft(id) : parseDraft(lastRaw, id);
      protectedData = draft === null;
      state = { draft: draft ?? createDraft(id), status: draft === null ? "corrupt" : lastRaw === null ? "ready" : "saved" };
    } catch { state = { ...state, status: "unavailable" }; }
    emit();
  }
  return {
    getSnapshot: () => state,
    getServerSnapshot: () => initial,
    subscribe(listener: () => void) { listeners.add(listener); if (!initialized) load(); return () => { listeners.delete(listener); }; },
    update(draft: Draft) {
      if (!initialized) load();
      if (draft.frameworkId !== id || !parseDraft(JSON.stringify(draft), id)) throw new Error("This worksheet data is not valid.");
      const next = { ...draft, updatedAt: Date.now() };
      let status: DraftStatus = protectedData ? state.status : "saved";
      if (!protectedData) {
        try {
          const storage = getStorage();
          // Another tab must not silently lose work to this tab's stale draft.
          if (storage.getItem(storageKey(id)) !== lastRaw) { protectedData = true; status = "conflict"; }
          else { const raw = JSON.stringify(next); storage.setItem(storageKey(id), raw); lastRaw = raw; }
        } catch { status = "unavailable"; }
      }
      state = { draft: next, status };
      emit();
      return state;
    },
    reset() {
      try {
        getStorage().removeItem(storageKey(id));
        lastRaw = null;
        protectedData = false;
        state = { draft: createDraft(id), status: "ready" };
      } catch { state = { ...state, status: "unavailable" }; }
      emit();
      return state;
    },
    reload: load,
  };
}

const stores = new Map<FrameworkId, ReturnType<typeof createDraftStore>>();
export function getDraftStore(id: FrameworkId) {
  let store = stores.get(id);
  if (!store) { store = createDraftStore(id, () => window.localStorage); stores.set(id, store); }
  return store;
}
export function savedDraftIds(storage: StoragePort, ids: FrameworkId[]) {
  return ids.filter((id) => {
    try { const raw = storage.getItem(storageKey(id)); const draft = raw ? parseDraft(raw, id) : null; return draft !== null && hasWork(draft); } catch { return false; }
  });
}
