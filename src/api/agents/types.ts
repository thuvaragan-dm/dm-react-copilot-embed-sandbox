import { z } from "zod";
import { CreateAgentSchema, UpdateAgentSchema } from "./AgentSchema";
import { Io5IconName } from "../../components/Io5Icons";

export type Agent = {
  id: string;
  shard_id: string;
  name: string;
  path: string;
  prompt: string;
  description: string;
  email_addr_status: "NOT_REQUESTED" | "PROVISION_INPROGRESS" | "PROVISIONED";
  email_addr: string | null;
  phone_number_status: "NOT_REQUESTED" | "PROVISION_INPROGRESS" | "PROVISIONED";
  phone_number: string | null;
  limit_to_context: boolean;
  block_nsfw: boolean;
  tone: string;
  is_active: boolean;
  public: boolean;
  hub_theme: string;
  instructions: string | null;
  avatar: string;
  bg_image_url: string;
  original_image_url: string;
  provision_email: boolean;
  provision_phone: boolean;
  is_avatar_enabled: boolean;
  metadata_fields: {
    default_questions: { question: string }[];
  } | null;
};

export type FunctionType = {
  name: string;
  icon: Io5IconName;
  description: string;
  hil_available: boolean;
};

export type AgentSkill = {
  id: string;
  name: string;
  description: string;
  function: FunctionType;
};

export type GetAgentParam = {
  search?: string;
  records_per_page?: number;
  page?: number;
};

export type CreateAgentInput = z.infer<typeof CreateAgentSchema>;

export type UpdateAgentInput = z.infer<typeof UpdateAgentSchema>;

export type UpdateAgentParam = {
  id: string;
};

export type DeleteAgentParam = {
  id: string;
};

export type ToggleAgentSmsInput = {
  enable: boolean;
};

export type ToggleAgentEmailInput = {
  enable: boolean;
};

export type AddSkillsToAgentInput = {
  skill_config_ids: string[];
};

export type RemoveSkillsFromAgentInput = {
  skill_config_ids: string[];
};

export type UploadAgentAvatarParam = {
  id: string;
};

export type UploadAgentAvatarInput = {
  uploaded_picture: File;
  regenerate_avatar: boolean;
};

export type AddSkillsToAgentParam = {
  id: string;
};

export type RemoveSkillsFromAgentParam = {
  id: string;
};

export type ChangeAgentCoverImageParam = {
  copilot_id: string;
};
