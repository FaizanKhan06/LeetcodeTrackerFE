"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApproachDisplay } from "@/components/approach-display";
import { useProblems } from "@/hooks/use-problems";
import {
  ArrowLeft,
  ExternalLink,
  Edit,
  Calendar,
  Tag,
  Trash2,
} from "lucide-react";

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProblem, deleteProblem } = useProblems();

  // local state for problem
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [problem, setProblem] = useState<any | null>(null);

  const handleDelete = async () => {
    if (!problem?._id) return;

    try {
      const success = await deleteProblem(problem._id);
      if (success) {
        router.push("/problems"); // navigate back to problems list
      }
    } catch (err) {
      console.error("❌ Error deleting problem:", err);
    }
  };

  useEffect(() => {
    const fetchProblem = async () => {
      if (params?.id) {
        try {
          const fetchedProblem = await getProblem(params.id as string);
          setProblem(fetchedProblem);

          if (fetchedProblem) {
            console.log("✅ Retrieved problem:", fetchedProblem);
          } else {
            console.warn("⚠️ Problem not found for id:", params.id);
          }
        } catch (err) {
          console.error("❌ Error fetching problem:", err);
        }
      }
    };

    fetchProblem();
  }, [params?.id, getProblem]);

  if (!problem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/problems" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Problems
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Problem Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The problem you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button asChild>
              <Link href="/problems">View All Problems</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/problems" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Problems
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in LeetCode
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/problem/${problem._id}/edit`}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Problem
            </Link>
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
      </div>

      {/* Problem Overview */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {problem.number}. {problem.title}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
                <Badge className={getStatusColor(problem.status)}>
                  {problem.status}
                </Badge>
              </div>
            </div>

            {/* Tags */}
            {problem.tags?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {problem.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Date Solved */}
            {problem.dateSolved && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Solved on {problem.dateSolved}</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Problem Link */}
      <Card>
        <CardHeader>
          <CardTitle>Problem Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline break-all"
            >
              {problem.link}
            </a>
            <Button variant="ghost" size="sm" asChild>
              <a href={problem.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Approaches */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Solutions & Approaches
        </h2>
        <ApproachDisplay approaches={problem.approaches || []} />
      </div>

      {/* Notes */}
      {problem.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap">{problem.notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Problem Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Problem Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{problem.number}</div>
              <div className="text-xs text-muted-foreground">Problem #</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{problem.difficulty}</div>
              <div className="text-xs text-muted-foreground">Difficulty</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {problem.approaches?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Approaches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {problem.tags?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Tags</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
