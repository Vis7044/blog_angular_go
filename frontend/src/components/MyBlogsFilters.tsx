"use client";

import { Filter, RefreshCw, Search } from "lucide-react";

interface MyBlogsFiltersProps {
  allTags?: string[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onReset: () => void;
}

export default function MyBlogsFilters({
  allTags = ["All", "Programming", "Design", "Technology", "Business", "Lifestyle"],
  selectedTag,
  setSelectedTag,
  selectedStatus,
  setSelectedStatus,
  searchQuery,
  setSearchQuery,
  onReset,
}: MyBlogsFiltersProps) {
  const statusOptions = ["All", "Published", "Draft"];

  return (
    <div className="max-w-6xl mx-auto mb-8 bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Header */}
        <div className="flex items-center gap-2 text-gray-700 font-semibold text-base">
          <Filter size={18} />
          <span>Filters</span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          {/* Tag Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">Tag:</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
            >
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="flex cursor-pointer items-center gap-1 text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
