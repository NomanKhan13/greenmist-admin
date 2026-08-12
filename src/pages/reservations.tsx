import { Button } from "@/components/ui/button"
import { columns } from "@/features/reservations/columns"
import { DataTable } from "@/features/reservations/data-table"
import ReservationsControlBar from "@/features/reservations/reservations-controlbar"
import PropertyFilterTabs from "@/features/room-types/property-filter-tabs"
import {
  propertiesQueryOptions,
  reservationQueryOptions,
} from "@/hooks/queries/rooms-query-options"
import PageHeader from "@/ui/page-header"
import { useQuery, type QueryClient } from "@tanstack/react-query"
import { Link } from "react-router"

export type ReservationProp = {
  id: string
  booking_code: string
  fullName: string
  category: string
  observations: string
  check_in: string
  check_out: string
  status: string
  isPaid: boolean
  totalPriceAtBooking: number
  propertyName: string
  createdAt: string
  // add when building booking detail and checkin pages
}

export default function Reservations() {
  const { data: reservations } = useQuery(reservationQueryOptions())
  const { data: properties } = useQuery(propertiesQueryOptions())

  console.log(reservations)
  return (
    <div className="@container mx-auto w-full max-w-5xl rounded-md p-4 sm:p-6">
      <header className="mb-6 flex flex-col gap-5 border-b border-border/75 pb-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <PageHeader
              title="Guest Manifest"
              description="Track upcoming arrivals, departures, and in-house guests across all properties."
            />
          </div>
          <Button asChild>
            <Link to="/reservations/new">New Reservation</Link>
          </Button>
        </div>
        <PropertyFilterTabs properties={properties || []} />
        <ReservationsControlBar />
      </header>
      <DataTable
        columns={columns}
        data={reservations || []}
        properties={properties || []}
      />
    </div>
  )
}

export async function loader(queryClient: QueryClient) {
  await Promise.all([
    queryClient.ensureQueryData(reservationQueryOptions()),
    queryClient.ensureQueryData(propertiesQueryOptions()),
  ])
  return null
}

/*

What field do I need? - Booking code, Guest name, Stay dates (check-in an check-out), Room type, request, Status, Payment status, Total amount, Request

*/
