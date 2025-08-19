"use client";

import { getToken, saveToken, saveWithExpiry, User } from "./token-manager";

const API_BASE = process.env.BE_API_URL
  ? `${process.env.BE_API_URL}/api/auth`
  : "http://localhost:4000/api/auth";

// Helper to handle JSON responses and 401 redirects
async function json<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/signin"; // Redirect to sign-in
    }
    throw new Error("Unauthorized");
  }

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

export const authManager = {
  signIn: async (data: SignInData): Promise<User> => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await json<{ token: string; user: User }>(res);
    saveToken(result.token, result.user); // no JSON.stringify needed
    return result.user;
  },

  signUp: async (data: SignUpData): Promise<User> => {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await json<{ token: string; user: User }>(res);
    saveToken(result.token, result.user); // no JSON.stringify needed
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
    saveWithExpiry<User>("user", result); // store as object, not string
    return result;
  },
};
