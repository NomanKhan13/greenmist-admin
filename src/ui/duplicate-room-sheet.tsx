import { useQueryClient } from "@tanstack/react-query"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useSearchParams } from "react-router"
import type { PropertyProps } from "@/pages/rooms"
import type { RoomTypeProps } from "./room-type-card"
import RoomForm from "./room-form"
import { Button } from "@/components/ui/button"

export default function DuplicateRoomSheet({
  propertyDropDown,
  toaster,
}: {
  propertyDropDown: Pick<PropertyProps, "name" | "id">[] | undefined
  toaster: (type: "success" | "error" | "warning", message: string) => void
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const roomCodeToDuplicate = searchParams.get("duplicate")
  const isSheetOpen = Boolean(roomCodeToDuplicate)

  function closeSheet() {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete("duplicate")
    setSearchParams(newParams)
  }

  function onSuccess() {
    closeSheet()
    toaster("success", "Room type created successfully.")
  }

  function handleOpenChange(open: boolean) {
    if (!open) closeSheet()
  }

  const queryClient = useQueryClient()
  const cachedRooms = queryClient.getQueryData<RoomTypeProps[]>(["room-types"])
  const roomToDuplicate = cachedRooms?.find(
    (r) => r.roomCode === roomCodeToDuplicate
  )
  const roomDoesNotExist = isSheetOpen && !roomToDuplicate

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="flex flex-col p-3">
        <SheetHeader className="px-0">
          <SheetTitle>Add New Room Type</SheetTitle>
          <SheetDescription>
            Fill in the details for the new room type. Click save when
            you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        {roomDoesNotExist ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-md border bg-muted p-2">
            <p className="text-center text-sm text-muted-foreground">
              The room type you are trying to duplicate does not exist. It might
              have been deleted or the URL might be incorrect.
            </p>
            <Button variant="outline" onClick={onSuccess}>
              Go back to rooms
            </Button>
          </div>
        ) : (
          <RoomForm
            roomToEdit={roomToDuplicate}
            propertyDropDown={propertyDropDown}
            onSuccess={onSuccess}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
