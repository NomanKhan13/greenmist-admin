import * as z from "zod"
import { customAlphabet } from "nanoid"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PostgrestError } from "@supabase/supabase-js"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRoomCode() {
  const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-",
    10
  )
  return nanoid()
}

export function getFriendlyErrorMessage(dbError: PostgrestError | null) {
  if (!dbError) return
  if (dbError.code === "23505") {
    return {
      statusCode: 409, // Conflict
      message:
        "A room with this id or slug already exists. Please choose a different id/slug.",
    }
  }

  if (dbError.code === "23502") {
    return {
      statusCode: 400, // Bad Request
      message: "Please fill out all required fields for the room.",
    }
  }

  return {
    statusCode: 500, // Internal Server Error
    message:
      "We experienced an unexpected issue while saving this room. Please try again in a moment.",
  }
}

/**
 * 1. Define shape of object
 *    z.object({})
 *
 * 2. Primitive and modifiers
 *    eg: z.string(), z.number(), z.boolean()
 *    combined with .min(1) and so on.
 *
 * 3. z.coerce
 *    Works wonders for formData as form data returns field values in string.
 *    eg: z.coerce.number() automatically parses strings into numbers before validating them.
 *
 * 4. .transform()
 *    Allows you to intercept a value and change its shape (perfect for your comma-separated amenities).
 *
 * 5. z.infer
 *    Generates a TypeScript type directly from your schema so you don't have to write it twice.
 *
 * 6. .safeParse()
 *    Validates data without throwing errors, returning a success/error object instead.
 *
 */
//
