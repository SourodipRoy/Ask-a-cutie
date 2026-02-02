import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertRequest } from "@shared/schema";
import { z } from "zod";

// Helper to handle API requests safely
async function handleResponse<T>(res: Response, schema: z.ZodType<T>) {
  if (!res.ok) {
    let message = 'An unexpected error occurred';
    try {
      const errorData = await res.json();
      message = errorData.message || message;
    } catch {
      // ignore JSON parse error
    }
    throw new Error(message);
  }
  const data = await res.json();
  return schema.parse(data);
}

// POST /api/requests
export function useCreateRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertRequest) => {
      // Validate input before sending
      const validated = api.requests.create.input.parse(data);
      
      const res = await fetch(api.requests.create.path, {
        method: api.requests.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      return handleResponse(res, api.requests.create.responses[201]);
    },
    // No need to invalidate list queries as we don't have a list view, 
    // but good practice generally.
  });
}

// GET /api/requests/:id
export function useRequest(id: string | number) {
  return useQuery({
    queryKey: [api.requests.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.requests.get.path, { id });
      const res = await fetch(url);
      
      // Handle 404 specifically for better UI states
      if (res.status === 404) return null;
      
      return handleResponse(res, api.requests.get.responses[200]);
    },
    enabled: !!id, // Only fetch if ID exists
  });
}
