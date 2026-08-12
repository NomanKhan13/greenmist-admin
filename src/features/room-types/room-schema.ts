import z from "zod"

export const RoomTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Room type name is required, eg: Hill View Standard"),
  slug: z.string().trim().min(1, "Slug is required, eg: hill-view-standard"),
  idealFor: z.string().trim().min(1, "Ideal for is required, eg: Couples"),
  thumbnail: z.url("Thumbnail must be a valid URL"),
  bedType: z.string().min(1, "Bed type is required, eg: Plush King"),
  property_id: z.uuid({ version: "v4" }),
  description: z.string().trim().min(1, "Description is required"),
  pricePerNight: z.coerce.number().nonnegative("Price must be 0 or higher"),
  totalRooms: z.coerce.number().int().min(1, "Rooms must be 1 or higher"),
  maxAdults: z.coerce.number().int().min(1, "Minimum 1 adult required"),
  maxKids: z.coerce.number().int().nonnegative("Kids must be 0 or higher"),
  size: z.coerce
    .number()
    .int()
    .min(120, "Size must be 120 120 sq. ft or higher"),
  bedCount: z.coerce.number().int().min(1, "Bed count must be 1 or higher"),
  isActive: z
    .string()
    .optional()
    .transform((val) => val === "on" || val === "true"),
  amenities: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : []
    ),
})

export type RoomType = z.infer<typeof RoomTypeSchema>
