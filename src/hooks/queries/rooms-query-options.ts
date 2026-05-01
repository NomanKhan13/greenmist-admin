import { getProperties } from "@/lib/properties-api"
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
