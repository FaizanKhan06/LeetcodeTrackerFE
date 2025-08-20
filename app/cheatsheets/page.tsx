"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { CheatSheet } from "@/lib/cheatsheet-manager";
import { CheatsheetCard } from "@/components/cheatsheet-card";
import { useCheatSheets } from "@/hooks/use-cheatsheets";

export default function CheatsheetPage() {
  const {
    cheatSheets,
    loading,
    deleteCheatSheet,
    updateCheatSheet,
  } = useCheatSheets();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "note" | "snippet">("all");
  const [filterFav, setFilterFav] = useState<"all" | "favourite">("all");

  // --- handlers just call the hook ---
  const handleDelete = async (id: string) => {
    return await deleteCheatSheet(id);
  };

  const handleEdit = async (updated: CheatSheet) => {
    await updateCheatSheet(updated._id, updated);
    return true;
  };

  const handleFavouriteChange = async (id: string) => {
    const cheatSheet = cheatSheets.find((i) => i._id === id);
    if (!cheatSheet) return false;

    await updateCheatSheet(id, { favourite: !cheatSheet.favourite });
    return true;
  };

  // Apply search + filters
  const filteredCheatSheets = cheatSheets.filter((cheatSheet) => {
    const matchesSearch = cheatSheet.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === "all" ? true : cheatSheet.type === filterType;

    const matchesFav =
      filterFav === "all" ? true : cheatSheet.favourite;

    return matchesSearch && matchesType && matchesFav;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cheatsheet</h1>
            <p className="text-muted-foreground">
              Create and manage reusable notes & snippets.
            </p>
          </div>
          <Link href="/add-cheatsheet">
            <Button className="flex items-center gap-2 cursor-pointer">
              <PlusCircle className="hidden sm:inline h-4 w-4" />
              <span className="hidden sm:inline">Add Cheatsheet</span>
              <span className="inline sm:hidden">Add New</span>
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading Cheatsheet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Button */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cheatsheet</h1>
          <p className="text-muted-foreground">
            Create and manage reusable notes & snippets.
          </p>
        </div>
        <Link href="/add-cheatsheet">
          <Button className="flex items-center gap-2 cursor-pointer">
            <PlusCircle className="hidden sm:inline h-4 w-4" />
            <span className="hidden sm:inline">Add Cheatsheet</span>
            <span className="inline sm:hidden">Add New</span>
          </Button>
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Type filter */}
          <div className="flex items-center gap-2">
            <Label>Type:</Label>
            <Select
              value={filterType}
              onValueChange={(val) =>
                setFilterType(val as "all" | "note" | "snippet")
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="note">Notes</SelectItem>
                <SelectItem value="snippet">Snippets</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Favourite filter */}
          <div className="flex items-center gap-2">
            <Label>Favourite:</Label>
            <Select
              value={filterFav}
              onValueChange={(val) =>
                setFilterFav(val as "all" | "favourite")
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by favourite" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="favourite">Favourites</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCheatSheets.length} of {cheatSheets.length} cheatsheets
        </p>
      </div>

      {/* Display list */}
      <div className="space-y-4">
        {filteredCheatSheets.length > 0 ? (
          filteredCheatSheets.map((cheatSheet) => (
            <CheatsheetCard
              key={cheatSheet._id}
              cheatsheet={cheatSheet}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onFavouriteChange={handleFavouriteChange}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No cheatsheets found for your search/filter.
          </p>
        )}
      </div>
    </div>
  );
}
