import { useSyncExternalStore } from "react";

type State = { selectedSurveys: string[]; firmId?: string };
let state: State = { selectedSurveys: [] };
const listeners = new Set<() => void>();

export const bookingStore = {
  get: () => state,
  set: (next: Partial<State>) => {
    state = { ...state, ...next };
    listeners.forEach((l) => l());
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export const useBooking = () =>
  useSyncExternalStore(bookingStore.subscribe, bookingStore.get, bookingStore.get);
