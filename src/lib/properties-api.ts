import { supabase } from "./supabse"

export async function getProperties() {
  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")

  if (error) {
    console.log("Error", error)
    throw new Error("Facing error while fetching properties...")
  }

  return properties
}
