"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, Calendar, Trash2 } from "lucide-react";
import type { Problem } from "@/lib/mock-data";

interface ProblemCardProps {
  problem: Problem;
  onDelete: (id: string) => Promise<boolean>; // callback from parent
}

export function ProblemCard({ problem, onDelete }: ProblemCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Solved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Reviewing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "To Do":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleDelete = async () => {
    if (!problem._id) return;
    await onDelete(problem._id);
  };

  return (
    <Card className="hover:shadow-md transition-shadow gap-0">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {problem.number}. {problem.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
              <Badge className={getStatusColor(problem.status)}>
                {problem.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {problem.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Date Solved */}
        {problem.dateSolved && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Solved on {problem.dateSolved}</span>
          </div>
        )}

        {/* Notes Preview */}
        {problem.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {problem.notes}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button asChild size="sm" variant="outline">
            <Link
              href={`/problem/${problem._id}`}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              LeetCode
            </a>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
