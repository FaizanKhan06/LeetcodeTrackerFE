"use client"

import { getToken } from "./token-manager"

export interface Problem {
  _id?: string
  id: string
  number: number
  title: string
  link: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  status: "Solved" | "To Do" | "Reviewing"
  dateSolved?: string
  approaches: {
    title: string
    description: string
    code: string
    language: string
  }[]
  notes: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BE_API_URL
  ? `${process.env.NEXT_PUBLIC_BE_API_URL}/api/problems`
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

export function getStatistics(problems: Problem[]) {
  const total = problems.length
  const solved = problems.filter((p) => p.status === "Solved").length
  const reviewing = problems.filter((p) => p.status === "Reviewing").length
  const todo = problems.filter((p) => p.status === "To Do").length

  const easy = problems.filter((p) => p.difficulty === "Easy").length
  const medium = problems.filter((p) => p.difficulty === "Medium").length
  const hard = problems.filter((p) => p.difficulty === "Hard").length

  const easySolved = problems.filter((p) => p.difficulty === "Easy" && p.status === "Solved").length
  const mediumSolved = problems.filter((p) => p.difficulty === "Medium" && p.status === "Solved").length
  const hardSolved = problems.filter((p) => p.difficulty === "Hard" && p.status === "Solved").length

  const recentActivity = problems
    .filter((p) => p.dateSolved)
    .sort((a, b) => new Date(b.dateSolved!).getTime() - new Date(a.dateSolved!).getTime())
    .slice(0, 5)

  return {
    total,
    solved,
    reviewing,
    todo,
    easy,
    medium,
    hard,
    easySolved,
    mediumSolved,
    hardSolved,
    recentActivity,
    solvedPercentage: total > 0 ? Math.round((solved / total) * 100) : 0,
  }
}
