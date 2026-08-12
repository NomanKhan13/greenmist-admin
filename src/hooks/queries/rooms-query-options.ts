import { getProperties } from "@/lib/properties-api"
import getReservations, { getAddOns } from "@/lib/reservations-api"
import { getRoomTypes } from "@/lib/rooms-api"

export function roomsQueryOptions() {
  return {
    queryKey: ["room-types"],
    queryFn: getRoomTypes,
    staleTime: 5 * 60 * 1000,
  }
}

export function propertiesQueryOptions() {
  return {
    queryKey: ["properties"],
    queryFn: getProperties,
    staleTime: 5 * 60 * 1000,
  }
}

export function reservationQueryOptions() {
  return {
    queryKey: ["reservations"],
    queryFn: getReservations,
    staleTime: 5 * 60 * 1000,
  }
}

export function addOnsQueryOptions() {
  return {
    queryKey: ["add-ons"],
    queryFn: getAddOns,
    staleTime: 5 * 60 * 1000,
  }
}
