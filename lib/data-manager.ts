"use client"

import { useRouter } from "next/navigation"
import type { Problem } from "./mock-data"
import { getToken } from "./token-manager"

const BASE_URL = process.env.BE_API_URL
  ? `${process.env.BE_API_URL}/api/problems`
  : "http://localhost:4000/api/problems";

// Helper to handle JSON responses and 401 redirects
async function json<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    // Navigate to /signin
    if (typeof window !== "undefined") {
      window.location.href = "/signin"
    }
    throw new Error("Unauthorized")
  }

  if (!res.ok) {
    let err
    try {
      err = (await res.json()).error
    } catch {
      err = res.statusText
    }
    throw new Error(err)
  }
  return res.json() as Promise<T>
}

// Get all problems
export async function getProblems(): Promise<Problem[]> {
  const token = getToken()
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    cache: "no-store",
  })
  return json<Problem[]>(res)
}

// Get one problem
export async function getProblem(id: string): Promise<Problem | null> {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    cache: "no-store",
  })
  if (res.status === 404) return null
  return json<Problem>(res)
}

// Add a new problem
export async function addProblem(problemData: Omit<Problem, "id">): Promise<Problem> {
  const token = getToken()
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(problemData),
  })
  return json<Problem>(res)
}

// Update existing problem
export async function updateProblem(id: string, updates: Partial<Problem>): Promise<Problem> {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, 
    },
    body: JSON.stringify(updates),
  })
  return json<Problem>(res)
}

// Delete a problem
export async function deleteProblem(id: string): Promise<boolean> {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/${id}`, { 
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }, 
  })
  if (res.status === 404) return false
  return true
}
