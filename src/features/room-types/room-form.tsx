import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import AddRoomField from "./add-room-field"
import { useFetcher, useSearchParams } from "react-router"
import type { RoomTypeProps } from "./room-type-card"
import type { PropertyProps } from "@/pages/rooms"
import { useEffect, useRef } from "react"
import { SheetClose, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function RoomForm({
  roomToEdit,
  propertyDropDown,
  onSuccess,
}: {
  roomToEdit?: RoomTypeProps
  propertyDropDown: Pick<PropertyProps, "name" | "id">[] | undefined
  onSuccess: () => void
}) {
  const fetcher = useFetcher()
  const [searchParams] = useSearchParams()
  const scrollRef = useRef<HTMLDivElement>(null)
  const addRoomTypeSuccess = fetcher.data?.success
  const addRoomTypeError = fetcher.data?.error
  const isSubmitting = fetcher.state === "submitting"
  const isDuplicate = !!searchParams.get("duplicate")
  const isUpdate = !!searchParams.get("edit")

  useEffect(() => {
    if (addRoomTypeSuccess) onSuccess()
  }, [addRoomTypeSuccess])

  useEffect(() => {
    if (addRoomTypeError && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [addRoomTypeError])

  return (
    <>
      <div
        ref={scrollRef}
        className="no-scrollbar grid flex-1 auto-rows-min gap-8 overflow-y-auto pt-2 pr-2 pb-8"
      >
        <fetcher.Form
          method="post"
          action="/rooms"
          id={
            isUpdate
              ? "update-room-type-form"
              : isDuplicate
                ? "duplicate-room-type-form"
                : "add-room-type-form"
          }
          className="p-1"
        >
          {addRoomTypeError && (
            <div className="mb-4 rounded-md bg-destructive/15 p-2 text-sm font-medium text-destructive">
              {addRoomTypeError}
            </div>
          )}
          <FieldGroup className="space-y-8">
            <FieldSet>
              <FieldLegend>Basic Information</FieldLegend>
              <FieldDescription>
                Essential details to identify and display the room type on your
                storefront.
              </FieldDescription>
              <FieldGroup className="mt-2">
                {isDuplicate && (
                  <input type="hidden" name="_intent" value="duplicate-room" />
                )}
                {isUpdate && (
                  <input type="hidden" name="_intent" value="update-room" />
                )}
                {isUpdate && (
                  <input type="hidden" name="id" value={roomToEdit?.id} />
                )}
                <AddRoomField
                  name="name"
                  label="Room type name"
                  placeholder="Penthouse Suite"
                  description="The public display name for this room category."
                  defaultFieldValue={
                    isDuplicate ? `${roomToEdit?.name} Copy` : roomToEdit?.name
                  }
                />
                <AddRoomField
                  name="slug"
                  label="Slug URL"
                  placeholder="penthouse-suite"
                  description="Unique identifier used in the web address."
                  defaultFieldValue={
                    isDuplicate ? `${roomToEdit?.slug}-copy` : roomToEdit?.slug
                  }
                />
                <AddRoomField
                  name="idealFor"
                  label="Ideal for"
                  placeholder="Couples or small families"
                  description=""
                  defaultFieldValue={roomToEdit?.idealFor}
                />
                <AddRoomField
                  name="thumbnail"
                  label="Thumbnail URL"
                  placeholder="https://..."
                  description=""
                  defaultFieldValue={roomToEdit?.thumbnail}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Pricing & Inventory</FieldLegend>
              <FieldDescription>
                Set the standard base rates and manage available physical
                inventory.
              </FieldDescription>
              <FieldGroup className="mt-2 space-y-1">
                <div className="grid grid-cols-2 gap-5">
                  <AddRoomField
                    name="pricePerNight"
                    label="Base Price"
                    type="number"
                    placeholder="13,000.00"
                    description="Standard nightly rate."
                    defaultFieldValue={roomToEdit?.pricePerNight}
                  />
                  <AddRoomField
                    name="totalRooms"
                    label="Total Rooms"
                    type="number"
                    placeholder="5"
                    description=""
                    defaultFieldValue={roomToEdit?.totalRooms}
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <AddRoomField
                    name="maxAdults"
                    label="Max Adults"
                    type="number"
                    placeholder="2"
                    description=""
                    defaultFieldValue={roomToEdit?.maxAdults}
                  />
                  <AddRoomField
                    name="maxKids"
                    label="Max Kids"
                    type="number"
                    placeholder="0"
                    description=""
                    defaultFieldValue={roomToEdit?.maxKids}
                  />
                </div>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Room Configuration</FieldLegend>
              <FieldDescription>
                Physical specifications and included amenities for this room.
              </FieldDescription>
              <FieldGroup className="mt-2 space-y-1">
                <div className="grid grid-cols-3 gap-5">
                  <AddRoomField
                    name="size"
                    label="Size (sq ft)"
                    type="number"
                    placeholder="500"
                    description=""
                    defaultFieldValue={roomToEdit?.size}
                  />
                  <AddRoomField
                    name="bedCount"
                    label="Bed Count"
                    type="number"
                    placeholder="1"
                    description=""
                    defaultFieldValue={roomToEdit?.bedCount}
                  />
                  <AddRoomField
                    name="bedType"
                    label="Bed Type"
                    placeholder="King"
                    description=""
                    defaultFieldValue={roomToEdit?.bedType}
                  />
                </div>
                <AddRoomField
                  name="amenities"
                  label="Amenities"
                  placeholder="WiFi, AC, TV, Minibar"
                  description="Comma separated list of room features."
                  defaultFieldValue={roomToEdit?.amenities?.join(", ")}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Property Details</FieldLegend>
              <FieldDescription>
                Assign to a specific property and manage its active status.
              </FieldDescription>
              <FieldGroup className="mt-2 space-y-1">
                <Field>
                  <FieldLabel htmlFor="property-id">Property</FieldLabel>
                  <Select
                    name="property_id"
                    defaultValue={
                      Array.isArray(roomToEdit?.properties)
                        ? roomToEdit?.properties[0]?.id
                        : roomToEdit?.properties?.id
                    }
                    required
                  >
                    <SelectTrigger id="property-id">
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {propertyDropDown?.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    placeholder="Add a detailed description of the room type..."
                    className="min-h-25 resize-none"
                    defaultValue={roomToEdit?.description}
                  />
                </Field>
                <Field orientation="horizontal" className="pt-4">
                  <Checkbox
                    id="is-active"
                    name="isActive"
                    className="mt-1"
                    defaultChecked={roomToEdit?.isActive}
                  />
                  <div className="grid leading-none">
                    <FieldLabel
                      htmlFor="is-active"
                      className="cursor-pointer pb-1 font-normal"
                    >
                      Active
                    </FieldLabel>
                    <FieldDescription>
                      Make this room type visible to users for booking.
                    </FieldDescription>
                  </div>
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </fetcher.Form>
      </div>
      <SheetFooter className="p-0 pt-4">
        <Button
          type="submit"
          form={
            isUpdate
              ? "update-room-type-form"
              : isDuplicate
                ? "duplicate-room-type-form"
                : "add-room-type-form"
          }
          className="cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Room Type"}
        </Button>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}
