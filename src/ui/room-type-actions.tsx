import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CopyPlus, Eye, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { useSearchParams } from "react-router"

export function RoomTypeActions({ roomCode }: { roomCode: string }) {
  const [searchParams, setSearchParams] = useSearchParams()

  function handleSearchParams(
    type: "details" | "edit" | "duplicate" | "delete",
    code: string
  ) {
    setSearchParams((prev) => {
      prev.delete("details")
      prev.delete("edit")
      prev.delete("duplicate")
      prev.delete("delete")
      prev.set(type, code)
      return prev
    })
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="-mt-1 -mr-2 h-11 w-11 shrink-0 text-muted-foreground hover:text-foreground"
        >
          <span className="sr-only">Open room actions menu</span>
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2">
        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem
            className="py-2"
            onClick={() => handleSearchParams("details", roomCode)}
          >
            <Eye /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-2"
            onClick={() => handleSearchParams("edit", roomCode)}
          >
            <Pencil /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-2"
            onClick={() => handleSearchParams("duplicate", roomCode)}
          >
            <CopyPlus />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-2"
            onClick={() => handleSearchParams("delete", roomCode)}
          >
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
