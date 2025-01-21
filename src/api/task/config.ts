export enum ETask {
  FETCH_ALL = 1,
  FETCH_SINGLE = 2,
}

export const taskKey: Record<ETask, string> = {
  [ETask.FETCH_ALL]: "get-all-tasks",
  [ETask.FETCH_SINGLE]: "get-single-task",
};
