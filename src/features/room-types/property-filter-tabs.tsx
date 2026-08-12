import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    <Tabs
      defaultValue="all"
      className="flex w-full"
      value={currentPropertyId}
      onValueChange={(newValue) => {
        handlePropertyClick(newValue)
      }}
    >
      <TabsList className="inline-flex w-full items-center justify-start overflow-x-auto rounded-lg bg-muted/30 p-1 md:w-max [&::-webkit-scrollbar]:hidden">
        <TabsTrigger
          className={cn(
            "shrink-0 rounded-md px-4 py-1.5 text-xs font-medium transition-all",
            "text-muted-foreground hover:text-foreground",
            "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          )}
          value="all"
        >
          All Properties
        </TabsTrigger>

        {/* Apply the exact same className to your mapped properties! */}

        {properties.map((property) => (
          <TabsTrigger
            key={property.id}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              "text-muted-foreground hover:bg-muted/20 hover:text-foreground",
              "data-[state=active]:bg-muted/40 data-[state=active]:text-foreground data-[state=active]:shadow-none"
            )}
            value={property.slug}
          >
            {property.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
