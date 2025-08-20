"use client";

import { getToken, saveToken, saveWithExpiry, User } from "./token-manager";

const API_BASE = process.env.NEXT_PUBLIC_BE_API_URL
  ? `${process.env.NEXT_PUBLIC_BE_API_URL}/api/auth`
  : "http://localhost:4000/api/auth";

// Helper to handle JSON responses
async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let err;
    try {
      err = (await res.json()).error;
    } catch {
      err = res.statusText;
    }
    throw new Error(err);
  }
  return res.json() as Promise<T>;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export const authManager = {
  signIn: async (data: SignInData): Promise<User> => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await json<{ token: string; user: User }>(res);
    saveToken(result.token, result.user);
    return result.user;
  },

  signUp: async (data: SignUpData): Promise<User> => {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await json<{ token: string; user: User }>(res);
    saveToken(result.token, result.user);
    return result.user;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const token = getToken();
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_BASE}/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await json<User>(res);
    saveWithExpiry<User>("user", result);
    return result;
  },

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return json<{ message: string }>(res);
  },

  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return json<{ message: string }>(res);
  },

  deleteAccount: async (password: string): Promise<{ ok: boolean; message: string }> => {
    const token = getToken();
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_BASE}/me`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    return json<{ ok: boolean; message: string }>(res);
  },

  getCurrentUser: async (): Promise<User> => {
    const token = getToken();
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_BASE}/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = await json<{ name: string; email: string }>(res);
    if (!user) throw new Error("No user found");
    return user as User;
  }

};
