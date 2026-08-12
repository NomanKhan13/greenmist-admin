import { supabase } from "./supabase"
import {
  generateRoomCode,
  getFriendlyErrorMessage,
  type RoomType,
} from "./utils"

type FetchedRoomTypes = {
  id: any
  name: any
  thumbnail: any
  pricePerNight: any
  description: any
  size: any
  bedCount: any
  bedType: any
  maxAdults: any
  maxKids: any
  totalRooms: any
  slug: any
  idealFor: any
  amenities: any
  isActive: any
  roomCode: any
  category: any
  properties: {
    id: any
    slug: any
  }
}

export async function getRoomTypes() {
  const { data: roomTypes, error } = await supabase
    .from("roomType")
    .select(
      "id, name, thumbnail, pricePerNight, description, size, bedCount, bedType, maxAdults, maxKids, totalRooms, slug, idealFor, amenities, isActive, roomCode, category, properties(id, slug)"
    )
    .overrideTypes<FetchedRoomTypes[]>()

  if (error) {
    console.log("Error", error)
    throw new Error("Facing error while fetching room types...")
  }

  return roomTypes
}

export async function getRoomTypeByProperty(property: string) {
  const { data: roomTypes, error } = await supabase
    .from("roomType")
    .select(
      "id, name, thumbnail, pricePerNight, description, size, bedCount, bedType, maxAdults, maxKids, totalRooms, slug, idealFor, amenities, isActive, roomCode, category"
    )
    .eq("properties.slug", property)

  if (error) {
    console.log("Error", error)
    throw new Error("Facing error while fetching room types...")
  }

  return roomTypes
}

export async function addNewRoomType(roomTypeData: RoomType) {
  const roomCode = generateRoomCode()
  const { data, error } = await supabase
    .from("roomType")
    .insert([{ ...roomTypeData, roomCode }])
    .select()

  if (error) {
    console.log("Error", error)
    // thorw will just sent is as it is and throw new Error will make a standarised object and throw it.
    throw getFriendlyErrorMessage(error)?.message
  }
  return data
}

export async function updateRoomType(roomTypeData: RoomType, roomId: string) {
  const { data, error } = await supabase
    .from("roomType")
    .update([roomTypeData])
    .eq("id", roomId)
    .select()

  if (error) {
    console.log("Error", error)
    throw getFriendlyErrorMessage(error)?.message
  }
  return data
}

export async function deleteRoomType(roomId: string) {
  const { error } = await supabase.from("roomType").delete().eq("id", roomId)
  if (error) {
    console.log("Error", error)
    throw new Error("Facing error while deleting the room type...")
  }
}
