import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/services/api";

export type Profile = {
  id: string;
  display_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  goal?: string | null;
  level?: string | null;
  pom_coin?: number | null;
  gem?: number | null;
  words_learned?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  user_id: string;
  profile?: Profile | null;
};

export type MeResponse = {
  user_id: string;
  profile: Profile;
};

export const tokenStorage = {
  async set(accessToken: string, refreshToken: string) {
    await AsyncStorage.multiSet([
      ["access_token", accessToken],
      ["refresh_token", refreshToken],
    ]);
  },
  async getAccessToken() {
    return AsyncStorage.getItem("access_token");
  },
  async getRefreshToken() {
    return AsyncStorage.getItem("refresh_token");
  },
  async clear() {
    await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
  },
};

export const authApi = {
  register: (payload: { name: string; email: string; password: string; confirm_password: string }) =>
    api.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    api.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  refresh: (refresh_token: string) =>
    api.request<{ access_token: string }>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token }),
    }),
  me: (accessToken: string) =>
    api.request<MeResponse>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  logout: (accessToken: string, refreshToken?: string | null) =>
    api.request<{ ok: boolean }>("/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ refresh_token: refreshToken || null }),
    }),
};
