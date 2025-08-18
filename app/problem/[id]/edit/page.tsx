"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { TagInput } from "@/components/tag-input";
import { ApproachForm } from "@/components/approach-form";
import { useProblems } from "@/hooks/use-problems";

interface ProblemFormData {
  number: string;
  title: string;
  link: string;
  difficulty: "Easy" | "Medium" | "Hard" | "";
  tags: string[];
  status: "Solved" | "To Do" | "Reviewing" | "";
  dateSolved: string;
  approaches: Array<{
    title: string;
    description: string;
    code: string;
    language: string;
  }>;
  notes: string;
}

export default function EditProblemPage() {
  const params = useParams();
  const router = useRouter();
  const { getProblem, updateProblem } = useProblems();

  const [problem, setProblem] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProblemFormData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch problem when page loads
  useEffect(() => {
    const fetchProblem = async () => {
      if (params?.id) {
        try {
          const fetchedProblem = await getProblem(params.id as string);
          setProblem(fetchedProblem);

          if (fetchedProblem) {
            setFormData({
              number: String(fetchedProblem.number),
              title: fetchedProblem.title || "",
              link: fetchedProblem.link || "",
              difficulty:
                (fetchedProblem.difficulty as "Easy" | "Medium" | "Hard") || "",
              tags: fetchedProblem.tags || [],
              status:
                (fetchedProblem.status as "Solved" | "To Do" | "Reviewing") ||
                "",
              dateSolved: fetchedProblem.dateSolved || "",
              approaches: fetchedProblem.approaches || [],
              notes: fetchedProblem.notes || "",
            });
          }
        } catch (err) {
          console.error("❌ Error fetching problem:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProblem();
  }, [params?.id, getProblem]);

  const updateFormData = (field: keyof ProblemFormData, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData) return false;
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.link.trim()) newErrors.link = "Link is required";
    if (!formData.difficulty) newErrors.difficulty = "Difficulty is required";
    if (!formData.status) newErrors.status = "Status is required";

    if (formData.link && !formData.link.includes("leetcode.com")) {
      newErrors.link = "Please enter a valid LeetCode URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const updatedProblem = {
        number: Number(formData.number),
        title: formData.title,
        link: formData.link,
        difficulty: formData.difficulty as "Easy" | "Medium" | "Hard",
        tags: formData.tags,
        status: formData.status as "Solved" | "To Do" | "Reviewing",
        dateSolved: formData.dateSolved || undefined,
        approaches: formData.approaches,
        notes: formData.notes,
      };

      await updateProblem(String(params.id), updatedProblem);
      router.push(`/problem/${params.id}`);
    } catch (error) {
      console.error("Error updating problem:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading problem...</div>;
  }

  if (!problem || !formData) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Problem Not Found</h1>
        <Link href="/problems">Back to Problems</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="w-fit">
        <Link
          href={`/problem/${params.id}`}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Problem
        </Link>
      </Button>

      <h1 className="text-3xl font-bold tracking-tight">Edit Problem</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Problem Number</Label>
              <Input value={formData.number} disabled />
            </div>

            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label>LeetCode Link *</Label>
              <Input
                value={formData.link}
                onChange={(e) => updateFormData("link", e.target.value)}
                className={errors.link ? "border-destructive" : ""}
              />
              {errors.link && (
                <p className="text-sm text-destructive mt-1">{errors.link}</p>
              )}
            </div>

            <div>
              <Label>Difficulty *</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => updateFormData("difficulty", value)}
              >
                <SelectTrigger
                  className={errors.difficulty ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              {errors.difficulty && (
                <p className="text-sm text-destructive mt-1">
                  {errors.difficulty}
                </p>
              )}
            </div>

            <TagInput
              tags={formData.tags}
              onTagsChange={(tags) => updateFormData("tags", tags)}
            />
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => updateFormData("status", value)}
              >
                <SelectTrigger
                  className={errors.status ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="Solved">Solved</SelectItem>
                  <SelectItem value="Reviewing">Reviewing</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive mt-1">{errors.status}</p>
              )}
            </div>

            {formData.status === "Solved" && (
              <div>
                <Label>Date Solved</Label>
                <Input
                  type="date"
                  value={formData.dateSolved}
                  onChange={(e) => updateFormData("dateSolved", e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approaches */}
        <Card>
          <CardHeader>
            <CardTitle>Solutions & Approaches</CardTitle>
          </CardHeader>
          <CardContent>
            <ApproachForm
              approaches={formData.approaches}
              onApproachesChange={(approaches) =>
                updateFormData("approaches", approaches)
              }
            />
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes}
              onChange={(e) => updateFormData("notes", e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/problems">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
