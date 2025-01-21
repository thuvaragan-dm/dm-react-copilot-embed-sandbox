export type Sender = "user" | "bot" | "USER" | "BOT";

export type Reaction = "like" | "dislike" | null;

export interface Source {
  id: string;
  name: string;
  object_ref: string;
}

export interface Suggestion {
  question: string;
  relevance: number;
}

export interface Video {
  video: string;
  title?: string;
  relevance: number;
}

export interface Message {
  id: string;
  thread_id: string;
  message: string;
  sender: Sender;
  flag: unknown;
  sources: Source[];
  reaction: Reaction;
}

export type MessageInput = {
  thread_id: string;
  message: string;
  sender: Sender;
  flag: unknown;
  sources: Source[];
};

export type ReactionInput = {
  reaction_type: Reaction;
};
