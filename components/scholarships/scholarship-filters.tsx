"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface ScholarshipFiltersProps {
  grants?: Array<{
    fields_of_study?: string[]
    universities?: {
      country?: string
    }
  }>
}

export function ScholarshipFilters({ grants = [] }: ScholarshipFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [degreeLevels, setDegreeLevels] = useState<string[]>(
    searchParams.get("degree")?.split(",").filter(Boolean) || [],
  )
  const [fields, setFields] = useState<string[]>(searchParams.get("field")?.split(",").filter(Boolean) || [])
  const [countries, setCountries] = useState<string[]>(searchParams.get("country")?.split(",").filter(Boolean) || [])
  const [searchField, setSearchField] = useState("")
  const [availableFields, setAvailableFields] = useState<string[]>([])
  const [availableCountries, setAvailableCountries] = useState<string[]>([])

  // Extract unique fields and countries from grants
  useEffect(() => {
    if (grants.length > 0) {
      // Get unique fields of study
      const allFields = new Set<string>()
      grants.forEach((grant) => {
        grant.fields_of_study?.forEach((field) => allFields.add(field))
      })
      setAvailableFields(Array.from(allFields).sort().slice(0, 20)) // Limit to top 20

      // Get unique countries
      const allCountries = new Set<string>()
      grants.forEach((grant) => {
        if (grant.universities?.country) {
          allCountries.add(grant.universities.country)
        }
      })
      setAvailableCountries(Array.from(allCountries).sort().slice(0, 20)) // Limit to top 20
    }
  }, [grants])

  const degreeOptions = [
    { value: "masters", label: "Master's (MS/MA)" },
    { value: "phd", label: "PhD / Doctorate" },
    { value: "postdoc", label: "Postdoc" },
  ]

  const toggleFilter = (value: string, current: string[], setter: (val: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter((v) => v !== value))
    } else {
      setter([...current, value])
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (degreeLevels.length > 0) params.set("degree", degreeLevels.join(","))
    if (fields.length > 0) params.set("field", fields.join(","))
    if (countries.length > 0) params.set("country", countries.join(","))
    if (searchField) params.set("search", searchField)

    router.push(`/scholarships?${params.toString()}`)
  }

  const clearFilters = () => {
    setDegreeLevels([])
    setFields([])
    setCountries([])
    setSearchField("")
    router.push("/scholarships")
  }

  const hasActiveFilters = degreeLevels.length > 0 || fields.length > 0 || countries.length > 0

  return (
    <aside className="w-80 flex-shrink-0 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by university, scholarship name, or keyword..."
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Degree Level</Label>
            {degreeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`degree-${option.value}`}
                  checked={degreeLevels.includes(option.value)}
                  onCheckedChange={() => toggleFilter(option.value, degreeLevels, setDegreeLevels)}
                />
                <label
                  htmlFor={`degree-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Label>Field of Study</Label>
            {availableFields.length > 0 ? (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {availableFields.map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={`field-${field}`}
                      checked={fields.includes(field)}
                      onCheckedChange={() => toggleFilter(field, fields, setFields)}
                    />
                    <label
                      htmlFor={`field-${field}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {field}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No fields available</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Country</Label>
            {availableCountries.length > 0 ? (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {availableCountries.map((country) => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox
                      id={`country-${country}`}
                      checked={countries.includes(country)}
                      onCheckedChange={() => toggleFilter(country, countries, setCountries)}
                    />
                    <label
                      htmlFor={`country-${country}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {country}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No countries available</p>
            )}
          </div>

          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>
        </CardContent>
      </Card>
    </aside>
  )
}
