
"use client"

import { getToken } from "./token-manager"

export interface CheatSheet {
  _id: string
  title: string;
  type: "note" | "snippet";
  content: string;
  favourite: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_BE_API_URL
  ? `${process.env.NEXT_PUBLIC_BE_API_URL}/api/cheatsheets`
  : "http://localhost:4000/api/cheatsheets";

// Helper to handle JSON responses and 401 redirects
async function json<T>(res: Response, onUnauthorized?: () => void): Promise<T> {
  if (res.status === 401) {
    if (onUnauthorized) onUnauthorized()
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

// Get all cheatSheets
export async function getCheatSheets(onUnauthorized?: () => void): Promise<CheatSheet[]> {
  const token = getToken()
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    cache: "no-store",
  })
  return json<CheatSheet[]>(res, onUnauthorized)
}

// Get one cheatSheet
export async function getCheatSheet(id: string, onUnauthorized?: () => void): Promise<CheatSheet | null> {
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
  return json<CheatSheet>(res, onUnauthorized)
}

// Add a new cheatSheet
export async function addCheatSheet(cheetsheetData: Omit<CheatSheet, "_id">, onUnauthorized?: () => void): Promise<CheatSheet> {
  const token = getToken()
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(cheetsheetData),
  })
  return json<CheatSheet>(res, onUnauthorized)
}

// Update existing cheatSheet
export async function updateCheatSheet(id: string, updates: Partial<CheatSheet>, onUnauthorized?: () => void): Promise<CheatSheet> {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, 
    },
    body: JSON.stringify(updates),
  })
  return json<CheatSheet>(res, onUnauthorized)
}

// Delete a cheatSheet
export async function deleteCheatSheet(id: string, onUnauthorized?: () => void): Promise<boolean> {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/${id}`, { 
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }, 
  })
  if (res.status === 404) return false
  if (res.status === 401) {
    if (onUnauthorized) onUnauthorized()
    throw new Error("Unauthorized")
  }
  return true
}