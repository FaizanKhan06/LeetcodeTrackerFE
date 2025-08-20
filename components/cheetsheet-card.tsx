"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Star } from "lucide-react";
import { CheatSheet } from "@/lib/cheetsheet-manager";

interface CheatSheetCardProps {
  cheetsheet: CheatSheet;
  onDelete: (id: string) => Promise<boolean>;
  onEdit: (id: string) => Promise<boolean>;
  onFavouriteChange: (id: string) => Promise<boolean>;
}

export function CheetsheetCard({
  cheetsheet,
  onDelete,
  onEdit,
  onFavouriteChange,
}: CheatSheetCardProps) {
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
    if (!cheetsheet._id) return;
    await onDelete(cheetsheet._id);
  };
  const handleEdit = async () => {
    if (!cheetsheet._id) return;
    await onEdit(cheetsheet._id);
  };
  const toggleFavourite = async () => {
    if (!cheetsheet._id) return;
    await onFavouriteChange(cheetsheet._id);
  };

  return (
    <Card key={cheetsheet._id} className="hover:shadow-md transition-shadow gap-0">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          {/* Left Side: Title & Badge */}
          <div className="space-y-1">
            <CardTitle className="text-lg">{cheetsheet.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getTypeColor(cheetsheet.type)}>
                {cheetsheet.type}
              </Badge>
            </div>
          </div>

          {/* Right Side: Actions */}
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
            <Button type="button" variant="ghost" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleFavourite}>
              <Star
                className={`h-5 w-5 ${
                  cheetsheet.favourite
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
          <code>{cheetsheet.content}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
