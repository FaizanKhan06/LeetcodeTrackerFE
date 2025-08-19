"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/stats-card";
import { useProblems } from "@/hooks/use-problems";
import { Clock, Target, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { statistics, loading } = useProblems();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your LeetCode problem-solving progress
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your LeetCode problem-solving progress
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Problems"
          value={statistics.total}
          description="Problems in your tracker"
          variant="default"
        />
        <StatsCard
          title="Solved"
          value={statistics.solved}
          total={statistics.total}
          description="Successfully completed"
          variant="success"
          showProgress
        />
        <StatsCard
          title="Reviewing"
          value={statistics.reviewing}
          description="Need more practice"
          variant="warning"
        />
        <StatsCard
          title="To Do"
          value={statistics.todo}
          description="Not started yet"
          variant="destructive"
        />
      </div>

      {/* Difficulty Breakdown */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Easy Problems"
          value={statistics.easySolved}
          total={statistics.easy}
          description={`${statistics.easy} total easy problems`}
          variant="success"
          showProgress
        />
        <StatsCard
          title="Medium Problems"
          value={statistics.mediumSolved}
          total={statistics.medium}
          description={`${statistics.medium} total medium problems`}
          variant="warning"
          showProgress
        />
        <StatsCard
          title="Hard Problems"
          value={statistics.hardSolved}
          total={statistics.hard}
          description={`${statistics.hard} total hard problems`}
          variant="destructive"
          showProgress
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {statistics.recentActivity.length > 0 ? (
              statistics.recentActivity.map((problem) => (
                <div
                  key={problem.number}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{problem.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {problem.dateSolved}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {problem.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No recent activity yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{statistics.solvedPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${statistics.solvedPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {statistics.solved}
                </div>
                <div className="text-xs text-muted-foreground">Solved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.total - statistics.solved}
                </div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>Keep up the great work!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
