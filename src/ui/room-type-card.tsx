import { Maximize, BedDouble, User, House } from "lucide-react"
import { RoomTypeActions } from "./room-type-actions"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type RoomTypeProps = {
  id: string
  name: string
  thumbnail: string
  pricePerNight: number
  description: string
  size: number
  bedCount: number
  bedType: string
  maxAdults: number
  maxKids: number
  totalRooms: number
  slug: string
  idealFor: string
  amenities: string[]
  properties:
    | {
        id: string
      }[]
    | {
        id: string
      }
  isActive: boolean
  roomCode: string
}

export const formatToINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount)
}

export default function RoomTypeCard({
  roomDetails,
}: {
  roomDetails: RoomTypeProps
}) {
  const [showDescription, setShowDescription] = useState(false)

  return (
    <article className="group flex flex-col gap-6 rounded-lg border border-border/40 bg-sidebar p-4 shadow transition-all hover:shadow-md sm:p-6 md:flex-row dark:bg-card/80 dark:hover:bg-card">
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg md:aspect-4/3 md:w-64">
        <img
          // src={`https://proxy.corsfix.com/?${roomDetails.thumbnail}`} replace when pushing to prod
          src={roomDetails.thumbnail}
          alt={`${roomDetails.name} at GreenMist`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <header className="flex items-start justify-between gap-4">
            <div className="flex flex-1 flex-col gap-1.5">
              <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
                {roomDetails.name}
              </h3>

              {/* Mobile Pricing */}
              <div className="flex items-baseline gap-1 md:hidden">
                <span className="text-lg font-semibold tracking-tight text-chart-2">
                  {formatToINR(roomDetails.pricePerNight)}
                </span>
                <span className="text-sm font-normal text-muted-foreground">
                  / night
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-start gap-5">
              <div className="mt-0.5 hidden text-right md:block">
                <span className="text-xl font-semibold tracking-tight text-chart-2">
                  {formatToINR(roomDetails.pricePerNight)}
                </span>
                <span className="ml-1.5 text-sm font-medium text-muted-foreground">
                  / night
                </span>
              </div>

              <RoomTypeActions roomCode={roomDetails.roomCode} />
            </div>
          </header>

          <p
            className={cn(
              "mt-3 w-full text-sm leading-relaxed text-muted-foreground transition-all md:mt-4 md:pr-4",
              !showDescription && "line-clamp-2" // Truncates to 2 lines when false
            )}
          >
            {roomDetails.description}
          </p>
          <Button
            variant="ghost"
            className="mt-1 cursor-pointer p-0 text-xs font-semibold text-foreground hover:bg-transparent! hover:underline"
            onClick={() => setShowDescription((prev) => !prev)}
          >
            {showDescription ? "Show less" : "Show more"}
          </Button>
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-y-3 border-t border-border/40 pt-4 text-sm text-muted-foreground sm:flex sm:flex-wrap sm:gap-x-8">
          <li className="flex items-center gap-2">
            <Maximize className="size-4 shrink-0 opacity-60" />
            <span>{roomDetails.size} m²</span>
          </li>
          <li className="flex items-center gap-2">
            <BedDouble className="size-4 shrink-0 opacity-60" />
            <span>
              {roomDetails.bedCount} {roomDetails.bedType}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <User className="size-4 shrink-0 opacity-60" />
            <span>
              {roomDetails.maxAdults} Adult, {roomDetails.maxKids} Kids
            </span>
          </li>
          <li className="flex items-center gap-2">
            <House className="size-4 shrink-0 opacity-60" />
            <span>Total: {roomDetails.totalRooms} rooms</span>
          </li>
        </ul>
      </div>
    </article>
  )
}
