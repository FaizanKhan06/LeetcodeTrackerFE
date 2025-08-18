"use client"

import { useState, useEffect } from "react"
import type { Problem } from "@/lib/mock-data"
import { getStatistics } from "@/lib/mock-data"
import {
  getProblems,
  addProblem,
  updateProblem,
  deleteProblem,
  getProblem,
} from "@/lib/data-manager"

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  // Load problems from backend
  useEffect(() => {
    refreshProblems()
  }, [])

  // Fetch from backend
  const refreshProblems = async () => {
    setLoading(true)
    try {
      const data = await getProblems()
      setProblems(data)
    } finally {
      setLoading(false)
    }
  }

  // Add problem
  const add = async (problemData: Omit<Problem, "id">) => {
    const newProblem = await addProblem(problemData)
    await refreshProblems()
    return newProblem
  }

  // Update problem
  const update = async (id: string, updates: Partial<Problem>) => {
    const updatedProblem = await updateProblem(id, updates)
    await refreshProblems()
    return updatedProblem
  }

  // Delete problem
  const remove = async (id: string) => {
    const success = await deleteProblem(id)
    if (success) await refreshProblems()
    return success
  }

  const statistics = getStatistics(problems)

  return {
    problems,
    loading,
    statistics,
    addProblem: add,
    updateProblem: update,
    deleteProblem: remove,
    refreshProblems,
    getProblem, // already async from data-manager
  }
}
