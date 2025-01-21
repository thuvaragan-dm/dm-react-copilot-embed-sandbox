export enum EThread {
  FETCH_ALL = 1,
  FETCH_SINGLE = 2,
}

export const threadKey: Record<EThread, string> = {
  [EThread.FETCH_ALL]: "get-all-threads",
  [EThread.FETCH_SINGLE]: "get-single-thread",
};
