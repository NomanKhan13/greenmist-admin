import type { ReservationProp } from "@/pages/reservations"
import { supabase } from "./supabase"

// convert below data to match the ReservationProp type
type RoomsAndReservations = {
  id: string
  name: string
  description: string
  ideal_for: string
  price_per_night: string
  thumbnail: string
  max_adults: number
  max_kids: number
  is_active: boolean
  slug: string
  size: number
  bed_type: string
  bed_count: number
  total_rooms: number
  rooms_remaining: number
  property_slug: string
  property_id: string
  property_name: string
}

export default async function getReservations(): Promise<ReservationProp[]> {
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      "id, createdAt, booking_code, fullName, observations, check_in, check_out, status, isPaid, totalPriceAtBooking, roomType(category), properties(name)"
    )
    .order("check_in", { ascending: false })

  if (error) {
    console.error("Error", error)
    throw new Error("Facing error while fetching reservations...")
  }

  // Transform the nested Supabase response to match the flat ReservationProp structure
  const formattedReservations: ReservationProp[] = bookings.map(
    (booking: any) => ({
      id: booking.id,
      booking_code: booking.booking_code,
      fullName: booking.fullName,
      // Flatten the nested object safely using optional chaining
      category: booking.roomType?.category || "Uncategorized",
      observations: booking.observations,
      check_in: booking.check_in,
      check_out: booking.check_out,
      status: booking.status,
      isPaid: booking.isPaid,
      totalPriceAtBooking: booking.totalPriceAtBooking,
      propertyName: booking.properties?.name || "GreenMist Retreat",
      createdAt: booking.createdAt,
    })
  )

  return formattedReservations
}

export async function checkRoomAvailability(
  checkIn: string,
  checkOut: string,
  roomSlug: string
) {
  const cleanCheckIn = checkIn.split("T")[0]
  const cleanCheckOut = checkOut.split("T")[0]

  const { data, error } = await supabase
    .rpc("get_checkout_room_data", {
      p_check_in: cleanCheckIn,
      p_check_out: cleanCheckOut,
      p_room_slug: roomSlug,
    })
    .maybeSingle()
    .overrideTypes<RoomsAndReservations>()

  if (error) {
    console.error("Error checking room availability:", error)
    throw new Error("Facing error while checking room availability...")
  }

  const availability = data ? data.rooms_remaining : 0
  return availability
}

export async function getAddOns() {
  const { data, error } = await supabase.from("addOns").select("*")
  if (error) {
    console.error("Error fetching add-ons:", error)
    throw new Error("Facing error while fetching add-ons...")
  }
  return data
}

export async function createReservation(reservationData: any) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([reservationData])
    .select()
    .single() // Forces Supabase to return an object instead of an array

  if (error) {
    console.error("Error creating reservation:", error)
    throw new Error("Facing error while creating reservation...")
  }

  return data // Now this is an object: { id: 1, check_in: "...", ... }
}
