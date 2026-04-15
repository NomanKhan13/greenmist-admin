### ⚙️ GreenMist: Hotel Operations Dashboard (Admin-Facing)

**Overview**
The GreenMist Admin Dashboard is a robust, data-heavy web application engineered to manage the backend operations of the GreenMist hotel ecosystem. Designed for operational efficiency, it provides hotel administrators with centralized control over property inventory, real-time booking management, and critical business metrics. The architecture prioritizes scalable state management and complex data handling to ensure a responsive experience when processing large datasets.

**Key Features**
* **Centralized Business Metrics:** An interactive dashboard providing at-a-glance insights into revenue, occupancy rates, and recent booking activity.
* **Inventory & Room Management:** Comprehensive CRUD functionality allowing administrators to update room details, availability, and pricing dynamically.
* **Robust Booking Control:** A detailed management system to view, modify, and process customer reservations in real-time.
* **Secure Access Control:** Role-based authentication ensuring that sensitive operational data is only accessible to authorized personnel.

**Technical Architecture**
* **Framework:** React.js structured around a highly scalable, component-based architecture.
* **Data Fetching & Caching:** TanStack Query implemented for efficient server state synchronization, minimizing redundant API calls and ensuring data freshness.
* **Database Integration:** Deep integration with the Supabase backend to manage complex relational data between users, rooms, and bookings.
* **Forms & Validation:** React Hook Form combined with Zod for strict schema validation on complex administrative data entries.
* **Data Visualization:** Recharts utilized to render dynamic, responsive charts for business analytics.
