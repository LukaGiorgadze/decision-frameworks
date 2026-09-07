"use client";
import { useSyncExternalStore } from "react";
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
export function BrowserEditingNotice({ directory = false }: { directory?: boolean }) {
  const ready = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  if (ready) return null;
  return <p className="no-js-notice no-print">{directory ? "All six templates are listed below. Search and editing require JavaScript." : "Enable JavaScript to edit and save this worksheet. You can still read the instructions and worked example below."}</p>;
}
