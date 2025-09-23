import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Highlight } from "@/lib/highlights/selectors";

interface CreateHighlightData {
  article_slug: string;
  text_quote_exact: string;
  text_quote_prefix?: string;
  text_quote_suffix?: string;
  text_position_start?: number;
  text_position_end?: number;
  note?: string;
  color: string;
  is_public?: boolean;
}

interface UpdateHighlightData {
  note?: string;
  color?: string;
  is_public?: boolean;
}

// API functions
async function fetchHighlights(slug?: string): Promise<Highlight[]> {
  const url = slug ? `/api/highlights?slug=${encodeURIComponent(slug)}` : "/api/highlights";
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Failed to fetch highlights");
  }
  
  const data = await response.json();
  return data.highlights || [];
}

async function createHighlight(data: CreateHighlightData): Promise<Highlight> {
  const response = await fetch("/api/highlights", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("Failed to create highlight");
  }
  
  const result = await response.json();
  return result.highlight;
}

async function updateHighlight(id: string, data: UpdateHighlightData): Promise<Highlight> {
  const response = await fetch(`/api/highlights/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("Failed to update highlight");
  }
  
  const result = await response.json();
  return result.highlight;
}

async function deleteHighlight(id: string): Promise<void> {
  const response = await fetch(`/api/highlights/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error("Failed to delete highlight");
  }
}

// Hooks
export function useHighlights(slug?: string) {
  return useQuery({
    queryKey: ["highlights", slug],
    queryFn: () => fetchHighlights(slug),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateHighlight() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createHighlight,
    onSuccess: (newHighlight) => {
      // Update article-specific highlights
      queryClient.setQueryData(
        ["highlights", newHighlight.article_slug],
        (old: Highlight[] | undefined) => {
          if (!old) return [newHighlight];
          return [...old, newHighlight];
        }
      );
      
      // Update global highlights
      queryClient.setQueryData(
        ["highlights"],
        (old: Highlight[] | undefined) => {
          if (!old) return [newHighlight];
          return [...old, newHighlight];
        }
      );
    },
  });
}

export function useUpdateHighlight() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHighlightData }) =>
      updateHighlight(id, data),
    onSuccess: (updatedHighlight) => {
      // Update article-specific highlights
      queryClient.setQueryData(
        ["highlights", updatedHighlight.article_slug],
        (old: Highlight[] | undefined) => {
          if (!old) return [updatedHighlight];
          return old.map((h) => h.id === updatedHighlight.id ? updatedHighlight : h);
        }
      );
      
      // Update global highlights
      queryClient.setQueryData(
        ["highlights"],
        (old: Highlight[] | undefined) => {
          if (!old) return [updatedHighlight];
          return old.map((h) => h.id === updatedHighlight.id ? updatedHighlight : h);
        }
      );
    },
  });
}

export function useDeleteHighlight() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, articleSlug }: { id: string; articleSlug: string }) => {
      deleteHighlight(id);
      return { id, articleSlug };
    },
    onSuccess: ({ id, articleSlug }) => {
      // Update article-specific highlights
      queryClient.setQueryData(
        ["highlights", articleSlug],
        (old: Highlight[] | undefined) => {
          if (!old) return [];
          return old.filter((h) => h.id !== id);
        }
      );
      
      // Update global highlights
      queryClient.setQueryData(
        ["highlights"],
        (old: Highlight[] | undefined) => {
          if (!old) return [];
          return old.filter((h) => h.id !== id);
        }
      );
    },
  });
}