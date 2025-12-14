"use client"

import { useState } from "react"
import { ScholarshipCard } from "./scholarship-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ScholarshipGridProps {
  grants: any[]
  count: number
}

export function ScholarshipGrid({ grants, count }: ScholarshipGridProps) {
  const [sortBy, setSortBy] = useState("relevance")

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input placeholder="Search by university, scholarship name, or keyword..." className="w-96" />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {grants.some((g) => g.degree_levels?.includes("masters")) && (
            <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm">
              <X className="h-3 w-3" />
              <span>Master's</span>
            </div>
          )}
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="deadline">Deadline</SelectItem>
            <SelectItem value="funding">Funding Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium">1-{Math.min(grants.length, 12)}</span> of{" "}
        <span className="font-medium">{count || grants.length}</span> Scholarships
      </p>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {grants.length > 0 ? (
          grants.map((grant) => <ScholarshipCard key={grant.id} grant={grant} />)
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-lg font-medium">No scholarships found</p>
            <p className="mt-2 text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {grants.length > 0 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="default" size="icon">
            1
          </Button>
          <Button variant="outline" size="icon">
            2
          </Button>
          <Button variant="outline" size="icon">
            3
          </Button>
          <span className="px-2">...</span>
          <Button variant="outline" size="icon">
            12
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function Input({ ...props }) {
  return (
    <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...props} />
  )
}

function Search({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </svg>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  )
}
