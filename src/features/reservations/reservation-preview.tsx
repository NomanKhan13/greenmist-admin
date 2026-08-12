import { BedDouble, Calendar, Users } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import {
  addOnsQueryOptions,
  propertiesQueryOptions,
  roomsQueryOptions,
} from "@/hooks/queries/rooms-query-options"
import { format } from "date-fns"
import { useFormContext, useWatch } from "react-hook-form"
import { reservationPriceCalculation } from "./reservation-pricing"
import type { ReservationFormValues } from "./reservation-schema"
import { inrFormatter } from "../room-types/room-details"
import { useMemo } from "react"
import { distributeGuestsInRoom } from "./reservation-form"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_IMG_URL

export function ReservationPreview({
  isAvailable,
}: {
  isAvailable: "idle" | "pending" | "success" | "failed"
}) {
  // Tanstack query
  const { data: properties } = useQuery(propertiesQueryOptions())
  const { data: roomTypes } = useQuery(roomsQueryOptions())
  const { data: addOns } = useQuery(addOnsQueryOptions())

  // React Hook Form
  const { control, setValue } = useFormContext<ReservationFormValues>()
  const formValues = useWatch({ control })

  function toggleHasPaid(newPaidState: boolean) {
    setValue("hasPaid", newPaidState, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  // Idle or pending states
  if (isAvailable === "idle") return <ReservationPreviewEmpty />
  if (isAvailable === "pending") return <ReservationPreviewSkeleton />

  const { mappedProperty, mappedRoomType, mappedAddOns } = {
    mappedProperty: properties?.find((p) => p.id === formValues.property),
    mappedRoomType: roomTypes?.find((r) => r.slug === formValues.roomType),
    mappedAddOns:
      addOns?.filter((addOn) => formValues.addOns?.includes(addOn.id)) || [],
  }

  const roomsReq = distributeGuestsInRoom(
    mappedRoomType?.maxAdults,
    mappedRoomType?.maxKids,
    formValues.adults,
    formValues.kids
  )
  console.log(roomsReq)

  const { roomTotal, taxAmount, grandTotal, nights } =
    reservationPriceCalculation(
      roomsReq || 0,
      mappedRoomType?.pricePerNight || 0,
      mappedAddOns,
      formValues?.dateRange?.from,
      formValues?.dateRange?.to
    )
  // Only calc data if availability check is successful
  // Why memoize it? - mapped props won't change unless the form values change, so we can avoid unnecessary recalculations and re-renders.

  /*
  const { mappedProperty, mappedRoomType, mappedAddOns } = useMemo(() => {
    return {
      mappedProperty: properties?.find((p) => p.id === formValues.property),
      mappedRoomType: roomTypes?.find((r) => r.slug === formValues.roomType),
      mappedAddOns:
        addOns?.filter((addOn) => formValues.addOns?.includes(addOn.id)) || [],
    }
  }, [
    properties,
    roomTypes,
    addOns,
    formValues.property,
    formValues.roomType,
    formValues.addOns,
  ])
  // Why memoize it? - this is maths, and it won't change unless args change.
  const { roomTotal, taxAmount, grandTotal, nights } = useMemo(() => {
    return reservationPriceCalculation(
      mappedRoomType?.pricePerNight || 0,
      mappedAddOns,
      formValues?.dateRange?.from,
      formValues?.dateRange?.to
    )
  }, [mappedRoomType?.pricePerNight, mappedAddOns, formValues?.dateRange])
*/

  // Life saver - useMemo
  // Why? - Becuase we are looking for live form updates and we don't want to change fields which aren't being updated. So we need to memoize the values and only update the ones that are changing.

  return (
    <Card className="overflow-hidden border-border/50 bg-card/40 p-0 shadow-xl backdrop-blur-sm">
      {/* HERO SECTION */}
      <PreviewHero
        propertyName={mappedProperty?.name}
        propertyImage={mappedProperty?.thumbnail}
        roomType={mappedRoomType?.name}
      />

      <CardContent className="space-y-5 p-5">
        {/* BOOKING DETAILS */}
        <PreviewBookingDetails
          dateFrom={formValues.dateRange?.from}
          dateTo={formValues.dateRange?.to}
          nights={nights}
          adults={formValues.adults || 2}
          kids={formValues.kids || 0}
          roomsReq={roomsReq || 0}
        />

        <Separator className="opacity-50" />

        {/* GUEST INFO */}
        <PreviewGuestInfo
          fullName={formValues.fullName}
          email={formValues.email}
          phoneNumber={formValues.phoneNumber}
          nationalIdType={formValues.nationalIdType}
          nationalIdNumber={formValues.nationalIdNumber}
        />
        <Separator className="opacity-50" />

        {/* FINANCIALS */}
        <PreviewFinancials
          roomPricePerNight={mappedRoomType?.pricePerNight}
          nights={nights}
          addOns={mappedAddOns}
          taxAmount={taxAmount}
          roomTotal={roomTotal}
          roomsReq={roomsReq || 0}
        />
      </CardContent>

      {/* TOTAL AND ACTIONS BLOCK */}
      <CardFooter className="flex flex-col items-stretch gap-6 border-t border-border/50 bg-muted/10 p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-foreground uppercase">
              Grand Total
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Includes all taxes
            </p>
          </div>
          <p className="font-serif text-2xl tracking-tight text-primary-foreground">
            {inrFormatter.format(grandTotal)}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-4 border-t border-border/30 pt-2">
          <div className="flex items-center space-x-3">
            <Checkbox
              name="hasPaid"
              id="hasPaid"
              onCheckedChange={(checked) => toggleHasPaid(checked as boolean)}
              className="border-muted-foreground/50 data-[state=checked]:border-accent data-[state=checked]:bg-accent"
            />
            <label
              htmlFor="hasPaid"
              className="text-sm leading-none font-medium text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Guest has paid the full amount
            </label>
          </div>

          <Button
            className="w-full font-medium tracking-wide"
            size="lg"
            type="submit"
            form="reservation-form"
          >
            Create Reservation
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export function PreviewHero({
  propertyName,
  propertyImage,
  roomType,
}: {
  propertyName: string | undefined
  propertyImage: string | undefined
  roomType: string | undefined
}) {
  return (
    <div className="relative h-48 w-full bg-muted">
      <img
        src={`${SUPABASE_URL}/property-images/${propertyImage}`}
        alt={propertyName || "Property Image"}
        className="h-full w-full object-cover grayscale-[0.2]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />

      <div className="absolute right-5 bottom-4 left-5">
        <p className="mb-0.5 text-xs font-bold tracking-widest text-emerald-500 uppercase">
          {propertyName || "Select Property"}
        </p>
        <h3 className="font-serif text-xl tracking-wide text-foreground">
          {roomType || "Select Room Type"}
        </h3>
      </div>
    </div>
  )
}

export function PreviewBookingDetails({
  dateFrom,
  dateTo,
  nights,
  adults,
  kids,
  roomsReq,
}: {
  dateFrom: Date | undefined
  dateTo: Date | undefined
  nights: number
  adults: number
  kids: number
  roomsReq: number
}) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
        Booking Details
      </h4>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-2 h-3.5 w-3.5 opacity-70" />
            Dates
          </div>
          <div className="text-right text-xs">
            <span className="font-medium text-foreground">
              {dateFrom ? format(new Date(dateFrom), "MMM d") : "—"} —{" "}
              {dateTo ? format(new Date(dateTo), "MMM d, yyyy") : "—"}
            </span>
            <span className="ml-1 text-muted-foreground">
              ({nights} {nights === 1 ? "night" : "nights"})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="mr-2 h-3.5 w-3.5 opacity-70" />
            Guests
          </div>
          <div className="text-right text-xs">
            <span className="font-medium text-foreground">
              {adults || 1} {(adults || 1) === 1 ? "Adult" : "Adults"}
            </span>
            <span className="ml-1 text-muted-foreground">
              • {kids || 0} {(kids || 0) === 1 ? "Kid" : "Kids"}
            </span>
            <span className="ml-1 text-muted-foreground">
              ({roomsReq} {roomsReq === 1 ? "room" : "rooms"})
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PreviewGuestInfo({
  fullName,
  email,
  phoneNumber,
  nationalIdType,
  nationalIdNumber,
}: {
  fullName: string | undefined
  email: string | undefined
  phoneNumber: string | undefined
  nationalIdType: string | undefined
  nationalIdNumber: string | undefined
}) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
        Primary Guest
      </h4>
      <div className="text-xs leading-relaxed">
        {/* Smooth transition from typing to rendered text */}
        <p className="font-medium text-foreground">
          {fullName || (
            <span className="text-muted-foreground/50 italic">
              Awaiting guest name...
            </span>
          )}
        </p>
        {email && <p className="text-muted-foreground">{email}</p>}
        {phoneNumber && <p className="text-muted-foreground">{phoneNumber}</p>}
        {nationalIdType && nationalIdNumber && (
          <p className="text-muted-foreground uppercase">
            {nationalIdType.replace("-", " ")}: {nationalIdNumber}
          </p>
        )}
      </div>
    </div>
  )
}

export function PreviewFinancials({
  roomPricePerNight,
  nights,
  addOns,
  taxAmount,
  roomTotal,
  roomsReq,
}: {
  roomPricePerNight: number
  nights: number
  addOns: any[]
  taxAmount: number
  roomTotal: number
  roomsReq: number
}) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
        Price Breakdown
      </h4>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>
              {inrFormatter.format(roomPricePerNight)} × {nights}
            </span>
            <span>{nights === 1 ? "night" : "nights"}</span>
            <span>
              ({roomsReq} {roomsReq === 1 ? "room" : "rooms"})
            </span>
          </div>
          <span className="font-medium text-foreground">
            {inrFormatter.format(roomTotal)}
          </span>
        </div>

        <div className="pt-1 pb-0.5">
          <span className="text-[9px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Add-ons
          </span>
        </div>

        {addOns.length > 0 ? (
          addOns.map((addOn) => {
            const itemTotal = addOn.isDailyPricing
              ? addOn.price * nights
              : addOn.price
            return (
              <div
                key={addOn.id}
                className="flex justify-between border-l-2 border-border/40 pl-2"
              >
                <span className="text-muted-foreground">{addOn.name}</span>
                <span className="font-medium text-muted-foreground">
                  {inrFormatter.format(itemTotal)}
                </span>
              </div>
            )
          })
        ) : (
          <p className="flex justify-between border-l-2 border-border/40 pl-2 text-muted-foreground">
            No add-ons selected
          </p>
        )}

        <div className="flex justify-between pt-2">
          <span className="text-muted-foreground">Taxes & Fees (18%)</span>
          <span className="font-medium text-foreground">
            {inrFormatter.format(taxAmount)}
          </span>
        </div>
      </div>
    </div>
  )
}

