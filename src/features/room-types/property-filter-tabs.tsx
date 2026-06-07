import { cn } from "@/lib/utils"
import { PROPERTY_FILTERS, type PropertyProps } from "@/pages/rooms"
import { useEffect } from "react"
import { useSearchParams } from "react-router"

export default function PropertyFilterTabs({
  properties,
}: {
  properties: PropertyProps[]
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPropertyId =
    PROPERTY_FILTERS.find((prop) => prop === searchParams.get("property")) ||
    "all"

  function handlePropertyClick(propertyId: string) {
    setSearchParams((prev) => {
      const newSearchParams = new URLSearchParams(prev)
      if (propertyId === "all") newSearchParams.delete("property")
      else newSearchParams.set("property", propertyId)
      return newSearchParams
    })
  }

  useEffect(() => {
    if (currentPropertyId === "all")
      setSearchParams((prev) => {
        const newSearchParams = new URLSearchParams(prev)
        newSearchParams.delete("property")
        return newSearchParams
      })
  }, [currentPropertyId])

  return (
    <div className="flex w-full">
      <div
        className="inline-flex w-full items-center gap-1 overflow-x-auto rounded-lg bg-muted/20 p-1 @md:w-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <button
          onClick={() => handlePropertyClick("all")}
          className={cn(
            "relative shrink-0 rounded-md px-4 py-2 text-xs font-medium transition-all duration-300 ease-out",
            currentPropertyId === "all"
              ? "bg-background text-foreground shadow-sm ring-1 ring-border/75"
              : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
          )}
        >
          All Properties
        </button>

        {properties?.map((property: PropertyProps) => (
          <button
            key={property.id}
            onClick={() => handlePropertyClick(property.slug)}
            className={cn(
              "relative shrink-0 rounded-md px-4 py-2 text-xs font-medium capitalize transition-all duration-300 ease-out",
              currentPropertyId === property.slug
                ? "bg-background text-foreground shadow-sm ring-1 ring-border/75"
                : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
            )}
          >
            {property.name}
          </button>
        ))}
      </div>
    </div>
  )
}
