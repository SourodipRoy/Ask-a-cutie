
import { z } from 'zod';

export const insertRequestSchema = z.object({
  question: z.string().min(1, "Question is required").max(100),
  message: z.string().min(1, "Success message is required").max(500),
});

export type InsertRequest = z.infer<typeof insertRequestSchema>;

// We'll use Base64 encoding for the URL
export function encodeData(data: InsertRequest): string {
  const str = JSON.stringify(data);
  // Using btoa-like encoding for the browser/node compatibility
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeData(encoded: string): InsertRequest | null {
  try {
    // Reverse base64url to base64
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    
    const str = decodeURIComponent(escape(atob(base64)));
    const data = JSON.parse(str);
    return insertRequestSchema.parse(data);
  } catch (e) {
    console.error("Decoding error:", e);
    return null;
  }
}
