import { useMemo } from "react"
import { QueryClient, useQuery } from "@tanstack/react-query"
import {
  useNavigation,
  useSearchParams,
  type ActionFunctionArgs,
} from "react-router"

import {
  propertiesQueryOptions,
  roomsQueryOptions,
} from "@/hooks/queries/rooms-query-options"
import { addNewRoomType, updateRoomType } from "@/lib/rooms-api"
import { RoomTypeSchema } from "@/lib/utils"
import { AddRoomSheet } from "@/features/room-types/add-room-sheet"
import { AlertDialogDestructive } from "@/features/room-types/delete-room"
import DuplicateRoomSheet from "@/features/room-types/duplicate-room-sheet"
import EditRoomSheet from "@/features/room-types/edit-room-sheet"
import RoomDetailsSheet from "@/features/room-types/room-details"
import RoomTypeCard, {
  type RoomTypeProps,
} from "@/features/room-types/room-type-card"
import PropertyFilterTabs from "@/features/room-types/property-filter-tabs"
import ControlBar from "@/features/room-types/controlbar"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

export type PropertyProps = {
  id: string
  name: string
  slug: string
  location: string
  description: string
  thumbnail: string
  isActive: boolean
  highlights: string[]
  title: string
  startFrom: number
}

function NoRoomTypes({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/30 bg-muted/10 px-6 py-12 transition-all">
      <div className="text-center">
        <h3 className="text-lg font-medium tracking-tight text-foreground">
          No rooms found
        </h3>
        <p className="my-4 max-w-sm text-sm text-balance text-muted-foreground">
          Adjust your property filters or create a new room type blueprint to
          get started.
        </p>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCcw />
          Refresh
        </Button>
      </div>
    </div>
  )
}

export const CONFLICTING_URL_PARAMS = [
  "edit",
  "duplicate",
  "delete",
  "details",
] as const

export const PROPERTY_FILTERS = [
  "all",
  "greenmist-tea-garden-retreat",
  "greenmist-hill-retreat",
  "greenmist-valley-retreat",
] as const

export const CATEGORIES = [
  "All",
  "Standard",
  "Deluxe",
  "Suite",
  "Villa",
] as const

export const STATUS = ["All", "active", "inactive"] as const

export const SORT_OPTIONS = [
  { name: "Default", value: "default" },
  { name: "Name (A - Z)", value: "name-asc" },
  { name: "Name (Z - A)", value: "name-desc" },
  { name: "Price (Low to High)", value: "price-asc" },
  { name: "Price (High to Low)", value: "price-desc" },
  { name: "Capacity", value: "capacity" },
] as const

