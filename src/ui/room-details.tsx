import {
  Maximize,
  BedDouble,
  Users,
  Check,
  DoorOpen,
  Lock,
  LockOpen,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router"
import type { RoomTypeProps } from "./room-type-card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
})

export const formatToINR = (amount: number) => inrFormatter.format(amount)

export default function RoomDetailsSheet() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isOpen = Boolean(searchParams.get("details"))

  function onOpenChange(open: boolean) {
    if (!open) {
      const newParams = new URLSearchParams(searchParams)
      newParams.delete("details")
      setSearchParams(newParams)
    }
  }

  const queryClient = useQueryClient()
  const cachedRooms = queryClient.getQueryData<RoomTypeProps[]>(["room-types"])
  const room =
    cachedRooms?.find((r) => r.roomCode === searchParams.get("details")) || null

  if (!room) return null

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <div className="relative aspect-video w-full shrink-0 bg-muted">
          <img
            src={room.thumbnail}
            alt={room.name}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />

          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <Badge variant={room?.isActive ? "default" : "secondary"}>
              {room.isActive ? (
                <>
                  <LockOpen data-icon="inline-start" /> <span> Active</span>
                </>
              ) : (
                <>
                  <Lock data-icon="inline-start" /> <span> Inactive</span>
                </>
              )}
            </Badge>
          </div>
        </div>

        <ScrollArea className="h-96 px-4 sm:px-6">
          <SheetHeader className="mb-8 p-0 text-left">
            <SheetTitle className="text-xl font-light tracking-tight md:text-2xl lg:text-3xl">
              {room.name}
            </SheetTitle>
            <SheetDescription className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {room.description}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 pb-6">
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-1 rounded-lg border border-border/40 bg-muted/20 p-4 sm:flex-col sm:items-start">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Maximize className="h-4 w-4" />
                  <span className="text-xs font-medium tracking-wider uppercase">
                    Size
                  </span>
                </div>
                <span className="text-base font-medium text-foreground sm:text-lg">
                  {room.size} m²
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 rounded-lg border border-border/40 bg-muted/20 p-4 sm:flex-col sm:items-start">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BedDouble className="h-4 w-4" />
                  <span className="text-xs font-medium tracking-wider uppercase">
                    Bedding
                  </span>
                </div>
                <span className="text-base font-medium text-foreground sm:text-lg">
                  {room.bedCount} {room.bedType}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 rounded-lg border border-border/40 bg-muted/20 p-4 sm:flex-col sm:items-start">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium tracking-wider uppercase">
                    Capacity
                  </span>
                </div>
                <span className="text-base font-medium text-foreground sm:text-lg">
                  {room.maxAdults} {room.maxAdults === 1 ? "Adult" : "Adults"}
                  {room.maxKids > 0 &&
                    `, ${room.maxKids} ${room.maxKids === 1 ? "Child" : "Kids"}`}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 rounded-lg border border-border/40 bg-muted/20 p-4 sm:flex-col sm:items-start">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DoorOpen className="h-4 w-4" />
                  <span className="text-xs font-medium tracking-wider uppercase">
                    Inventory
                  </span>
                </div>
                <span className="text-base font-medium text-foreground sm:text-lg">
                  {room.totalRooms} Rooms
                </span>
              </div>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
                Ideal For
              </h4>
              <p className="text-foreground">{room.idealFor}</p>
            </section>

            <section className="space-y-4">
              <h4 className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
                Premium Amenities
              </h4>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {room.amenities.map((amenity, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-sm text-foreground/80"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-chart-2" />
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </ScrollArea>

        <SheetFooter className="border-t border-border/40 bg-background">
          <div>
            <div>
              <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Base Rate
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-semibold tracking-tight text-foreground">
                  {formatToINR(room.pricePerNight)}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  / night
                </span>
              </div>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
