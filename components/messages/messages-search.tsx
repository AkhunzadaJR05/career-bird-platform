"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface MessagesSearchProps {
  onSearchChange: (query: string) => void
}

export function MessagesSearch({ onSearchChange }: MessagesSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearchChange(query)
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Search students or mentors..."
        className="pl-9 w-full"
        value={searchQuery}
        onChange={handleChange}
      />
    </div>
  )
}
