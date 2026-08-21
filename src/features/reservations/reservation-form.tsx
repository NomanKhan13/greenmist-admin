import { Controller, useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PropertySelect, RoomTypeSelect } from "./location-select"
import GuestSelector from "./guest-selector"
import { cn } from "@/lib/utils"
import type z from "zod"
import { useEffect } from "react"
import {
  CalendarIcon,
  CircleCheckBig,
  Loader,
  RotateCcw,
  Search,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format, startOfDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  checkRoomAvailability,
  createReservation,
} from "@/lib/reservations-api"
import AddOnsSelector from "./add-ons-selector"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addOnsQueryOptions,
  roomsQueryOptions,
} from "@/hooks/queries/rooms-query-options"
import type {
  ReservationFormValues,
  reservationSchema,
} from "./reservation-schema"
import { customAlphabet } from "nanoid"
import { reservationPriceCalculation } from "./reservation-pricing"
import { toast } from "sonner"

export function distributeGuestsInRoom(
  maxAdults: number,
  maxKids: number,
  adults?: number,
  kids?: number
) {
  if (kids && kids > 0 && maxKids === 0) {
    return null
  }
  if (maxAdults <= 0) return null
  const roomsReqForAdults = Math.ceil((adults || 2) / maxAdults)
  const roomsReqForKids = maxKids > 0 ? Math.ceil((kids || 0) / maxKids) : 0
  console.log(
    `Distributing guests: maxAdults=${maxAdults}, maxKids=${maxKids}, adults=${adults}, kids=${kids}`
  )
  if (roomsReqForKids > (adults || 2)) return null
  return Math.max(roomsReqForAdults, roomsReqForKids)
}

