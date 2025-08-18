"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, X, ArrowUp, ArrowDown } from "lucide-react";

interface ProblemFiltersProps {
  onSearchChange: (search: string) => void;
  onDifficultyChange: (difficulty: string) => void;
  onStatusChange: (status: string) => void;
  onTagChange: (tag: string) => void;
  onSortChange: (sort: string) => void;
  onSortDirectionChange: (direction: "asc" | "desc") => void;
  selectedDifficulty: string;
  selectedStatus: string;
  selectedTag: string;
  selectedSort: string;
  searchTerm: string;
  availableTags: string[];
}

export function ProblemFilters({
  onSearchChange,
  onDifficultyChange,
  onStatusChange,
  onTagChange,
  onSortChange,
  onSortDirectionChange,
  selectedDifficulty,
  selectedStatus,
  selectedTag,
  selectedSort,
  searchTerm,
  availableTags,
}: ProblemFiltersProps) {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSortChange = (sortField: string) => {
    if (sortField === selectedSort) {
      // toggle direction if same field
      const newDir = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newDir);
      onSortDirectionChange(newDir);
    } else {
      // new field: default ascending
      setSortDirection("asc");
      onSortDirectionChange("asc");
      onSortChange(sortField);
    }
  };

  const clearFilters = () => {
    onSearchChange("");
    onDifficultyChange("all");
    onStatusChange("all");
    onTagChange("all");
    onSortChange("number");
    setSortDirection("asc");
    onSortDirectionChange("asc");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedDifficulty !== "all" ||
    selectedStatus !== "all" ||
    selectedTag !== "all";

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-0 items-center">
        <div className="flex flex-wrap gap-4">
          <Label htmlFor="number">Filter:</Label>
          <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Solved">Solved</SelectItem>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="Reviewing">Reviewing</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTag} onValueChange={onTagChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {availableTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2 bg-transparent"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      {/* Sort By */}
      <div className="flex items-center gap-4">
        <Label htmlFor="number">Sort By:</Label>
        <Select value={selectedSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="number">Problem Number</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="difficulty">Difficulty</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="date">Date Solved</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newDir = sortDirection === "asc" ? "desc" : "asc";
            setSortDirection(newDir);
            onSortDirectionChange(newDir);
          }}
        >
          {sortDirection === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
