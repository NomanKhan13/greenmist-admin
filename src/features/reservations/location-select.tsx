import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  propertiesQueryOptions,
  roomsQueryOptions,
} from "@/hooks/queries/rooms-query-options"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import {
  type ControllerRenderProps,
  type ControllerFieldState,
  useFormContext,
} from "react-hook-form"
import type { ReservationFormValues } from "./reservation-schema"

export function PropertySelect({
  field,
  fieldState,
}: {
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
}) {
  const { data: properties } = useQuery(propertiesQueryOptions())
  const propertyItems = properties?.map((p) => ({ value: p.id, label: p.name }))

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Property</FieldLabel>
      <Select
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
      >
        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
          <SelectValue placeholder="Select a property" />
        </SelectTrigger>
        <SelectContent>
          {propertyItems?.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}

export function RoomTypeSelect({
  field,
  fieldState,
}: {
  field: any
  fieldState: any
}) {
  const { watch } = useFormContext<ReservationFormValues>()
  const property = watch("property")
  const isPropertySelected = Boolean(property)

  const { data: roomTypes } = useQuery(roomsQueryOptions())
  const roomTypesForProperty = property
    ? roomTypes
        ?.filter((r) => r.properties?.id === property)
        .map((r) => ({ value: r.slug, label: r.name }))
    : []

  console.log("Field value:", field.value)
  console.log("Field name:", field.name)

  useEffect(() => {
    field.onChange("")
  }, [property])

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Room Type</FieldLabel>
      <Select
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
        disabled={!isPropertySelected}
      >
        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
          <SelectValue placeholder="Select a room type" />
        </SelectTrigger>
        <SelectContent>
          {roomTypesForProperty?.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