export function ReservationForm({
  isAvailable,
  onAvailable,
}: {
  isAvailable: string
  onAvailable: (newState: "success" | "pending" | "failed" | "idle") => void
}) {
  const { control, watch, handleSubmit, reset } =
    useFormContext<ReservationFormValues>()
  const property = watch("property")
  const roomType = watch("roomType")
  const adults = watch("adults")
  const kids = watch("kids")

  const queryClient = useQueryClient()

  const room = useQuery(roomsQueryOptions()).data?.find(
    (r) => r.slug === roomType
  )
  const { data: addOns } = useQuery(addOnsQueryOptions())
  console.log(`ReservationForm: property=${property}, roomType=${room?.id}`)

  const reservationMutation = useMutation({
    mutationFn: createReservation,
    onSuccess: (data, variables) => {
      // Internal staff-facing toast notification
      console.log(data)
      toast.success("Reservation Logged Successfully", {
        classNames: {
          // 'self-start' forces just the icon to align to the top edge
          // 'mt-1' adds a tiny margin to line it up perfectly with the text baseline
          icon: "self-start mt-1",
        },

        description: (
          <div className="mt-1.5 flex flex-col gap-1 text-sm">
            <p>
              <span className="font-semibold">Guest:</span> {variables.fullName}
            </p>
            <p>
              <span className="font-semibold">Code:</span>{" "}
              {variables.booking_code}
            </p>
            <p>
              <span className="font-semibold">Stay:</span> {variables.numNights}{" "}
              night{variables.numNights > 1 ? "s" : ""}
            </p>
          </div>
        ),
        duration: 8000,
        action: {
          label: "Copy Code",
          onClick: () => {
            navigator.clipboard.writeText(variables.booking_code)
            toast.info("Booking code copied to clipboard")
          },
        },
      })

      queryClient.invalidateQueries({ queryKey: ["reservations"] })
      reset()
    },
    onError: (error) => {
      console.error("Database Insertion Error:", error)

      // Explicit error message giving staff clear next steps
      toast.error("System Error: Booking Failed", {
        description: (
          <div className="mt-1.5 text-sm">
            The system could not write the reservation to the database. Please
            check your network or try again.
          </div>
        ),
        action: {
          label: "Dismiss",
          onClick: () => console.log("Toast dismissed"),
        },
      })
    },
  })

  function onSubmit(data: z.infer<typeof reservationSchema>) {
    const generateBookingCode = customAlphabet(
      "23456789ABCDEFGHJKLMNPQRSTUVWXYZ",
      6
    )
    const booking_code = `GM-${generateBookingCode()}`
    const roomsReq = distributeGuestsInRoom(
      room?.maxAdults,
      room?.maxKids,
      data.adults,
      data.kids
    )

    const mappedAddOns =
      addOns?.filter((addOn) => data.addOns?.includes(addOn.id)) || []

    const { roomTotal, nights, grandTotal, addOnsTotal } =
      reservationPriceCalculation(
        roomsReq || 0,
        room?.pricePerNight || 0,
        mappedAddOns,
        data.dateRange.from,
        data.dateRange.to
      )

    const add_ons =
      addOns?.map((addOn) => ({
        id: addOn.id,
        price: addOn.price,
        isDailyPricing: addOn.isDailyPricing,
      })) || []

    const reservationData = {
      check_in: data.dateRange.from.toISOString(),
      check_out: data.dateRange.to.toISOString(),
      // status is between - "in-house", "completed", "confirmed", "unconfirmed", "checked-out", "cancelled", "no-show"
      status: watch("hasPaid") ? "confirmed" : "unconfirmed",
      numNights: nights,
      property_id: data.property,
      numAdults: data.adults,
      numKids: data.kids,
      roomsCount: roomsReq,
      basePriceAtBooking: roomTotal,
      addOnsAtBooking: addOnsTotal,
      totalPriceAtBooking: grandTotal,
      observations: data.specialRequests,
      isPaid: data.hasPaid,
      booking_code,
      email: data.email,
      fullName: data.fullName,
      room_type_id: room?.id,
      add_ons,
    }
    reservationMutation.mutate(reservationData)
  }

  const isPropertySelected = !!property

  async function checkAvailability() {
    onAvailable("pending")
    if (!isPropertySelected || !watch("roomType") || !watch("dateRange")) {
      alert("Please select a property, room type, and date range first.")
      return
    }
    const availability = await checkRoomAvailability(
      format(watch("dateRange").from, "yyyy-MM-dd"),
      format(watch("dateRange").to, "yyyy-MM-dd"),
      roomType
    )
    const reqRooms = distributeGuestsInRoom(
      room?.maxAdults,
      room?.maxKids,
      Number(adults),
      Number(kids)
    )

    const newState =
      reqRooms !== null
        ? availability >= reqRooms
          ? "success"
          : "failed"
        : "failed"

    console.log(
      `Req rooms: ${reqRooms}, Availability check: ${availability} rooms available, ${reqRooms} rooms required. Result: ${newState}`
    )
    onAvailable(newState)
  }

  useEffect(() => {
    onAvailable("idle")
  }, [
    property,
    watch("roomType"),
    watch("dateRange"),
    watch("adults"),
    watch("kids"),
  ])

  const today = startOfDay(new Date())

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      id="reservation-form"
      className="flex flex-col gap-10"
    >
      {/* --- SECTION 1: STAY DETAILS --- */}
      <FieldSet className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/40">
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Step 1 of 3: Stay Details
          </h2>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => reset()}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-2 h-3 w-3" />
            Clear Form
          </Button>
        </div>

        <FieldGroup>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
            <Controller
              name="property"
              control={control}
              render={({ field, fieldState }) => (
                <PropertySelect field={field} fieldState={fieldState} />
              )}
            />
            <Controller
              name="roomType"
              control={control}
              render={({ field, fieldState }) => (
                <RoomTypeSelect field={field} fieldState={fieldState} />
              )}
            />
            <Controller
              name="dateRange"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Date Picker Range
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={!isPropertySelected}
                        id={field.name}
                        className={`justify-start px-2.5 font-normal ${
                          fieldState.invalid
                            ? "border-destructive text-destructive"
                            : ""
                        }`}
                      >
                        <CalendarIcon />
                        {field.value?.from ? (
                          field.value?.to ? (
                            <>
                              {format(field.value?.from, "LLL dd")} -{" "}
                              {format(field.value?.to, "LLL dd")}
                            </>
                          ) : (
                            format(field.value?.from, "LLL dd")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        defaultMonth={field.value?.from || today}
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < today}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
              )}
            />
            <GuestSelector isPropertySelected={isPropertySelected} />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {/* Shorten the message for better readability and convey the message clearly */}
            {isAvailable === "failed" && (
              <p className="flex-1 text-sm text-destructive">
                No rooms available for the selected dates and guest count 😞.
              </p>
            )}
            {isAvailable === "success" && (
              <p className="flex-1 text-sm text-chart-2">
                Rooms are available! You can proceed to the next step smile 🥳.
              </p>
            )}
            <Button
              type="button"
              disabled={
                !isPropertySelected || !watch("roomType") || !watch("dateRange")
              }
              variant={isAvailable ? "secondary" : "outline"}
              className="w-full transition-all duration-300 md:w-44"
              onClick={checkAvailability}
            >
              {isAvailable === "pending" && (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" /> Checking{" "}
                </>
              )}
              {isAvailable === "success" && (
                <>
                  <CircleCheckBig className="mr-2 h-4 w-4" />
                  Available
                </>
              )}

              {(isAvailable === "failed" || isAvailable === "idle") && (
                <>
                  <Search className="mr-2 h-4 w-4" /> Check Availability
                </>
              )}
            </Button>
          </div>
        </FieldGroup>
      </FieldSet>

      {/* --- SECTION 2: GUEST IDENTITY --- */}
      <FieldSet
        disabled={isAvailable !== "success"}
        className={cn(
          "space-y-4 transition-all duration-500 ease-in-out",
          isAvailable !== "success" && "opacity-40 grayscale-[0.5]"
        )}
      >
        <div className="border-b border-border/40 pb-2">
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Step 2 of 3: Guest Identity
          </h2>
        </div>

        <FieldGroup>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
            {/* import from react-hook-form */}
            <Controller
              name="fullName"
              defaultValue={`John Doe ${Math.floor(Math.random() * 1000)}`}
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="md:col-span-2"
                >
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="John Doe"
                    aria-invalid={fieldState.invalid}
                    {...field}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    type="email"
                    placeholder="john.doe@example.com"
                    aria-invalid={fieldState.invalid}
                    {...field}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                  <Input
                    id={field.name}
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    aria-invalid={fieldState.invalid}
                    {...field}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="nationalIdType"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>National ID type</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue="aadhar-card"
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="aadhar-card">Aadhar Card</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="nationalIdNumber"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    National ID Number
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id={field.name}
                    placeholder="Enter your ID number"
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </FieldSet>

      {/* --- SECTION 3: UPSELLS & REQUESTS --- */}
      <FieldSet
        disabled={isAvailable !== "success"}
        className={cn(
          "space-y-4 transition-all duration-500 ease-in-out",
          isAvailable !== "success" && "opacity-40 grayscale-[0.5]"
        )}
      >
        <div className="border-b border-border/40 pb-2">
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Step 3 of 3: Enhance Your Stay
          </h2>
        </div>

        <FieldGroup className="gap-y-4">
          <AddOnsSelector />

          <Controller
            name="specialRequests"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="pt-4" aria-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Special Requests</FieldLabel>
                <Textarea
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  {...field}
                  placeholder="Add any special requests or comments"
                  className="min-h-24 resize-none"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
