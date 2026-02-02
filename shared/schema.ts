
import { z } from 'zod';

export const insertRequestSchema = z.object({
  question: z.string().min(1, "Question is required").max(100),
  message: z.string().min(1, "Success message is required").max(500),
});

export type InsertRequest = z.infer<typeof insertRequestSchema>;

// We'll use Base64 encoding for the URL for simplicity in this stateless version
export function encodeData(data: InsertRequest): string {
  const str = JSON.stringify(data);
  // Using btoa for a simple encryption (obfuscation) in the URL
  return Buffer.from(str).toString('base64url');
}

export function decodeData(encoded: string): InsertRequest | null {
  try {
    const str = Buffer.from(encoded, 'base64url').toString('utf8');
    const data = JSON.parse(str);
    return insertRequestSchema.parse(data);
  } catch (e) {
    return null;
  }
}