export function ReservationPreviewSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50 bg-card/40 p-0 shadow-xl backdrop-blur-sm">
      {/* HERO SECTION SKELETON */}

      <div className="relative h-48 w-full bg-muted">
        <Skeleton className="h-full w-full rounded-none" />

        {/* Hero Text Overlays */}

        <div className="absolute right-5 bottom-4 left-5 space-y-2">
          {/* Property Name Placeholder */}

          <Skeleton className="h-3 w-32 bg-emerald-500/20" />

          {/* Room Type Placeholder */}

          <Skeleton className="h-6 w-48 bg-white/20" />
        </div>
      </div>

      {/* COMPACTED CONTENT */}

      <CardContent className="space-y-5 p-5">
        {/* BOOKING DETAILS SKELETON */}

        <div>
          <Skeleton className="mb-3 h-3 w-28" />

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3.5 w-3.5" />

                <Skeleton className="h-3 w-12" />
              </div>

              <Skeleton className="h-3 w-40" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3.5 w-3.5" />

                <Skeleton className="h-3 w-16" />
              </div>

              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* GUEST INFO SKELETON */}

        <div>
          <Skeleton className="mb-3 h-3 w-28" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />

            <Skeleton className="h-3 w-48" />

            <Skeleton className="h-3 w-32" />

            <Skeleton className="h-3 w-40" />
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* FINANCIALS SKELETON */}

        <div>
          <Skeleton className="mb-3 h-3 w-32" />

          <div className="space-y-3">
            {/* Base Price */}

            <div className="flex justify-between">
              <Skeleton className="h-3 w-36" />

              <Skeleton className="h-3 w-16" />
            </div>

            {/* Add-ons Header */}

            <div className="pt-1 pb-0.5">
              <Skeleton className="h-2 w-16" />
            </div>

            {/* Add-ons List */}

            <div className="space-y-2 border-l-2 border-border/40 pl-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-32" />

                <Skeleton className="h-3 w-12" />
              </div>

              <div className="flex justify-between">
                <Skeleton className="h-3 w-40" />

                <Skeleton className="h-3 w-14" />
              </div>

              <div className="flex justify-between">
                <Skeleton className="h-3 w-36" />

                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            {/* Taxes */}

            <div className="flex justify-between pt-1">
              <Skeleton className="h-3 w-28" />

              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </CardContent>

      {/* TOTAL BLOCK SKELETON */}

      <CardFooter className="flex flex-col items-stretch border-t border-border/50 bg-muted/10 p-5">
        <div className="flex items-end justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-24" />

            <Skeleton className="h-2 w-32" />
          </div>

          <Skeleton className="h-8 w-28" />
        </div>
      </CardFooter>
    </Card>
  )
}

export function ReservationPreviewEmpty() {
  return (
    <Card className="flex h-full min-h-150 flex-col items-center justify-center border-dashed border-border/40 bg-card/10 text-center shadow-none backdrop-blur-sm">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/20">
        <BedDouble className="h-8 w-8 stroke-[1.5] text-muted-foreground/40" />
      </div>

      <h3 className="mt-6 font-serif text-xl tracking-wide text-foreground/80">
        Awaiting Stay Details
      </h3>

      <p className="mt-3 max-w-65 text-sm leading-relaxed text-muted-foreground/80">
        Select a property, room type, and dates on the left. Check availability
        to generate the guest's reservation summary.
      </p>
    </Card>
  )
}
