"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Star, Save} from "lucide-react";
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
import { CheatSheet } from "@/lib/cheatsheet-manager";

interface CheatSheetCardProps {
  cheatsheet: CheatSheet;
  onDelete: (id: string) => Promise<boolean>;
  onEdit: (updated: CheatSheet) => Promise<boolean>;
  onFavouriteChange: (id: string) => Promise<boolean>;
}

export function CheatsheetCard({
  cheatsheet,
  onDelete,
  onEdit,
  onFavouriteChange,
}: CheatSheetCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CheatSheet>(cheatsheet);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTypeColor = (status: string) => {
    switch (status) {
      case "snippet":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "note":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleDelete = async () => {
    if (!cheatsheet._id) return;
    await onDelete(cheatsheet._id);
  };

  const toggleFavourite = async () => {
    if (!cheatsheet._id) return;
    await onFavouriteChange(cheatsheet._id);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onEdit(formData);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = <K extends keyof CheatSheet>(
    field: K,
    value: CheatSheet[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow gap-0">
      {isEditing ? (
        <form onSubmit={handleSave}>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <Label className="mb-2" htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <Label className="mb-2">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(val) =>
                  updateFormData("type", val as CheatSheet["type"])
                }
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
                <p className="text-sm text-destructive">{errors.type}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <Label className="mb-2" htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => updateFormData("content", e.target.value)}
                className={`min-h-[120px] ${
                  formData.type === "snippet" ? "font-mono" : ""
                } ${errors.content ? "border-destructive" : ""}`}
              />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content}</p>
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

            {/* Actions */}
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData(cheatsheet); // reset edits
                  setIsEditing(false);
                }}
              > Cancel
              </Button>
            </div>
          </CardContent>
        </form>
      ) : (
        <>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{cheatsheet.title}</CardTitle>
                <Badge className={getTypeColor(cheatsheet.type)}>
                  {cheatsheet.type}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleFavourite}>
                  <Star
                    className={`h-5 w-5 ${
                      cheatsheet.favourite
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
              <code>{cheatsheet.content}</code>
            </pre>
          </CardContent>
        </>
      )}
    </Card>
  );
}
