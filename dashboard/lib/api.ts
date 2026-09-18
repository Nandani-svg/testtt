const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "wutherer-dashboard-secret-key-change-me";

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
    ...(options.headers || {}),
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
  return response.json();
}

export const api = {
  getBotStats: () => fetchAPI("/bot/stats"),
  getGuilds: () => fetchAPI("/guilds"),
  getGuildDetails: (guildId: string) => fetchAPI(`/guilds/${guildId}`),
  updateGuildSettings: (guildId: string, data: any) =>
    fetchAPI(`/guilds/${guildId}/settings`, { method: "PATCH", body: JSON.stringify(data) }),
  getModerationCases: (guildId: string) => fetchAPI(`/guilds/${guildId}/moderation/cases`),
  getAutomodConfig: (guildId: string) => fetchAPI(`/guilds/${guildId}/moderation/automod`),
  updateAutomodConfig: (guildId: string, data: any) =>
    fetchAPI(`/guilds/${guildId}/moderation/automod`, { method: "PATCH", body: JSON.stringify(data) }),
  getAntinukeStatus: (guildId: string) => fetchAPI(`/guilds/${guildId}/antinuke`),
  getAntinukeLogs: (guildId: string) => fetchAPI(`/guilds/${guildId}/antinuke/logs`),
  updateAntinukeStatus: (guildId: string, data: any) =>
    fetchAPI(`/guilds/${guildId}/antinuke`, { method: "PATCH", body: JSON.stringify(data) }),
  addAntinukeWhitelist: (guildId: string, userId: string) =>
    fetchAPI(`/guilds/${guildId}/antinuke/whitelist`, { method: "POST", body: JSON.stringify({ user_id: userId }) }),
  removeAntinukeWhitelist: (guildId: string, userId: string) =>
    fetchAPI(`/guilds/${guildId}/antinuke/whitelist/${userId}`, { method: "DELETE" }),
  setPanicLockdown: (guildId: string, action: "lock" | "unlock") =>
    fetchAPI(`/guilds/${guildId}/antinuke/lockdown`, { method: "POST", body: JSON.stringify({ action }) }),
  getVerificationConfig: (guildId: string) => fetchAPI(`/guilds/${guildId}/verification`),
  updateVerificationConfig: (guildId: string, data: any) =>
    fetchAPI(`/guilds/${guildId}/verification`, { method: "PATCH", body: JSON.stringify(data) }),
  getTicketConfig: (guildId: string) => fetchAPI(`/guilds/${guildId}/tickets`),
  updateTicketConfig: (guildId: string, data: any) =>
    fetchAPI(`/guilds/${guildId}/tickets`, { method: "PATCH", body: JSON.stringify(data) }),
  getAIConfig: (guildId: string) => fetchAPI(`/guilds/${guildId}/ai`),
  updateAIConfig: (guildId: string, data: any) =>
    fetchAPI(`/guilds/${guildId}/ai`, { method: "PATCH", body: JSON.stringify(data) }),
  getAnalytics: (guildId: string) => fetchAPI(`/guilds/${guildId}/analytics`),
  getLevelingConfig: (guildId: string) => fetchAPI(`/guilds/${guildId}/leveling`),
  updateLevelingConfig: (guildId: string, data: any) =>
    fetchAPI(`/guilds/${guildId}/leveling`, { method: "PATCH", body: JSON.stringify(data) }),
};
