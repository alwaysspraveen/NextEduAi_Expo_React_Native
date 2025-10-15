import axios from "axios";

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type UploadResponse = {
  ok: boolean;
  materialId?: string;
  chunks?: number;
  error?: string;
};
export type ChatResponse = { ok: boolean; output?: string; error?: string };

// Base URL for your backend
const BASE_URL = "http://192.168.29.191:5001/api"; // 👈 change to your server URL

class RagApi {
  async uploadMaterial(form: FormData): Promise<UploadResponse> {
    const res = await axios.post(`${BASE_URL}/materials/upload`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  async chat(
    materialId: string,
    input: string,
    chatHistory: ChatMessage[]
  ): Promise<ChatResponse> {
    const body = {
      materialId,
      input,
      chat_history: chatHistory.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    };
    const res = await axios.post(`${BASE_URL}/rag/chat`, body, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  }

  async createExam(body: FormData | object) {
    const res = await axios.post(`${BASE_URL}/exams`, body, {
      headers:
        body instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
    });
    return res.data;
  }
}

export default new RagApi();
