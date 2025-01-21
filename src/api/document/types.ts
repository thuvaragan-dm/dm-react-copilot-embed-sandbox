export type DocumentInput = {
  file: File;
  shard_id: string;
  description: string;
};

export interface DocumentSearchResult {
  id: string;
  embedding_id: string | null;
  source_text: string;
  name: string;
  object_ref: string;
  distance: number;
}
interface MetadataFields {
  Email: string;
  LastName: string;
  FirstName: string;
}

export interface Document {
  id: string;
  name: string;
  description: string;
  file_format: string;
  metadata_fields: MetadataFields;
  source: string | null;
  source_id: string | null;
  source_ref: string | null;
  object_ref: string;
  version: number;
  shard_id: string;
  document_type_id: string;
  signed_url: string | null;
  annotations: any[]; // You can replace 'any' with a more specific type if known
  created_at: string; // Alternatively, use Date if parsing is done before
}

export interface DocumentMap {
  id: string;
  source_map: Record<string, string>;
  markup: string;
  document_id: string;
  file_format: string;
}

export interface ApiSecret {
  token: string;
  valid_upto: string;
}

export type GetDocumentParams = {
  signed_url?: boolean;
};
