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
import { CATEGORIES } from "@/pages/rooms"
import { Search, ArrowDownUp, SlidersHorizontal, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"

export const RESERVATION_STATUS = [
  { name: "all", label: "All" },
  { name: "in-house", label: "In house" },
  { name: "completed", label: "Completed" },
  { name: "unconfirmed", label: "Unconfirmed" },
  { name: "confirmed", label: "Confirmed" },
  { name: "no-show", label: "No show" },
  { name: "cancelled", label: "Cancelled" },
] as const
export const RESERVATION_SORT_OPTIONS = [
  { name: "Arrival Date (Earliest)", value: "check_in-asc" },
  { name: "Departure Date (Earliest)", value: "check_out-asc" },
  { name: "Newly Booked", value: "createdAt-desc" },
  { name: "Guest Name (A - Z)", value: "guest-asc" },
  { name: "Amount (High to Low)", value: "totalPriceAtBooking-desc" },
] as const

export default function ReservationsControlBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [localQuery, setLocalQuery] = useState(initialQuery)

  const category =
    CATEGORIES.find((cat) => cat === searchParams.get("category")) || ""
  const reservationStatus =
    RESERVATION_STATUS.find((s) => s.name === searchParams.get("status"))
      ?.name || ""
  const sort =
    RESERVATION_SORT_OPTIONS.find(
      (sort) => sort.value === searchParams.get("sort")
    )?.value || ""

  function updateControls(type: "category" | "status" | "sort", value: string) {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev)
        if (!value || value === "All" || value === "all" || value === "default")
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
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      if (category === "All") newParams.delete("category")
      if (reservationStatus === "all") newParams.delete("status")
      return newParams
    })
  }, [searchParams])

  return (
    <div className="flex w-full flex-col flex-wrap gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full items-center gap-3 sm:w-auto">
        <InputGroup className="w-full sm:w-72">
          <InputGroupInput
            id="input-room-type-search"
            placeholder="Filter names or bookings..."
            value={localQuery}
            onChange={onSearch}
            className="h-9 bg-muted/10 text-xs shadow-none"
          />
          <InputGroupAddon align="inline-end">
            <Search className="h-4 w-4 text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleResetFilters}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Reset
            <X className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div
        className="flex w-full items-center gap-3 overflow-x-auto sm:w-auto sm:overflow-visible [&::-webkit-scrollbar]:hidden"
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
          value={reservationStatus}
          onValueChange={(newValue) => updateControls("status", newValue)}
        >
          <SelectTrigger className="h-9 w-34 shrink-0 bg-muted/10 text-xs capitalize shadow-none">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>

              {RESERVATION_STATUS.map((status, idx) => (
                <SelectItem
                  key={`${status}-${idx}`}
                  value={status.name}
                  className="capitalize"
                >
                  {status.label === "All" ? "All Statuses" : status.label}
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
          <SelectTrigger className="h-9 w-52 shrink-0 text-xs shadow-none">
            <div className="flex items-center gap-2">
              <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Sort" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort</SelectLabel>

              {RESERVATION_SORT_OPTIONS.map((option, idx) => (
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
