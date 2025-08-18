"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApproachForm } from "@/components/approach-form";
import { TagInput } from "@/components/tag-input";
import { useProblems } from "@/hooks/use-problems";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

export default function AddProblemPage() {
  const router = useRouter();
  const { addProblem } = useProblems();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProblemFormData>({
    number: "",
    title: "",
    link: "",
    difficulty: "",
    tags: [],
    status: "",
    dateSolved: "",
    approaches: [],
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.number.trim())
      newErrors.number = "Problem number is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.link.trim()) newErrors.link = "Link is required";
    if (!formData.difficulty) newErrors.difficulty = "Difficulty is required";
    if (!formData.status) newErrors.status = "Status is required";

    if (
      formData.link &&
      !/^https?:\/\/(www\.)?leetcode\.com\/.+/i.test(formData.link)
    ) {
      newErrors.link = "Please enter a valid LeetCode URL";
    }

    if (formData.number && isNaN(Number(formData.number))) {
      newErrors.number = "Problem number must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const problemData = {
        number: Number(formData.number),
        title: formData.title.trim(),
        link: formData.link.trim(),
        difficulty: formData.difficulty as "Easy" | "Medium" | "Hard",
        tags: formData.tags,
        status: formData.status as "Solved" | "To Do" | "Reviewing",
        dateSolved: formData.dateSolved || undefined,
        approaches: formData.approaches,
        notes: formData.notes,
      };

      // wait for async call so navigation only happens after success
      await addProblem(problemData);
      router.push("/problems");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // extract error message safely
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save problem: Either the problem number already exisits or Try again later";

      // specifically map duplicate problem number errors
      if (/number.*exist/i.test(msg) || /duplicate/i.test(msg)) {
        setErrors((prev) => ({
          ...prev,
          number: "A problem with this number already exists",
        }));
      } else {
        setFormError(msg);
      }

      // console.error("Error saving problem:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFormData = (field: keyof ProblemFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (formError) setFormError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" asChild className="w-fit">
          <Link href="/problems" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Problems
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Problem</h1>
          <p className="text-muted-foreground">
            Add a new LeetCode problem to track
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2" htmlFor="number">
                  Problem Number *
                </Label>
                <Input
                  id="number"
                  placeholder="e.g., 1"
                  value={formData.number}
                  onChange={(e) => updateFormData("number", e.target.value)}
                  className={errors.number ? "border-destructive" : ""}
                  inputMode="numeric"
                />
                {errors.number && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.number}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-2" htmlFor="difficulty">
                  Difficulty *
                </Label>
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
            </div>

            <div>
              <Label className="mb-2" htmlFor="title">
                Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Two Sum"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label className="mb-2" htmlFor="link">
                LeetCode Link *
              </Label>
              <Input
                id="link"
                placeholder="https://leetcode.com/problems/..."
                value={formData.link}
                onChange={(e) => updateFormData("link", e.target.value)}
                className={errors.link ? "border-destructive" : ""}
              />
              {errors.link && (
                <p className="text-sm text-destructive mt-1">{errors.link}</p>
              )}
            </div>

            <TagInput
              tags={formData.tags}
              onTagsChange={(tags) => updateFormData("tags", tags)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status & Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2" htmlFor="status">
                  Status *
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => {
                    updateFormData("status", value);
                    // optionally auto-set date when solved
                    if (
                      (value === "Solved" || value === "Reviewing") &&
                      !formData.dateSolved
                    ) {
                      const today = new Date().toISOString().slice(0, 10);
                      updateFormData("dateSolved", today);
                    }
                  }}
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
                  <p className="text-sm text-destructive mt-1">
                    {errors.status}
                  </p>
                )}
              </div>

              {(formData.status === "Solved" ||
                formData.status === "Reviewing") && (
                <div>
                  <Label className="mb-2" htmlFor="dateSolved">
                    Date Solved
                  </Label>
                  <Input
                    id="dateSolved"
                    type="date"
                    value={formData.dateSolved}
                    onChange={(e) =>
                      updateFormData("dateSolved", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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

        <Card className="gap-2">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any notes, insights, or reminders about this problem..."
              value={formData.notes}
              onChange={(e) => updateFormData("notes", e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {formError && (
          <div className="text-sm text-destructive">{formError}</div>
        )}

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Problem"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/problems">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
