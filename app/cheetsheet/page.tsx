"use client";

import { useState, useEffect } from "react";
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
import { CheatSheet } from "@/lib/cheetsheet-manager";
import { CheetsheetCard } from "@/components/cheetsheet-card";

const sampleData: CheatSheet[] = [
    {
        _id: "1",
        title: "Two Pointers Pattern",
        type: "note",
        content: `- Initialize left & right pointers
- Move them based on condition
- Useful for: sorted arrays, palindrome checks, sliding windows`,
        favourite: false,
    },
    {
        _id: "2",
        title: "Binary Search Template",
        type: "snippet",
        content: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
        favourite: true,
    },
    {
        _id: "3",
        title: "Dynamic Programming Reminder",
        type: "note",
        content: `- Define subproblem
- Write recurrence relation
- Identify base cases
- Optimize with memoization/tabulation`,
        favourite: false,
    },
];

export default function CheatsheetPage() {
    const [items, setItems] = useState<CheatSheet[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "note" | "snippet">("all");
    const [filterFav, setFilterFav] = useState<"all" | "favourite">("all");

    // Load from localStorage or fallback to sampleData
    useEffect(() => {
        const stored = localStorage.getItem("cheatsheet");
        if (stored) {
            setItems(JSON.parse(stored));
        } else {
            setItems(sampleData);
        }
    }, []);

    // Define once inside CheatsheetPage component
    const handleFavouriteChange = async (id: string): Promise<boolean> => {
    setItems((prev) =>
        prev.map((i) =>
        i._id === id ? { ...i, favourite: !i.favourite } : i
        )
    );
    return true;
    };


    // Apply search + filters
    const filteredItems = items.filter((item) => {
        const matchesSearch = item.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesType =
            filterType === "all" ? true : item.type === filterType;

        const matchesFav =
            filterFav === "all" ? true : item.favourite;

        return matchesSearch && matchesType && matchesFav;
    });

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
                <Link href="/add-cheetsheet">
                    <Button className="flex items-center gap-2 cursor-pointer">
                        <PlusCircle className="hidden sm:inline h-4 w-4" />
                        <span className="hidden sm:inline">Add Cheatsheet</span>
                        <span className="inline sm:hidden">Add New</span>
                    </Button>
                </Link>
            </div>

            {/* Search + Filter Controls */}
            <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Filters */}
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

            {/* Display all items */}
            <div className="space-y-4">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (

                        <CheetsheetCard
                            key={item._id}
                            cheetsheet={item}
                            onDelete={async (id) => { console.log("Delete", id); return true; }}
                            onEdit={async (id) => { console.log("Edit", id); return true; }}
                            onFavouriteChange={handleFavouriteChange}
                        />

                    ))
                ) : (
                    <p className="text-center text-muted-foreground">
                        No items found for your search/filter.
                    </p>
                )}
            </div>
        </div>
    );
}
