"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  addCheatSheet,
  CheatSheet,
  deleteCheatSheet,
  getCheatSheet,
  getCheatSheets,
  updateCheatSheet
} from "@/lib/cheatsheet-manager"

export function useCheatSheets() {
  const [cheatSheets, setCheatSheets] = useState<CheatSheet[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const router = useRouter()

  const handleUnauthorized = () => {
    router.push("/signin")
  }

  // Load CheatSheets from backend
  useEffect(() => {
    refreshCheatSheets()
  }, [])

  // Fetch from backend
  const refreshCheatSheets = async () => {
    setLoading(true)
    try {
      const data = await getCheatSheets(handleUnauthorized)
      setCheatSheets(data)
    } finally {
      setLoading(false)
    }
  }

  // Add problem
  const add = async (cheatSheetData: Omit<CheatSheet, "_id">) => {
    const newProblem = await addCheatSheet(cheatSheetData, handleUnauthorized)
    await refreshCheatSheets()
    return newProblem
  }

  // Update problem
  const update = async (id: string, updates: Partial<CheatSheet>) => {
    if (loadingItems[id]) return; // block if already loading

    setLoadingItems((prev) => ({ ...prev, [id]: true }));

    try {
      const updatedCheatSheet = await updateCheatSheet(id, updates, handleUnauthorized);

      setCheatSheets((prev) =>
        prev.map((cs) => (cs._id === id ? { ...cs, ...updatedCheatSheet } : cs))
      );

      return updatedCheatSheet;
    } finally {
      setLoadingItems((prev) => ({ ...prev, [id]: false }));
    }
  };



  // Delete problem
  const remove = async (id: string): Promise<boolean> => {
    if (loadingItems[id]) return false; // Block concurrent request but return boolean

    setLoadingItems((prev) => ({ ...prev, [id]: true }));

    try {
      const success = await deleteCheatSheet(id, handleUnauthorized);
      if (success) {
        setCheatSheets((prev) => prev.filter((cs) => cs._id !== id));
      }
      return success;
    } catch (err) {
      return false; // return false if error
    } finally {
      setLoadingItems((prev) => ({ ...prev, [id]: false }));
    }
  };



  return {
    cheatSheets,
    loading,
    addCheatSheet: add,
    updateCheatSheet: update,
    deleteCheatSheet: remove,
    refreshCheatSheets,
    getCheatSheet, // already async from cheatsheet-manager
  }
}
