import api from "../utils/api";

export async function fetchConversations() {
  const { data } = await api.get("/messages/conversations");
  return Array.isArray(data) ? data : [];
}

export async function fetchMessages(userId) {
  const { data } = await api.get(`/messages/${userId}`);
  return data;
}

export async function sendMessage(userId, content) {
  const { data } = await api.post("/messages", { userId, content });
  return data;
}
