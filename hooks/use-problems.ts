"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  getProblems,
  addProblem,
  updateProblem,
  deleteProblem,
  getProblem,
  Problem,
  getStatistics,
} from "@/lib/problem-manager"

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleUnauthorized = () => {
    router.push("/signin")
  }

  useEffect(() => {
    refreshProblems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshProblems = async () => {
    setLoading(true)
    try {
      const data = await getProblems(handleUnauthorized)
      setProblems(data)
    } finally {
      setLoading(false)
    }
  }

  const add = async (problemData: Omit<Problem, "id">) => {
    const newProblem = await addProblem(problemData, handleUnauthorized)
    await refreshProblems()
    return newProblem
  }

  const update = async (id: string, updates: Partial<Problem>) => {
    const updatedProblem = await updateProblem(id, updates, handleUnauthorized)
    await refreshProblems()
    return updatedProblem
  }

  const remove = async (id: string) => {
    const success = await deleteProblem(id, handleUnauthorized)
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
    getProblem: (id: string) => getProblem(id, handleUnauthorized),
  }
}
