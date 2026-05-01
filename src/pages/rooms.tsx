import { useEffect } from "react"
import { QueryClient, useQuery } from "@tanstack/react-query"
import { useSearchParams, type ActionFunctionArgs } from "react-router"
import { toast } from "sonner"
import {
  propertiesQueryOptions,
  roomsQueryOptions,
} from "@/hooks/queries/rooms-query-options"
import { addNewRoomType, updateRoomType } from "@/lib/rooms-api"
import { RoomTypeSchema } from "@/lib/utils"
import { AddRoomSheet } from "@/ui/add-room-sheet"
import { AlertDialogDestructive } from "@/ui/delete-room"
import DuplicateRoomSheet from "@/ui/duplicate-room-sheet"
import EditRoomSheet from "@/ui/edit-room-sheet"
import RoomDetailsSheet from "@/ui/room-details"
import RoomTypeCard, { type RoomTypeProps } from "@/ui/room-type-card"

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

function NoRoomTypes() {
  return (
    <div className="flex min-h-96 items-center justify-center rounded-lg border border-dashed border-border/95 bg-muted/30">
      <div className="text-center">
        <h3 className="font-semibold text-foreground">No rooms yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first room type to get started.
        </p>
      </div>
    </div>
  )
}

export default function Rooms() {
  const [searchParams, setSearchParams] = useSearchParams()

  const { data: roomTypes } = useQuery(roomsQueryOptions())
  const { data: properties } = useQuery(propertiesQueryOptions())

  const propertyDropDown = properties?.map((property: PropertyProps) => ({
    name: property.name,
    id: property.id,
  }))

  const isEditing = Boolean(searchParams.get("edit"))
  const isDuplicating = Boolean(searchParams.get("duplicate"))
  const isDeleting = Boolean(searchParams.get("delete"))
  const isRoomDetailsOpen = Boolean(searchParams.get("details"))

  const hasUrlConflict =
    (isEditing && (isRoomDetailsOpen || isDuplicating || isDeleting)) ||
    (isRoomDetailsOpen && (isEditing || isDuplicating || isDeleting)) ||
    (isDuplicating && (isEditing || isRoomDetailsOpen || isDeleting)) ||
    (isDeleting && (isEditing || isRoomDetailsOpen || isDuplicating))

  function toaster(type: "success" | "error" | "warning", message: string) {
    toast[type](message, {
      style: {
        "--normal-bg": "var(--card)",
        "--normal-text":
          "light-dark(var(--color-emerald-400), var(--color-emerald-400))",
        "--normal-border":
          "light-dark(var(--color-emerald-400), var(--color-emerald-400))",
      } as React.CSSProperties,
    })
  }

  const roomTypesCards = roomTypes?.map((roomType: RoomTypeProps) => (
    <RoomTypeCard key={roomType.id} roomDetails={roomType} />
  ))

  useEffect(() => {
    if (hasUrlConflict) {
      const newParams = new URLSearchParams(searchParams)
      newParams.delete("edit")
      newParams.delete("duplicate")
      newParams.delete("delete")
      newParams.delete("details")
      setSearchParams(newParams, { replace: true })
    }
  }, [hasUrlConflict])

  return (
    <div className="mx-auto w-full max-w-5xl rounded-md p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Rooms Category</h2>
        <AddRoomSheet propertyDropDown={propertyDropDown} toaster={toaster} />
      </div>

      {roomTypes?.length === 0 ? (
        <NoRoomTypes />
      ) : (
        <section className="space-y-6">{roomTypesCards}</section>
      )}

      {!hasUrlConflict && (
        <>
          <EditRoomSheet
            propertyDropDown={propertyDropDown}
            toaster={toaster}
          />
          <DuplicateRoomSheet
            propertyDropDown={propertyDropDown}
            toaster={toaster}
          />
          <RoomDetailsSheet />
          <AlertDialogDestructive toaster={toaster} />
        </>
      )}
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
