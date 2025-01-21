import { z } from "zod";

export const CreateAgentSchema = z.object({
  avatar: z.string().optional(),
  path: z
    .string({ required_error: "Path is required." })
    .min(1, { message: "Path is required." }),
  name: z
    .string({ required_error: "Name is required." })
    .min(1, { message: "Name is required." }),
  description: z
    .string({ required_error: "Description is required." })
    .min(1, { message: "Description is required." }),
  instructions: z.string().nullable(),
  shard_id: z
    .string({ required_error: "Bucket is required." })
    .min(1, { message: "Bucket is required." }),
  tone: z
    .string({ required_error: "Tone is required." })
    .min(1, { message: "Tone is required." }),
  prompt: z
    .string({ required_error: "Prompt is required." })
    .min(1, { message: "Prompt is required." }),
  public: z.boolean().default(false),
  hub_theme: z.string().optional(),
  provision_email: z.boolean().default(false),
  provision_phone: z.boolean().default(false),
  limit_to_context: z.boolean().default(false),
  block_nsfw: z.boolean().default(false),
  metadata_fields: z
    .object({
      default_questions: z
        .array(
          z.object({
            question: z
              .string({ required_error: "Question is required." })
              .min(1, "Question is required."),
          }),
        )
        .optional()
        .default([]),
    })
    .nullable(),
});

export const UpdateAgentSchema = CreateAgentSchema.partial().omit({
  avatar: true,
  shard_id: true,
});
