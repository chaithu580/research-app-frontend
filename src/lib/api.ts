// API utilities for Research Summarizer backend

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://research-app-10.onrender.com";

export interface UploadResponse {
  message: string;
  filename: string;
  chunks: number;
}

export interface SummarizeResponse {
  query: string;
  summary: string;
  context_count: number;
  citations_found: string[];
}

export interface CitationsResponse {
  citations: string[];
  count: number;
}

export interface CompareResponse {
  similarity_percent: number;
}

export interface PapersResponse {
  uploaded_papers: string[];
}

export interface ClusterResponse {
  clusters: string[][];
}

export const api = {
  async uploadPDF(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    return response.json();
  },

  async summarize(query: string): Promise<SummarizeResponse> {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Summarization failed");
    }

    return response.json();
  },

  async extractCitations(text: string): Promise<CitationsResponse> {
    const response = await fetch(`${API_BASE_URL}/citations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Citation extraction failed");
    }

    return response.json();
  },

  async compareAbstracts(
    original: string,
    generated: string
  ): Promise<CompareResponse> {
    const response = await fetch(`${API_BASE_URL}/compare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ original, generated }),
    });

    if (!response.ok) {
      throw new Error("Comparison failed");
    }

    return response.json();
  },

  async listPapers(): Promise<PapersResponse> {
    const response = await fetch(`${API_BASE_URL}/papers`);

    if (!response.ok) {
      throw new Error("Failed to fetch papers");
    }

    return response.json();
  },

  async deletePaper(filename: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/delete/${filename}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Delete failed");
    }

    return response.json();
  },

  async clusterTopics(): Promise<ClusterResponse> {
    const response = await fetch(`${API_BASE_URL}/cluster`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Clustering failed");
    }

    return response.json();
  },
};
