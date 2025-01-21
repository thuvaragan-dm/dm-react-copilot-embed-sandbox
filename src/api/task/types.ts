export interface Task {
  id: string;
  task_name: string | null;
  request: string;
  hil_enabled: boolean;
  copilot_output: {
    message: string;
    input_id: string;
    file_name: string;
    output_id: string;
  } | null;
  hil_output: {
    message: string;
    input_id: string;
    file_name: string;
    output_id: string;
  } | null;
  status: string;
  copilot_id: string;
  workspace_id: string;
  task_feedback_entries: unknown[];
  created_at: string;
}

export interface CommentObject {
  id: string;
  name: string;
  comments: string[];
  createdAt: string;
}

export interface CommentResponse {
  response: Comment[];
}

export interface Comment {
  source: string | null;
  shard_id: string;
  source_id: string | null;
  file_format: string | null;
  source_ref: string | null;
  id: string;
  object_ref: string;
  created_at: string;
  metadata_fields: MetadataFields;
  updated_at: string;
  version: number;
  description: string;
  document_type_id: string;
  name: string;
  annotations: Annotation[];
  signed_url: string;
}

export interface MetadataFields {
  Email: string;
  "Last Name": string;
  "First Name": string;
}

export interface Annotation {
  context: string;
  selector: Selector[];
  element_id: string | null;
  created_at: string;
  updated_at: string;
  type: string;
  document_id: string;
  id: string;
  annotation_bodies: AnnotationBody[];
}

export interface Selector {
  type: string;
  exact?: string;
  end?: number;
  start?: number;
}

export interface AnnotationBody {
  annotation_id: string;
  type: string;
  created_at: string;
  value: string;
  purpose: string;
  id: string;
  updated_at: string;
}
