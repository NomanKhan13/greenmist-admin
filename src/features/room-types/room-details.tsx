import { useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Maximize,
  BedDouble,
  Check,
  AlertCircle,
  Users,
  House,
  Sparkles,
} from "lucide-react"

import { CONFLICTING_URL_PARAMS } from "@/pages/rooms"
import type { RoomTypeProps } from "./room-type-card"
import { cn } from "@/lib/utils"
import { useRef } from "react"

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
})

export const formatToINR = (amount: number) => inrFormatter.format(amount)

function RoomNotFound({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <AlertCircle className="h-8 w-8 text-muted-foreground" />
      <div>
        <h3 className="text-lg font-semibold">Room type not found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The details you are looking for do not exist. It might have been
          deleted or the URL might be incorrect.
        </p>
      </div>
      <Button variant="outline" onClick={onClose}>
        Go back to rooms
      </Button>
    </div>
  )
}

export default function RoomDetailsSheet({ isOpen }: { isOpen: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const roomCode = searchParams.get("details")

  const cachedRooms = queryClient.getQueryData<RoomTypeProps[]>(["room-types"])
  const currentRoom = cachedRooms?.find((r) => r.roomCode === roomCode)

  const prevRoomRef = useRef<RoomTypeProps | undefined>(undefined)
  if (currentRoom) prevRoomRef.current = currentRoom

  const room = currentRoom || prevRoomRef.current
  const roomDoesNotExist = isOpen && !room

  function closeSheet() {
    const newParams = new URLSearchParams(searchParams)
    CONFLICTING_URL_PARAMS.forEach((param) => newParams.delete(param))
    setSearchParams(newParams, { replace: true })
  }

  function handleOpenChange(open: boolean) {
    if (!open) closeSheet()
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="overflow-y-auto p-4 sm:p-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/80 [&::-webkit-scrollbar-track]:bg-muted">
        <SheetHeader
          className={cn(
            roomDoesNotExist ? "sr-only" : "mb-4 p-0 pt-8 text-left"
          )}
        >
          <SheetTitle className="text-2xl font-semibold tracking-tight">
            {room?.name || "Room Not Found"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {room
              ? `Specifications and details for ${room.name}`
              : "Error loading room details."}
          </SheetDescription>
        </SheetHeader>

        {roomDoesNotExist && <RoomNotFound onClose={closeSheet} />}

        {!roomDoesNotExist && room && (
          <div className="flex flex-col gap-6 pb-6">
            {/* Image & Status Badge */}
            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-border/50 shadow-sm">
              <img
                src={room.thumbnail}
                alt={room.name}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 top-0 bg-linear-to-b",
                  room.isActive
                    ? "h-16 from-black/40 to-transparent"
                    : "h-full from-black/60 to-black/30"
                )}
              />
              <div className="absolute top-3 right-3">
                <Badge variant={room.isActive ? "default" : "secondary"}>
                  {room.isActive ? "Available" : "Inactive"}
                </Badge>
              </div>
            </div>

            {/* Quantitative Stats Grid */}
            <ul className="grid grid-cols-2 gap-x-4 gap-y-4 border-b border-border/40 pb-5">
              <li className="flex items-center gap-2.5 text-sm text-foreground/90">
                <Maximize className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{room.size} m²</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-foreground/90">
                <BedDouble className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  {room.bedCount} {room.bedType}
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-foreground/90">
                <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  {room.maxAdults} Adults
                  {room.maxKids > 0 && `, ${room.maxKids} Kids`}
                </span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-foreground/90">
                <House className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{room.totalRooms} Inventory</span>
              </li>
            </ul>

            {/* Qualitative Section: Ideal For & Description */}
            <div className="space-y-3">
              {room.idealFor && (
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-chart-2" />
                  <span className="font-medium text-foreground">
                    Ideal for {room.idealFor}
                  </span>
                </div>
              )}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {room.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-4 border-t border-border/40 pt-4">
              <h4 className="text-base font-medium tracking-tight">
                Amenities
              </h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                {(room.amenities || []).map((amenity, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-2.5 w-2.5 text-chart-2" />
                    </div>
                    <span className="leading-tight">{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Base Rate Footer */}
            <div className="mt-2 flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
              <span className="text-sm font-medium text-muted-foreground">
                Base Rate
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold tracking-tight text-foreground">
                  {formatToINR(room.pricePerNight)}
                </span>
                <span className="text-sm text-muted-foreground">/ night</span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
