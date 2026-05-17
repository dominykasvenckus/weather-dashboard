import { create, StateCreator } from "zustand";
import {
  createJSONStorage,
  devtools,
  persist,
  PersistOptions,
} from "zustand/middleware";

export function createStore<T>(
  ...args: [name: string, state: StateCreator<T>] | [state: StateCreator<T>]
) {
  const [name, state] = args.length === 1 ? [undefined, args[0]] : args;

  if (name) {
    return create<T>()(
      devtools(
        persist(state, {
          name,
          storage: createJSONStorage(() => localStorage),
        } as PersistOptions<T>),
      ),
    );
  }

  return create<T>()(devtools(state));
}
