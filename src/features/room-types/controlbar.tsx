import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useDebounce from "@/hooks/use-debounce"
import { CATEGORIES, SORT_OPTIONS, STATUS } from "@/pages/rooms"
import { Search, ArrowDownUp, SlidersHorizontal, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"

export default function ControlBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [localQuery, setLocalQuery] = useState(initialQuery)

  const category =
    CATEGORIES.find((cat) => cat === searchParams.get("category")) || ""
  const status = STATUS.find((s) => s === searchParams.get("status")) || ""
  const sort =
    SORT_OPTIONS.find((sort) => sort.value === searchParams.get("sort"))
      ?.value || ""
  console.log("Value of category when params cleared", category)

  function updateControls(type: "category" | "status" | "sort", value: string) {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev)
        if (!value || value === "All" || value === "default")
          newParams.delete(type)
        else newParams.set(type, value)
        return newParams
      },
      { replace: true }
    )
  }

  const updateSearchParams = useDebounce((searchTerm: string) => {
    const q = searchTerm?.trim()
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev)
        if (!q) newParams.delete("q")
        else newParams.set("q", q)
        return newParams
      },
      { replace: true }
    )
  }, 300)

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setLocalQuery(value)
    updateSearchParams(value)
  }
  const hasActiveFilters =
    searchParams.has("q") ||
    searchParams.has("category") ||
    searchParams.has("status") ||
    searchParams.has("sort")

  const handleResetFilters = () => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev)
        newParams.delete("q")
        newParams.delete("category")
        newParams.delete("status")
        newParams.delete("sort")
        return newParams
      },
      { replace: true }
    )

    setLocalQuery("")
  }

  useEffect(() => {
    const currentQuery = searchParams.get("q") || ""
    setLocalQuery(currentQuery)
  }, [searchParams])

  return (
    <div className="flex w-full flex-col flex-wrap gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full items-center gap-3 sm:w-auto">
        <InputGroup className="w-full shrink-0 sm:w-72">
          <InputGroupInput
            id="input-room-type-search"
            placeholder="Search room types..."
            value={localQuery}
            onChange={onSearch}
            className="h-9 bg-muted/10 text-xs shadow-none focus-visible:ring-1 focus-visible:ring-primary/50"
          />
          <InputGroupAddon align="inline-end">
            <Search className="h-4 w-4 text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleResetFilters}
            className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Reset
            <X className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div
        className="flex w-full items-center gap-3 overflow-x-auto pb-1 sm:w-auto sm:overflow-visible [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <Select
          value={category}
          onValueChange={(newValue) => updateControls("category", newValue)}
        >
          <SelectTrigger className="h-9 w-36 shrink-0 bg-muted/10 text-xs shadow-none">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>

              {CATEGORIES.map((cat, idx) => (
                <SelectItem key={`${cat}-${idx}`} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(newValue) => updateControls("status", newValue)}
        >
          <SelectTrigger className="h-9 w-34 shrink-0 bg-muted/10 text-xs capitalize shadow-none">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>

              {STATUS.map((status, idx) => (
                <SelectItem
                  key={`${status}-${idx}`}
                  value={status}
                  className="capitalize"
                >
                  {status === "All" ? "All Statuses" : status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="mx-1 hidden h-5 w-px shrink-0 bg-border/75 sm:block"></div>

        <Select
          value={sort}
          onValueChange={(newValue) => updateControls("sort", newValue)}
        >
          <SelectTrigger className="h-9 w-42 shrink-0 text-xs shadow-none">
            <div className="flex items-center gap-2">
              <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Sort" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort</SelectLabel>

              {SORT_OPTIONS.map((option, idx) => (
                <SelectItem key={`${option.value}-${idx}`} value={option.value}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