export default function Rooms() {
  const navigation = useNavigation()
  const isLoading = navigation.state === "loading"

  const [searchParams, setSearchParams] = useSearchParams()
  const currentPropertyId =
    PROPERTY_FILTERS.find((prop) => prop === searchParams.get("property")) ||
    PROPERTY_FILTERS[0]
  const searchTerm = searchParams.get("q")?.trim().toLocaleLowerCase()
  const categoryFilter =
    CATEGORIES.find(
      (cat) => cat === searchParams.get("category")
    )?.toLocaleLowerCase() || CATEGORIES[0]?.toLocaleLowerCase()
  const statusFilter =
    STATUS.find((status) => status === searchParams.get("status")) || STATUS[0]
  const sortOption =
    SORT_OPTIONS.find((sort) => sort.value === searchParams.get("sort"))
      ?.value || SORT_OPTIONS[0].value

  const { data: roomTypes } = useQuery(roomsQueryOptions())
  const { data: properties } = useQuery(propertiesQueryOptions())

  const filteredRoomTypes = useMemo(() => {
    if (!roomTypes) return []
    let roomTypesCopy = [...roomTypes]

    roomTypesCopy =
      currentPropertyId === "all"
        ? roomTypesCopy
        : roomTypesCopy.filter((room) => {
            const property = room.properties as unknown as { slug: string }
            return property?.slug === currentPropertyId
          })

    roomTypesCopy =
      categoryFilter === "all"
        ? roomTypesCopy
        : roomTypesCopy.filter(
            (room) => room.category.toLocaleLowerCase() === categoryFilter
          )

    roomTypesCopy =
      statusFilter === "active"
        ? roomTypesCopy.filter((room) => room.isActive)
        : statusFilter === "inactive"
          ? roomTypesCopy.filter((room) => !room.isActive)
          : roomTypesCopy

    roomTypesCopy = roomTypesCopy.sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "price-asc":
          return a.pricePerNight - b.pricePerNight
        case "price-desc":
          return b.pricePerNight - a.pricePerNight
        case "capacity":
          return b.maxAdults - a.maxAdults
        default:
          return 0
      }
    })

    roomTypesCopy = !searchTerm
      ? roomTypesCopy
      : roomTypesCopy.filter((room) =>
          room.name.toLocaleLowerCase().includes(searchTerm)
        )

    return roomTypesCopy
  }, [
    roomTypes,
    currentPropertyId,
    searchTerm,
    categoryFilter,
    statusFilter,
    sortOption,
  ])

  const propertyDropDown = useMemo(() => {
    return properties?.map((property: PropertyProps) => ({
      name: property.name,
      id: property.id,
    }))
  }, [properties])

  const activeConflictParams = CONFLICTING_URL_PARAMS.filter((param) =>
    searchParams.has(param)
  )
  const activeAction = activeConflictParams.at(0) || null

  const roomTypesCards = filteredRoomTypes?.map((roomType: RoomTypeProps) => (
    <RoomTypeCard key={roomType.id} roomDetails={roomType} />
  ))

  const refreshSearchParams = () => setSearchParams({})

  return (
    <div className="@container mx-auto w-full max-w-5xl rounded-md p-4 sm:p-6">
      {/* Top Row: Page Context and Primary Action */}
      <header className="mb-6 flex flex-col gap-5 border-b border-border/75 pb-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Rooms Inventory
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Manage room specifications, capacity, and pricing across
              properties.
            </p>
          </div>
          <AddRoomSheet propertyDropDown={propertyDropDown} />
        </div>

        {/* Second Row: The Segmented Control Filter */}
        <PropertyFilterTabs properties={properties || []} />
        <ControlBar />
      </header>

      {/* Dashboard Grid Data Presentation */}
      {filteredRoomTypes?.length === 0 ? (
        <NoRoomTypes onRefresh={refreshSearchParams} />
      ) : (
        <section className="space-y-6">{roomTypesCards}</section>
      )}

      <EditRoomSheet
        propertyDropDown={propertyDropDown}
        isOpen={activeAction === "edit"}
      />
      <DuplicateRoomSheet
        propertyDropDown={propertyDropDown}
        isOpen={activeAction === "duplicate"}
      />
      <RoomDetailsSheet isOpen={activeAction === "details"} />
      <AlertDialogDestructive isOpen={activeAction === "delete"} />
    </div>
  )
}

export async function loader(queryClient: QueryClient) {
  await Promise.all([
    queryClient.ensureQueryData(roomsQueryOptions()),
    queryClient.ensureQueryData(propertiesQueryOptions()),
  ])
  return null
}

export const addRoomTypeAction =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const actionIntent = formData.get("_intent")
    const roomId = formData.get("id") as string | null

    const rawData = Object.fromEntries(formData)
    const validation = RoomTypeSchema.safeParse(rawData)

    if (!validation.success) {
      const errorMessage = validation.error.issues
      return {
        error: errorMessage.at(0)?.message || "Please check your inputs.",
      }
    }

    const roomTypeData = validation.data

    try {
      if (actionIntent === "update-room" && roomId) {
        await updateRoomType(roomTypeData, roomId)
      } else {
        await addNewRoomType(roomTypeData)
      }
      await queryClient.invalidateQueries({ queryKey: ["room-types"] })
      return { success: true }
    } catch (error) {
      console.log("Error in action function: ", error)
      return { error }
    }
  }
