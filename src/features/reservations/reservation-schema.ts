import z from "zod"

export const reservationSchema = z.object({
  // --- STAY DETAILS ---
  property: z.string().min(1, "Please select a property."),
  roomType: z.string().min(1, "Please select a room type."),
  dateRange: z.object({
    from: z.date("Check-in date is required."),
    to: z.date("Check-out date is required."),
  }),
  adults: z
    .number()
    .min(1, "At least 1 adult is required.")
    .max(10, "Maximum 10 adults allowed"),
  kids: z.number().min(0, "Kids cannot be negative."),

  // --- GUEST IDENTITY ---
  fullName: z.string().min(3, "Name must be at least 3 characters."),
  email: z.email("Please enter a valid email address."),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Please enter a valid international phone number.",
  }),
  nationalIdType: z.enum(
    ["aadhar-card", "passport"],
    "Please select an ID type."
  ),
  nationalIdNumber: z.string().min(1, "Please enter your ID number."),
  addOns: z.array(z.string()).optional(),
  hasPaid: z.boolean(),
  specialRequests: z
    .string()
    .max(500, "Special requests cannot exceed 500 characters.")
    .optional(),
})

export type ReservationFormValues = z.infer<typeof reservationSchema>
