import { FormProvider, useForm } from "react-hook-form"
import { ReservationForm } from "./reservation-form"
import { ReservationPreview } from "./reservation-preview"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import PageHeader from "@/ui/page-header"
import {
  reservationSchema,
  type ReservationFormValues,
} from "./reservation-schema"

export default function CreateReservationPage() {
  // use date-fns to set default date range to today and tomorrow, how to do it?
  //
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      property: "",
      roomType: "",
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
      adults: 1,
      kids: 0,
      fullName: `John Doe ${Math.floor(Math.random() * 1000)}`,
      email: `johndoe${Math.floor(Math.random() * 1000)}@example.com`,
      phoneNumber: `+1234567890${Math.floor(Math.random() * 1000)}`,
      nationalIdType: "aadhar-card",
      nationalIdNumber: `A123456789${Math.floor(Math.random() * 1000)}`,
      hasPaid: false,
      specialRequests: `This is a special request for the reservation. Please ensure that the guest's preferences are accommodated. ${Math.floor(Math.random() * 1000)}`,
    },
  })

  const [isAvailable, setIsAvailable] = useState<
    "idle" | "pending" | "success" | "failed"
  >("idle")

  function updateAvailability(
    newState: "idle" | "pending" | "success" | "failed"
  ) {
    setIsAvailable(newState)
  }

  return (
    <FormProvider {...form}>
      <section className="@container mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
        <header className="mb-10 space-y-2">
          <PageHeader
            title="Create Reservation"
            description="Create a new reservation for your guests. Fill in the details below to get started."
          />
        </header>

        <div className="grid items-start gap-8 @3xl:grid-cols-5 @5xl:gap-12">
          <div className="@3xl:col-span-3">
            <ReservationForm
              isAvailable={isAvailable}
              onAvailable={updateAvailability}
            />
          </div>

          <aside className="sticky top-8 @3xl:col-span-2">
            <ReservationPreview isAvailable={isAvailable} />
          </aside>
        </div>
      </section>
    </FormProvider>
  )
}
