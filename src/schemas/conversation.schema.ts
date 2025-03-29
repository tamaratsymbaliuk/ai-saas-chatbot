import { ZodType, z } from 'zod'
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from './settings.schema' 

export type ConversationSearchProps = {
  query: string
  domain: string
}

export type ChatBotMessageProps  = {
  content?: string
  image?: any
}

export const ConversationSearchSchema: ZodType<ConversationSearchProps> = 
z.object({
  query: z.string().min(1, { message: 'You must enter a search query' }),
  domain: z.string().min(1, { message: 'You must select a domain' }),
}) as ZodType<ConversationSearchProps>

export const ChatBotMessageSchema: ZodType<ChatBotMessageProps> = 
z.object({
  content: z.string().min(1).optional().or(z.literal('').transform(() => undefined)),
  image: z.any().optional(),
})
.refine((schema) => {
  if (schema.image?.length) {
    if (
      ACCEPTED_FILE_TYPES.includes(schema.image?.[0].type!) &&
      schema.image?.[0].size <= MAX_UPLOAD_SIZE
    ) {
      return true
    }
  }
  if (!schema.image?.length) {
    return true
  }
})




// import * as z from "zod";

// // Schema for conversation search input (domain)
// export const ConversationSearchSchema = z.object({
//   domain: z
//     .string()
//     .min(1, "Domain is required")
//     .regex(
//       /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
//       "Please enter a valid domain name (e.g., example.com)"
//     ),
// });

// // Schema for a chat room (you can modify this based on your needs)
// export const ChatRoomSchema = z.object({
//   id: z.string().uuid(),
//   name: z.string().min(1, "Room name is required"),
//   createdAt: z.string(),
//   updatedAt: z.string(),
// });

// // Schema for a single chat message
// export const ChatMessageSchema = z.object({
//   id: z.string().uuid(),
//   roomId: z.string().uuid(),
//   userId: z.string().uuid(),
//   message: z.string().min(1, "Message cannot be empty"),
//   timestamp: z.string(),
// });

// // You can now define types based on the schema
// export type ConversationSearchInput = z.infer<typeof ConversationSearchSchema>;
// export type ChatRoom = z.infer<typeof ChatRoomSchema>;
// export type ChatMessage = z.infer<typeof ChatMessageSchema>;
