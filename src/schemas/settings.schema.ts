/*import { z } from "zod";

export const AddDomainSchema = z.object({
  name: z
    .string()
    .min(3, "Domain name must be at least 3 characters long")
    .max(255, "Domain name cannot exceed 255 characters"),
  icon: z.string().url("Invalid image URL").optional(), // Optional icon URL
});
*/

// // my working code

// import * as z from "zod";

// export const AddDomainSchema = z.object({
//   name: z
//     .string()
//     .min(1, "Domain name is required")
//     .regex(
//       /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
//       "Please enter a valid domain name (e.g., example.com)"
//     ),
//   icon: z.string().min(1, "Domain icon is required"),
//   campaignId: z.string().optional(),
// });

// export type AddDomainInput = z.infer<typeof AddDomainSchema>;

// Arslan's code
import { z } from 'zod';

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 2
export const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg']

export type DomainSettingsProps = {
  domain?: string
  image?: any
  welcomeMessage?: string
}

export type HelpDeskQuestionsProps = {
  question: string
  answer: string
}

export type AddProductProps = {
  name: string
  image: any
  price: string
}

export type FilterQuestionsProps = {
  question: string
}

export const AddDomainSchema = z.object({
  domain: z.string().min(4, 'A domain must have at least 3 characters')
  .regex(
      /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      "Please enter a valid domain name (e.g., example.com)"
    ),
  icon: z.string().min(1, "Domain icon is required"),
  campaignId: z.string().optional(),
});

export type AddDomainInput = z.infer<typeof AddDomainSchema>;

