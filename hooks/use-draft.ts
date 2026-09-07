"use client";
import { useSyncExternalStore } from "react";
import { getDraftStore } from "@/lib/draft-store";
import type { FrameworkId } from "@/lib/frameworks";

export function useDraft(id: FrameworkId) {
  const store = getDraftStore(id);
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...state, update: store.update, reset: store.reset, reload: store.reload };
}
