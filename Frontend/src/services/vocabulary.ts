import { api } from "@/services/api";
import { tokenStorage } from "@/services/auth";

export type VocabularyData = {
  id: string;
  word: string;
  type?: string | null;
  phonetic?: string | null;
  meaning_vi?: string | null;
  definition_vi?: string | null;
  example_en?: string | null;
  example_vi?: string | null;
  level?: number | null;
};

export type UserVocabularyData = VocabularyData & {
  vocab_level?: number | null;
  is_reviewing?: boolean | null;
  review_level?: number | null;
  next_review_at?: string | null;
  last_reviewed_at?: string | null;
  review_count?: number | null;
  added_at?: string | null;
};

async function authHeaders(): Promise<Record<string, string>> {
  const token = await tokenStorage.getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export const vocabApi = {
  search: (q: string, limit = 50) =>
    api.request<VocabularyData[]>(`/vocabulary/search?q=${encodeURIComponent(q)}&limit=${limit}`),

  getVocabulary: (offset = 0, limit = 50) =>
    api.request<VocabularyData[]>(`/vocabulary?offset=${offset}&limit=${limit}`),

  getDistracters: (excludeIds = "", limit = 100) =>
    api.request<VocabularyData[]>(
      `/vocabulary/distractors?exclude_ids=${encodeURIComponent(excludeIds)}&limit=${limit}`
    ),

  sync: async (vocabularyId: string) => {
    const headers = await authHeaders();
    return api.request<UserVocabularyData>("/vocabulary/sync", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ vocabulary_id: vocabularyId }),
    });
  },

  getMine: async (params?: {
    is_reviewing?: boolean;
    review_level?: number;
    search?: string;
  }) => {
    const headers = await authHeaders();
    const query = new URLSearchParams();
    if (params?.is_reviewing !== undefined) query.set("is_reviewing", String(params.is_reviewing));
    if (params?.review_level) query.set("review_level", String(params.review_level));
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    return api.request<UserVocabularyData[]>(
      `/vocabulary/mine${qs ? `?${qs}` : ""}`,
      { headers },
    );
  },

  toggle: async (vocabularyId: string) => {
    const headers = await authHeaders();
    return api.request<{ is_reviewing: boolean }>(
      `/vocabulary/mine/${vocabularyId}/toggle`,
      { method: "PATCH", headers },
    );
  },

  updateLevel: async (vocabularyId: string, level: number) => {
    const headers = await authHeaders();
    return api.request<UserVocabularyData>(
      `/vocabulary/mine/${vocabularyId}/level`,
      {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ level }),
      },
    );
  },

  getReviewWords: async (limit = 20) => {
    const headers = await authHeaders();
    return api.request<UserVocabularyData[]>(
      `/vocabulary/review?limit=${limit}`,
      { headers },
    );
  },

  submitAnswer: async (vocabularyId: string, correct: boolean) => {
    const headers = await authHeaders();
    return api.request<{ review_level: number; next_review_at: string; review_count: number }>(
      `/vocabulary/review/${vocabularyId}/answer`,
      {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ correct }),
      },
    );
  },

  remove: async (vocabularyId: string) => {
    const headers = await authHeaders();
    return api.request<{ ok: boolean }>(
      `/vocabulary/mine/${vocabularyId}`,
      { method: "DELETE", headers },
    );
  },

  // AI Features
  getAIExamples: async (vocabularyId: string) => {
    const headers = await authHeaders();
    return api.request<string[]>(
      `/vocabulary/${vocabularyId}/ai/examples`,
      { headers },
    );
  },

  getAIDistracters: async (vocabularyId: string, count = 3) => {
    const headers = await authHeaders();
    return api.request<string[]>(
      `/vocabulary/${vocabularyId}/ai/distractors?count=${count}`,
      { headers },
    );
  },

  getBatchAIDistracters: async (vocabularyIds: string[], count = 3) => {
    const headers = await authHeaders();
    return api.request<Record<string, string[]>>(
      `/vocabulary/ai/distractors/batch`,
      {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ vocabulary_ids: vocabularyIds, count }),
      },
    );
  },
};
