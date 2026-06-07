import { useQueryClient } from "@tanstack/react-query"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useSearchParams } from "react-router"
import { CONFLICTING_URL_PARAMS, type PropertyProps } from "@/pages/rooms"
import type { RoomTypeProps } from "./room-type-card"
import RoomForm from "./room-form"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function DuplicateRoomSheet({
  propertyDropDown,
  isOpen,
}: {
  propertyDropDown: Pick<PropertyProps, "name" | "id">[] | undefined
  isOpen: boolean
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const roomCodeToDuplicate = searchParams.get("duplicate")
  const isSheetOpen = isOpen

  function closeSheet() {
    const newParams = new URLSearchParams(searchParams)
    CONFLICTING_URL_PARAMS.forEach((param) => newParams.delete(param))
    setSearchParams(newParams)
  }

  function onSuccess() {
    closeSheet()
    toast.success("Room type duplicated successfully.")
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
