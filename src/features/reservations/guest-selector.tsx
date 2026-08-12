import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MinusIcon, PlusIcon, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFormContext } from "react-hook-form"
import { roomsQueryOptions } from "@/hooks/queries/rooms-query-options"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import type { ReservationFormValues } from "./reservation-schema"

export default function GuestSelector({
  isPropertySelected,
}: {
  isPropertySelected: boolean
}) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ReservationFormValues>()
  const roomType = watch("roomType") || null
  const isRoomTypeSelected = Boolean(roomType)

  const room = useQuery(roomsQueryOptions()).data?.find(
    (r) => r.slug === roomType
  )

  const adults = watch("adults") || 2
  const kids = watch("kids") || 0

  const displayText = `${adults} Adult${adults > 1 ? "s" : ""}${
    kids > 0 ? `, ${kids} Kid${kids > 1 ? "s" : ""}` : ""
  }`

  const [warningText, setWarningText] = useState<string | null>(null)

  const adultZodError = errors.adults?.message as string | undefined
  const kidsZodError = errors.kids?.message as string | undefined
  const hasAnyError = Boolean(warningText || adultZodError || kidsZodError)

  const compositeErrors = []
  if (warningText) compositeErrors.push({ message: warningText })
  if (adultZodError) compositeErrors.push({ message: adultZodError })
  if (kidsZodError) compositeErrors.push({ message: kidsZodError })

  function updateCount(type: "adults" | "kids", newValue: number) {
    if (type === "adults" && newValue > 10) {
      setWarningText("Maximum 10 adults allowed")
      return
    }

    if (room?.maxKids === 0 && type === "kids" && newValue > 0) {
      setWarningText(
        `Maximum ${room?.maxAdults} adults and ${room?.maxKids} allowed per room`
      )
      return
    }

    if (type === "kids" && adults < Math.ceil(newValue / room?.maxKids)) {
      setWarningText("Each room must have atleast one adult.")
      return
    }

    if (type === "adults" && newValue < Math.ceil(kids / room?.maxKids)) {
      setWarningText("Each room must have atleast one adult.")
      setValue("kids", newValue, { shouldValidate: true, shouldDirty: true })
      setValue(type, newValue, { shouldValidate: true, shouldDirty: true })
      return
    }

    setWarningText(null)
    setValue(type, newValue, { shouldValidate: true, shouldDirty: true })
  }

  useEffect(() => {
    // Reset guests when room type changes
    setValue("adults", 2, { shouldValidate: true, shouldDirty: true })
    setValue("kids", 0, { shouldValidate: true, shouldDirty: true })
    setWarningText(null)
  }, [roomType])

  return (
    <Field>
      <FieldLabel htmlFor="guest-selector">Guests</FieldLabel>
      <Popover>
        <PopoverTrigger
          asChild
          name="guest-selector"
          aria-invalid={hasAnyError}
        >
          <Button
            id="guest-selector"
            variant="outline"
            disabled={!isPropertySelected || !isRoomTypeSelected}
            role="combobox"
            className={cn(
              "w-full justify-between font-normal",
              !adults && "text-muted-foreground",
              hasAnyError && "border-destructive text-destructive"
            )}
          >
            {displayText}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="flex flex-col gap-6">
            {/* Adults Row */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-sm leading-none font-medium">Adults</span>
                <span className="text-xs text-muted-foreground">
                  Ages 13 or above
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateCount("adults", Math.max(1, adults - 1))}
                  disabled={
                    adults <= 1 || !isPropertySelected || !isRoomTypeSelected
                  }
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="w-4 text-center text-sm font-medium">
                  {adults}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateCount("adults", adults + 1)}
                  disabled={!isPropertySelected || !isRoomTypeSelected}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Kids Row */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-sm leading-none font-medium">Kids</span>
                <span className="text-xs text-muted-foreground">Ages 0-12</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateCount("kids", Math.max(0, kids - 1))}
                  disabled={
                    kids <= 0 || !isPropertySelected || !isRoomTypeSelected
                  }
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="w-4 text-center text-sm font-medium">
                  {kids}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateCount("kids", kids + 1)}
                  disabled={!isPropertySelected || !isRoomTypeSelected}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          {compositeErrors.length > 0 && (
            <div className="mt-6 border-t border-border/40 pt-4">
              <FieldError errors={compositeErrors} />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </Field>
  )
}
