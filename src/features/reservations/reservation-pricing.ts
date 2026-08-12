import { differenceInCalendarDays } from "date-fns"

export function reservationPriceCalculation(
  roomsReq: number,
  roomPrice: number,
  addOns: any[],
  dateFrom?: Date,
  dateTo?: Date
) {
  const nights =
    dateFrom && dateTo
      ? Math.max(
          1,
          differenceInCalendarDays(new Date(dateTo), new Date(dateFrom))
        )
      : 0

  const roomTotal = (roomPrice || 0) * nights * roomsReq

  const addOnsTotal = addOns.reduce((total, addOn) => {
    return (
      total +
      (addOn.isDailyPricing ? addOn.price * nights : addOn.price) * roomsReq
    )
  }, 0)

  const subTotal = roomTotal + addOnsTotal
  const taxAmount = subTotal * 0.18 // 18% Tax Rate
  const grandTotal = subTotal + taxAmount
  console.log(
    `[FROM RESERVATION-PRICING] subTotal: ${subTotal}, taxAmount: ${taxAmount}, grandTotal: ${grandTotal} RoomTotal: ${roomTotal}, nights: ${nights}, addOnsTotal: ${addOnsTotal}`
  )

  return { roomTotal, nights, taxAmount, grandTotal, addOnsTotal }
}
