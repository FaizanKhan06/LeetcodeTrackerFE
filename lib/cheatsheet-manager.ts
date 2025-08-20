
"use client"

import { mockCheatsheet } from "./mock-data";
// import { getToken } from "./token-manager"

const mockCheatsheetStore = [...mockCheatsheet];

export interface CheatSheet {
  _id: string
  title: string;
  type: "note" | "snippet";
  content: string;
  favourite: boolean;
}

// const BASE_URL = process.env.NEXT_PUBLIC_BE_API_URL
//   ? `${process.env.NEXT_PUBLIC_BE_API_URL}/api/CheatSheets`
//   : "http://localhost:4000/api/CheatSheets";

// Helper to handle JSON responses and 401 redirects
// async function json<T>(res: Response): Promise<T> {
//   if (res.status === 401) {
//     // Navigate to /signin
//     if (typeof window !== "undefined") {
//       window.location.href = "/signin"
//     }
//     throw new Error("Unauthorized")
//   }

//   if (!res.ok) {
//     let err
//     try {
//       err = (await res.json()).error
//     } catch {
//       err = res.statusText
//     }
//     throw new Error(err)
//   }
//   return res.json() as Promise<T>
// }

// Get all cheatSheets
export async function getCheatSheets(): Promise<CheatSheet[]> {
  // const token = getToken()
  // const res = await fetch(BASE_URL, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${token}`,
  //   },
  //   cache: "no-store",
  // })
  // return json<CheatSheet[]>(res)

  return Promise.resolve(mockCheatsheetStore);
}

// Get one problem
export async function getCheatSheet(id: string): Promise<CheatSheet | null> {
  // const token = getToken()
  // const res = await fetch(`${BASE_URL}/${id}`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${token}`,
  //   },
  //   cache: "no-store",
  // })
  // if (res.status === 404) return null
  // return json<CheatSheet>(res)

  const sheet = mockCheatsheetStore.find((item) => item._id === id) || null;
  return Promise.resolve(sheet);
}

// Add a new problem
export async function addCheatSheet(problemData: Omit<CheatSheet, "id">): Promise<CheatSheet> {
  // const token = getToken()
  // const res = await fetch(BASE_URL, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${token}`,
  //   },
  //   body: JSON.stringify(problemData),
  // })
  // return json<CheatSheet>(res)

  const newSheet: CheatSheet = {
    _id: (mockCheatsheetStore.length + 1).toString(), // always generate new id
    title: problemData.title,
    type: problemData.type,
    content: problemData.content,
    favourite: problemData.favourite,
  };
  mockCheatsheetStore.push(newSheet);
  return Promise.resolve(newSheet);
}

// Update existing problem
export async function updateCheatSheet(id: string, updates: Partial<CheatSheet>): Promise<CheatSheet> {
  // const token = getToken()
  // const res = await fetch(`${BASE_URL}/${id}`, {
  //   method: "PUT",
  //   headers: { 
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${token}`, 
  //   },
  //   body: JSON.stringify(updates),
  // })
  // return json<CheatSheet>(res)

  const index = mockCheatsheetStore.findIndex((item) => item._id === id);
  mockCheatsheetStore[index] = {
    ...mockCheatsheetStore[index],
    ...updates,
  };
  return Promise.resolve(mockCheatsheetStore[index]);
}

// Delete a problem
export async function deleteCheatSheet(id: string): Promise<boolean> {
  // const token = getToken()
  // const res = await fetch(`${BASE_URL}/${id}`, { 
  //   method: "DELETE", 
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${token}`,
  //   }, 
  // })
  // if (res.status === 404) return false
  // return true

  const index = mockCheatsheetStore.findIndex((item) => item._id === id);
  if (index === -1) return Promise.resolve(false);

  mockCheatsheetStore.splice(index, 1);
  return Promise.resolve(true);
}