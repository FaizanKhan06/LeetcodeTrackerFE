"use client"

import type { Problem } from "./mock-data"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://leetcodetrakerbe.onrender.com/api/problems"

async function json<T>(res: Response) {
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
  const res = await fetch(BASE_URL, { cache: "no-store" })
  return json<Problem[]>(res)
}

// Get one problem
export async function getProblem(id: string): Promise<Problem | null> {
  const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" })
  if (res.status === 404) return null
  return json<Problem>(res)
}

// Add a new problem
export async function addProblem(problemData: Omit<Problem, "id">): Promise<Problem> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(problemData),
  })
  return json<Problem>(res)
}

// Update existing problem
export async function updateProblem(id: string, updates: Partial<Problem>): Promise<Problem> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })
  return json<Problem>(res)
}

// Delete a problem
export async function deleteProblem(id: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
  if (res.status === 404) return false
  return true
}
