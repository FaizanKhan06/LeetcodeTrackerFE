"use client";

import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagInput({ tags, onTagsChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
    }
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const commonTags = [
    "Array",
    "String",
    "Hash Table",
    "Two Pointers",
    "Sliding Window",
    "Stack",
    "Queue",
    "Linked List",
    "Binary Tree",
    "DFS",
    "BFS",
    "Recursion",
    "Dynamic Programming",
    "Greedy",
    "Sorting",
    "Binary Search",
    "Heap",
    "Prefix Sum",
    "Backtracking",
    "Hash Map",
    "Hash Set",
    "Graph",
    "Combinations",
    "Permutations",
    "Subsets",
    "Priority Queue",
    "Binary Search Tree",
    "Sliding Window Maximum",
    "2D Array",
    "Doubly Linked List",
    "Maximum Subarray",
    "Minimum Subarray",
    "Shortest Path",
    "Minimum Spanning Tree",
    "Rabin-Karp",
    "Prefix Tree",
    "FIFO",
    "LIFO",
    "Regex",
    "String Matching",
    "Math",
    "Tree Traversal",
  ];

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        placeholder="Type a tag and press Enter or comma..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="mt-3">
        <span className="block text-xs text-muted-foreground mb-2">
          Common tags:
        </span>
        <div className="flex flex-wrap gap-2">
          {commonTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              disabled={tags.includes(tag)}
              className={`
          px-3 py-1 text-xs font-medium rounded-full border
          transition-all duration-150 ease-in-out
          ${
            tags.includes(tag)
              ? "bg-muted text-muted-foreground border-muted cursor-not-allowed"
              : "bg-accent-foreground/10 text-accent-foreground border-accent-foreground hover:bg-accent-foreground/20 hover:text-accent-foreground"
          }
        `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
