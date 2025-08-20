"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getUser,
  clearToken,
  User,
} from "@/lib/token-manager";
import {
  authManager,
  SignInData,
  SignUpData,
  UpdateProfileData,
  ResetPasswordData,
} from "@/lib/auth-manager";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Handle unauthorized -> redirect to signin
  const handleUnauthorized = () => {
    clearToken();
    setUser(null);
    router.push("/signin");
  };

  // On mount -> check token and set user
  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Sign in
  const signIn = async (data: SignInData) => {
    setLoading(true);
    try {
      const loggedInUser = await authManager.signIn(data);
      setUser(loggedInUser);
      router.push("/");
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  // Sign up
  const signUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      const newUser = await authManager.signUp(data);
      setUser(newUser);
      router.push("/");
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (data: UpdateProfileData) => {
    setLoading(true);
    try {
      const updatedUser = await authManager.updateProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      if (err.message === "Unauthorized") handleUnauthorized();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    try {
      return await authManager.requestPasswordReset(email);
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (data: ResetPasswordData) => {
    setLoading(true);
    try {
      return await authManager.resetPassword(data);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = () => {
    clearToken();
    setUser(null);
    router.push("/signin");
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    updateProfile,
    requestPasswordReset,
    resetPassword,
    signOut,
  };
}
