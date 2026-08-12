import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { useSearchParams } from "react-router"
import { CATEGORIES, type PropertyProps } from "@/pages/rooms"
import {
  RESERVATION_SORT_OPTIONS,
  RESERVATION_STATUS,
} from "./reservations-controlbar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  properties: PropertyProps[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  properties,
}: DataTableProps<TData, TValue>) {
  const [searchParams, setSearchParams] = useSearchParams()
  // const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = []

    const searchQuery = searchParams.get("q")
    const propertyQuery = properties.find(
      (property) => property.slug === searchParams.get("property")
    )?.name
    const categoryQuery = CATEGORIES.find(
      (category) => category === searchParams.get("category")
    )
    const statusQuery = RESERVATION_STATUS.find(
      (status) => status.name === searchParams.get("status")
    )?.name

    console.log(statusQuery)

    if (searchQuery) filters.push({ id: "guest", value: searchQuery })
    if (propertyQuery) filters.push({ id: "property", value: propertyQuery })
    if (categoryQuery) filters.push({ id: "category", value: categoryQuery })
    if (statusQuery && statusQuery !== "all")
      filters.push({ id: "status", value: statusQuery })

    return filters
  }, [searchParams])

  const sorting = useMemo<SortingState>(() => {
    const sort: SortingState = []
    const sortQuery = RESERVATION_SORT_OPTIONS.find(
      (sortOption) => sortOption.value === searchParams.get("sort")
    )?.value

    if (sortQuery) {
      const [columnId, direction] = sortQuery?.split("-")
      sort.push({ id: columnId, desc: direction === "desc" })
    }
    return sort
  }, [searchParams])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    initialState: {
      columnVisibility: {
        property: false,
        check_in: false,
        check_out: false,
        createdAt: false,
      },
    },
  })

  return (
    <div className="space-y-4">
      {/* <div className="flex items-center justify-between">
        <Input
          placeholder="Filter names or bookings..."
          value={(table.getColumn("guest")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("guest")?.setFilterValue(event.target.value)
          }
          className="max-w-60 bg-background/50"
        />
        <Tabs
          defaultValue="all"
          className="w-auto"
          onValueChange={(newValue) => {
            table
              .getColumn("status")
              ?.setFilterValue(newValue === "all" ? undefined : newValue)
          }}
        >
          
          <TabsList className="border border-border/50 bg-muted/50">
            {statusFilters.map((statusF) => (
              <TabsTrigger value={statusF.value}>{statusF.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div> */}

      {/* Softened the border and added a very subtle shadow */}
      <div className="overflow-hidden rounded-lg border border-border/40 bg-card/50 shadow-sm">
        <Table>
          {/* Removed bg-sidebar-accent, added subtle bottom border */}
          <TableHeader className="border-b border-border/40 bg-muted/40 hover:bg-transparent">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-none hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      // Elevated Typography for Headers
                      className="h-11 text-[11px] font-semibold tracking-wider text-muted-foreground/80 uppercase"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-border/40 transition-colors hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No reservations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="text-sm text-muted-foreground/70">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-border/50 text-muted-foreground hover:text-foreground"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-border/50 text-muted-foreground hover:text-foreground"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
