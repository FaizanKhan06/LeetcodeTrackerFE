"use client"

import { useState, useEffect } from "react"
import { addCheatSheet, CheatSheet, deleteCheatSheet, getCheatSheet, getCheatSheets, updateCheatSheet } from "@/lib/cheatsheet-manager"

export function useCheatSheets() {
  const [cheatSheets, setCheatSheets] = useState<CheatSheet[]>([])
  const [loading, setLoading] = useState(true)

  // Load CheatSheets from backend
  useEffect(() => {
    refreshCheatSheets()
  }, [])

  // Fetch from backend
  const refreshCheatSheets = async () => {
    setLoading(true)
    try {
      const data = await getCheatSheets()
      setCheatSheets(data)
    } finally {
      setLoading(false)
    }
  }

  // Add problem
  const add = async (problemData: Omit<CheatSheet, "id">) => {
    const newProblem = await addCheatSheet(problemData)
    await refreshCheatSheets()
    return newProblem
  }

  // Update problem
  const update = async (id: string, updates: Partial<CheatSheet>) => {
    const updatedProblem = await updateCheatSheet(id, updates)
    await refreshCheatSheets()
    return updatedProblem
  }

  // Delete problem
  const remove = async (id: string) => {
    const success = await deleteCheatSheet(id)
    if (success) await refreshCheatSheets()
    return success
  }

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
