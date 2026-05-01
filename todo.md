## EPIC #1 - Room management

### Core Features (MVP)

1. View rooms (/grid) - DONE
2. Add new room - DONE
3. Edit room - DONE
4. Delete room - DONE
5. View room details (photos, amenities, pricing) - DONE

### Smart Enhancements (high impact)

1. Room status system (Ready, Occupied, Housekeeping, Maintenance)
2. Filter by status & type
3. Sort by price / occupancy

👉 Why this works:
Shows CRUD + state modeling + UI thinking

## EPIC #2 - Reservation management

### Core Features

1. View reservations
2. View reservation details (including guest information, room details, and payment status)
3. Add reservation
4. Edit reservation
5. Cancel reservation

### Smart Enhancements

1. Reservation status (Upcoming, In-House, Checked-out, Cancelled)
2. Link reservation ↔ room
3. Prevent double booking (basic date validation)
4. Sort by reservation date (Newest to Oldest, Oldest to Newest), room type (Standard, Deluxe, Suite)
5. Search by guest name

👉 Why this stands out:
This is where most candidates fail.
You’re showing real-world logic, not just UI.

## EPIC #3 - Dashboard

### Features

1. Filter by date range (Today, This Week, This Month)
2. Key metrics: Revenue, Reservations, check-ins, check-outs
3. Visualizations: Bar chart for revenue, Occupied vs Available bar chart
4. Quick actions: Reservation list with check-in/check-out buttons

👉 Why this matters:
Transforms project from “CRUD app” → product

## EPIC #4 - Housekeeping management

### Features

1. View rooms list (Room number, type, status, priority, Reservation status, Assigned Staff, notes)
2. Update room status (Completed, pending, cleaning in progress)
3. Update priority (High, Medium, Low)
4. Assign staff to rooms
5. Add notes for staff (e.g., “Guest requested extra towels”)
6. Filter by status, priority

👉 Why keep this:
Adds domain realism without too much complexity

## EPIC #5 - Hotel Settings

### Features

1. Manage room types (Standard, Deluxe, Suite)
2. Manage amenities (Wi-Fi, TV, minibar)
3. Manage addon services (Breakfast, Airport Shuttle)
4. Contact information (Hotel name, address, phone, email)
5. Default check-in/check-out times, Length of Stay, Cancellation window, tax rates

## EPIC #6 - Add new staff

### Features

1. List staff members (Name, Role, Contact info)
2. Add new staff member

## EPIC #7 - User Profile

### Features

1. View profile (Name, email(read-only), role, avatar)
2. Edit profile (Name, password, avatar)
3. Log Out Button

---

TODO:

- [ ] Add ZOD validation for all forms.
