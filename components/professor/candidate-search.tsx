"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Candidate {
  id: string
  rank: number
  name: string
  candidateId: string
  origin: string
  university: string
  gpa: number
  researchInterest: string
  aiMatch: number
  status: string
}

interface CandidateSearchProps {
  candidates: Candidate[]
  onFilteredCandidatesChange?: (filtered: Candidate[]) => void
}

export function CandidateSearch({ candidates, onFilteredCandidatesChange }: CandidateSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) {
      return candidates
    }

    const query = searchQuery.toLowerCase()
    return candidates.filter((candidate) => {
      return (
        candidate.name.toLowerCase().includes(query) ||
        candidate.candidateId.toLowerCase().includes(query) ||
        candidate.origin.toLowerCase().includes(query) ||
        candidate.university.toLowerCase().includes(query) ||
        candidate.researchInterest.toLowerCase().includes(query) ||
        candidate.status.toLowerCase().includes(query)
      )
    })
  }, [candidates, searchQuery])

  // Notify parent of filtered results
  useMemo(() => {
    if (onFilteredCandidatesChange) {
      onFilteredCandidatesChange(filteredCandidates)
    }
  }, [filteredCandidates, onFilteredCandidatesChange])

  return (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search candidates..."
        className="pl-9"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}
