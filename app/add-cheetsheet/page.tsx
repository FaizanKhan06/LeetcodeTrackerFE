"use client";

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
import { Save, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

interface CheatSheetItem {
  id: string;
  title: string;
  type: "note" | "snippet";
  content: string;
  favourite: boolean;
}

export default function AddCheatsheetPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CheatSheetItem>({
    id: Date.now().toString(),
    title: "",
    type: "note",
    content: "",
    favourite: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      router.push("/cheetsheet"); // back to list page
    } catch (err) {
      console.error(err);
      setFormError("Failed to save cheatsheet. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = <K extends keyof CheatSheetItem>(
    field: K,
    value: CheatSheetItem[K]
    ) => {
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
          <Link href="/cheetsheet" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Cheatsheet
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Cheatsheet</h1>
          <p className="text-muted-foreground">
            Create a new reusable note or snippet
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cheatsheet Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <Label className="mb-2" htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Two Pointers Pattern"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <Label className="mb-2" htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => updateFormData("type", val as CheatSheetItem["type"])}
              >
                <SelectTrigger
                  className={errors.type ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="snippet">Snippet</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive mt-1">{errors.type}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <Label className="mb-2" htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder={
                  formData.type === "note"
                    ? "Write your note here..."
                    : "Paste your code snippet..."
                }
                className={`min-h-[120px] ${
                  formData.type === "snippet" ? "font-mono" : ""
                } ${errors.content ? "border-destructive" : ""}`}
                value={formData.content}
                onChange={(e) => updateFormData("content", e.target.value)}
              />
              {errors.content && (
                <p className="text-sm text-destructive mt-1">
                  {errors.content}
                </p>
              )}
            </div>

            {/* Favourite */}
            <div className="flex items-center gap-2">
              <Label>Favourite:</Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  updateFormData("favourite", !formData.favourite)
                }
              >
                <Star
                  className={`h-6 w-6 ${
                    formData.favourite
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-muted-foreground"
                  }`}
                />
              </Button>
            </div>
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
            {isSubmitting ? "Saving..." : "Save Cheatsheet"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/cheetsheet">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
