"use client";
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
import { Trash2, Plus } from "lucide-react";

interface Approach {
  title: string;
  description: string;
  code: string;
  language: string;
}

interface ApproachFormProps {
  approaches: Approach[];
  onApproachesChange: (approaches: Approach[]) => void;
}

const programmingLanguages = [
  "python",
  "javascript",
  "java",
  "cpp",
  "c",
  "csharp",
  "go",
  "rust",
  "typescript",
  "swift",
  "kotlin",
  "ruby",
  "php",
  "scala",
];

export function ApproachForm({
  approaches,
  onApproachesChange,
}: ApproachFormProps) {
  const addApproach = () => {
    onApproachesChange([
      ...approaches,
      { title: "", description: "", code: "", language: "python" },
    ]);
  };

  const removeApproach = (index: number) => {
    onApproachesChange(approaches.filter((_, i) => i !== index));
  };

  const updateApproach = (
    index: number,
    field: keyof Approach,
    value: string
  ) => {
    const updated = approaches.map((approach, i) =>
      i === index ? { ...approach, [field]: value } : approach
    );
    onApproachesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Approaches</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addApproach}
          className="flex items-center gap-2 bg-transparent"
        >
          <Plus className="h-4 w-4" />
          Add Approach
        </Button>
      </div>

      {approaches.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No approaches added yet. Click "Add Approach" to get started.
        </p>
      )}

      {approaches.map((approach, index) => (
        <Card key={index} className="gap-0">
          <CardHeader className="">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Approach {index + 1}</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeApproach(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <Label className="mb-2" htmlFor={`title-${index}`}>
                Title
              </Label>
              <Input
                id={`title-${index}`}
                placeholder="Enter a title for this approach..."
                value={approach.title}
                onChange={(e) => updateApproach(index, "title", e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <Label className="mb-2" htmlFor={`description-${index}`}>
                Description
              </Label>
              <Textarea
                id={`description-${index}`}
                placeholder="Detailed explanation of the approach..."
                value={approach.description}
                onChange={(e) =>
                  updateApproach(index, "description", e.target.value)
                }
                className="min-h-[80px]"
              />
            </div>

            {/* Language */}
            <div>
              <Label className="mb-2" htmlFor={`language-${index}`}>
                Programming Language
              </Label>
              <Select
                value={approach.language}
                onValueChange={(value) =>
                  updateApproach(index, "language", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {programmingLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Solution Code */}
            <div>
              <Label className="mb-2" htmlFor={`code-${index}`}>
                Solution Code
              </Label>
              <Textarea
                id={`code-${index}`}
                placeholder="Enter your solution code here..."
                value={approach.code}
                onChange={(e) => updateApproach(index, "code", e.target.value)}
                className="min-h-[120px] font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
