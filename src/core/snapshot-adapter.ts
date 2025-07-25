import { Getter } from "jotai";
import { AtomAdapter, Loadable, Snapshot } from "./types";

export const getLoadable_factory =
  (get: Getter) =>
  <T>(atom: AtomAdapter<T>): Loadable<T> => {
    try {
      // Attempt to get the atom's value synchronously
      const value = get(atom);
      return { state: "hasValue", contents: value };
    } catch (error) {
      if (error instanceof Promise) {
        // If the error is a Promise, the atom is in a loading state
        return { state: "loading" };
      } else {
        // If the error is not a Promise, an actual error occurred
        return { state: "hasError", contents: error as Error };
      }
    }
  };

export const snapshotAdapter = (get: Getter): Snapshot => {
  return {
    getPromise: async (atom) => get(atom),
    retain: () => () => {
      // Shim
      return;
    },
    getLoadable: getLoadable_factory(get),
  };
};
