import { Button } from "@/components/ui/button"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { PropertyProps } from "@/pages/rooms"
import { useState } from "react"
import type { RoomTypeProps } from "./room-type-card"
import RoomForm from "./room-form"

export function AddRoomSheet({
  propertyDropDown,
  toaster,
}: {
  propertyDropDown: Pick<PropertyProps, "name" | "id">[] | undefined
  defaultRoomData?: RoomTypeProps
  toaster: (type: "success" | "error" | "warning", message: string) => void
}) {
  const [open, setOpen] = useState(false)

  function onSuccess() {
    setOpen(false)
    toaster("success", "Room type created successfully.")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="cursor-pointer hover:scale-98 active:scale-95">
          Add Room Type
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-3">
        <SheetHeader className="px-0">
          <SheetTitle>Add new room type</SheetTitle>
          <SheetDescription>
            Fill in the details for the new room type. Click save when
            you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <RoomForm propertyDropDown={propertyDropDown} onSuccess={onSuccess} />
      </SheetContent>
    </Sheet>
  )
}
