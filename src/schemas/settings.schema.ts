/*import { z } from "zod";

export const AddDomainSchema = z.object({
  name: z
    .string()
    .min(3, "Domain name must be at least 3 characters long")
    .max(255, "Domain name cannot exceed 255 characters"),
  icon: z.string().url("Invalid image URL").optional(), // Optional icon URL
});
*/

import * as z from "zod";

export const AddDomainSchema = z.object({
  name: z
    .string()
    .min(1, "Domain name is required")
    .regex(
      /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      "Please enter a valid domain name (e.g., example.com)"
    ),
  icon: z.string().min(1, "Domain icon is required"),
  campaignId: z.string().optional(),
});

export type AddDomainInput = z.infer<typeof AddDomainSchema>;

// Arslan's code
// import { z } from 'zod';

// export const AddDomainSchema = z.object({
//   domainName: z.string().min(1, 'Domain name is required'),
//   icon: z.instanceof(File).optional(),
//   // Add other fields as needed
// });

// export type AddDomainSchemaType = z.infer<typeof AddDomainSchema>;


