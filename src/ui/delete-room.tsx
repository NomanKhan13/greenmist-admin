import { Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { RoomTypeProps } from "./room-type-card"
import { useSearchParams } from "react-router"
import { deleteRoomType } from "@/lib/rooms-api"
export function AlertDialogDestructive({
  toaster,
}: {
  toaster: (type: "success" | "error" | "warning", message: string) => void
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const cachedRooms = queryClient.getQueryData<RoomTypeProps[]>(["room-types"])
  const roomSlug = searchParams.get("delete")
  const roomToDelete = cachedRooms?.find((r) => r.roomCode === roomSlug)

  async function onSuccess() {
    const newParams = new URLSearchParams()
    newParams.delete("delete")
    setSearchParams(newParams)
    await queryClient.invalidateQueries({ queryKey: ["room-types"] })
  }

  function handleOpenChange(open: boolean) {
    if (!open) onSuccess()
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (roomId: string) => deleteRoomType(roomId),
    onSuccess: () => {
      onSuccess()
      toaster("success", "Room type deleted successfully.")
    },
    onError: (error) => {
      console.log("Error deleting room type", error)
      toaster("error", "Failed to delete the room type. Please try again.")
    },
  })

  return (
    <AlertDialog open={!!roomSlug} onOpenChange={handleOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete room?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the{" "}
            <span className="font-semibold text-foreground">
              {roomToDelete?.name}
            </span>{" "}
            room type? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={() => mutate(roomToDelete!.id)}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
        <div></div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
