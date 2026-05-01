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

export default function EditRoomSheet({
  propertyDropDown,
  toaster,
}: {
  propertyDropDown: Pick<PropertyProps, "name" | "id">[] | undefined
  toaster: (type: "success" | "error" | "warning", message: string) => void
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const roomCodeToEdit = searchParams.get("edit")
  const isSheetOpen = Boolean(roomCodeToEdit)

  const cachedRooms = queryClient.getQueryData<RoomTypeProps[]>(["room-types"])
  const roomToEdit = cachedRooms?.find((r) => r.roomCode === roomCodeToEdit)

  const roomDoesNotExist = isSheetOpen && !roomToEdit

  function closeSheet() {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete("edit")
    setSearchParams(newParams)
  }

  function onSuccess() {
    closeSheet()
    toaster("success", "Room type updated successfully.")
  }

  function handleOpenChange(open: boolean) {
    if (!open) closeSheet()
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="flex flex-col p-3">
        <SheetHeader className="px-0">
          <SheetTitle>Update existing room type</SheetTitle>
          <SheetDescription>
            Make changes to the room type details and save to update the
            storefront information.
          </SheetDescription>
        </SheetHeader>
        {roomDoesNotExist && (
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-md border bg-muted p-2">
            <h3 className="text-lg font-semibold">Room type not found</h3>
            <p className="text-sm text-muted-foreground">
              The room type you are trying to edit does not exist. It might have
              been deleted or the URL might be incorrect.
            </p>
            <Button variant="outline" onClick={onSuccess}>
              Go back to rooms
            </Button>
          </div>
        )}
        {!roomDoesNotExist && (
          <RoomForm
            roomToEdit={roomToEdit}
            propertyDropDown={propertyDropDown}
            onSuccess={onSuccess}
          />
        )}
        {/* <Activity mode={roomDoesNotExist ? "hidden" : "visible"}>
          <RoomForm
            roomToEdit={roomToEdit}
            propertyDropDown={propertyDropDown}
            onSuccess={onSuccess}
          />
        </Activity>
        <Activity mode={roomDoesNotExist ? "visible" : "hidden"}>
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-md border bg-muted p-2">
            <h3 className="text-lg font-semibold">Room type not found</h3>
            <p className="text-sm text-muted-foreground">
              The room type you are trying to edit does not exist. It might have
              been deleted or the URL might be incorrect.
            </p>
            <Button variant="outline" onClick={onSuccess}>
              Go back to rooms
            </Button>
          </div>
        </Activity> */}
      </SheetContent>
    </Sheet>
  )
}
