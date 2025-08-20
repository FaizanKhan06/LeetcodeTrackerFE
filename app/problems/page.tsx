"use client";

import { useState, useMemo } from "react";
import { ProblemFilters } from "@/components/problem-filters";
import { ProblemCard } from "@/components/problem-card";
import { useProblems } from "@/hooks/use-problems";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ProblemsPage() {
  const { problems, loading, deleteProblem } = useProblems();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedSort, setSelectedSort] = useState("number");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Get all unique tags
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    problems.forEach((problem) => {
      problem.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [problems]);

  // Filter and sort problems
  const filteredProblems = useMemo(() => {
    const filtered = problems.filter((problem) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          problem.title.toLowerCase().includes(searchLower) ||
          problem.number.toString().includes(searchLower) ||
          problem.tags.some((tag) => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Difficulty filter
      if (
        selectedDifficulty !== "all" &&
        problem.difficulty !== selectedDifficulty
      )
        return false;

      // Status filter
      if (selectedStatus !== "all" && problem.status !== selectedStatus)
        return false;

      // Tag filter
      if (selectedTag !== "all" && !problem.tags.includes(selectedTag))
        return false;

      return true;
    });

    // Sort problems
    filtered.sort((a, b) => {
      let result = 0;
      switch (selectedSort) {
        case "title":
          result = a.title.localeCompare(b.title);
          break;
        case "difficulty":
          const difficultyOrder: Record<string, number> = {
            Easy: 1,
            Medium: 2,
            Hard: 3,
          };
          result =
            difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          break;
        case "status":
          result = a.status.localeCompare(b.status);
          break;
        case "date":
          if (!a.dateSolved && !b.dateSolved) result = 0;
          else if (!a.dateSolved) result = 1;
          else if (!b.dateSolved) result = -1;
          else
            result =
              new Date(a.dateSolved).getTime() -
              new Date(b.dateSolved).getTime();
          break;
        case "number":
        default:
          result = a.number - b.number;
      }

      // Apply sort direction
      return sortDirection === "asc" ? result : -result;
    });

    return filtered;
  }, [
    problems,
    searchTerm,
    selectedDifficulty,
    selectedStatus,
    selectedTag,
    selectedSort,
    sortDirection,
  ]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Problems</h1>
            <p className="text-muted-foreground">
              Browse and manage your LeetCode problems.
            </p>
          </div>
          <Link href="/add-problem">
            <Button className="flex items-center gap-2 cursor-pointer">
              <PlusCircle className="hidden sm:inline h-4 w-4" />
              <span className="hidden sm:inline">Add Problem</span>
              <span className="inline sm:hidden">Add New</span>
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading Problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Problems</h1>
          <p className="text-muted-foreground">
            Browse and manage your LeetCode problems.
          </p>
        </div>
        <Link href="/add-problem">
          <Button className="flex items-center gap-2">
            <PlusCircle className="hidden sm:inline h-4 w-4" />
            <span className="hidden sm:inline">Add Problem</span>
            <span className="inline sm:hidden">Add New</span>
          </Button>
        </Link>
      </div>

      <ProblemFilters
        onSearchChange={setSearchTerm}
        onDifficultyChange={setSelectedDifficulty}
        onStatusChange={setSelectedStatus}
        onTagChange={setSelectedTag}
        onSortChange={setSelectedSort}
        onSortDirectionChange={setSortDirection}
        selectedDifficulty={selectedDifficulty}
        selectedStatus={selectedStatus}
        selectedTag={selectedTag}
        selectedSort={selectedSort}
        searchTerm={searchTerm}
        availableTags={availableTags}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProblems.length} of {problems.length} problems
        </p>
      </div>

      {/* Problems Grid */}
      {filteredProblems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.number}
              problem={problem}
              onDelete={deleteProblem}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No problems match your current filters.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search criteria or clearing the filters.
          </p>
        </div>
      )}
    </div>
  );
}
