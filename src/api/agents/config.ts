export enum EAgents {
  FETCH_ALL = 1,
  FETCH_SINGLE = 2,
  FETCH_SKILLS = 3,
}

export const agentsKey: Record<EAgents, string> = {
  [EAgents.FETCH_ALL]: "get-all-agents",
  [EAgents.FETCH_SINGLE]: "get-single-agent",
  [EAgents.FETCH_SKILLS]: "get-agent-skills",
};
