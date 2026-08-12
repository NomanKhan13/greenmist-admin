import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { addOnsQueryOptions } from "@/hooks/queries/rooms-query-options"
import { useQuery } from "@tanstack/react-query"
import { inrFormatter } from "../room-types/room-details"
import { useFormContext } from "react-hook-form"
import type { ReservationFormValues } from "./reservation-schema"

export default function AddOnsSelector() {
  const { data: addOns = [] } = useQuery(addOnsQueryOptions())

  const { watch, setValue } = useFormContext<ReservationFormValues>()
  const addOnsList = watch("addOns") || []

  console.log(addOnsList)
  function updateAddOns(addOnId: string) {
    const newAddOns = addOnsList.includes(addOnId)
      ? addOnsList.filter((id: string) => id !== addOnId)
      : [...addOnsList, addOnId]
    setValue("addOns", newAddOns)
  }

  return (
    <>
      {addOns?.map((addOn) => (
        <Field
          key={addOn.id}
          orientation="horizontal"
          className="cursor-pointer items-start rounded-xl border border-border/60 p-5 transition-colors hover:border-border"
        >
          <Checkbox
            id={addOn.id}
            className="mt-0.5"
            disabled={!addOn.isActive}
            checked={addOnsList.includes(addOn.id)}
            onCheckedChange={() => updateAddOns(addOn.id)}
          />
          <FieldContent className="ml-3 flex-1 space-y-1">
            <FieldLabel
              htmlFor={addOn.id}
              className="flex w-full cursor-pointer items-center justify-between"
            >
              <span className="text-sm font-medium">{addOn.name}</span>
              <div className="space-x-1 text-sm font-medium">
                <span>{inrFormatter.format(addOn.price)}</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                  {addOn.isDailyPricing ? "/ night" : ""}
                </span>
              </div>
            </FieldLabel>
            <FieldDescription className="text-xs text-muted-foreground">
              {addOn.description}
            </FieldDescription>
          </FieldContent>
        </Field>
      ))}
    </>
  )
}
