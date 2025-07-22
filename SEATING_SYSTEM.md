# Salaseh Seating Map System 🎭

## Overview

A complete seating map system for the Jordanian comedy troupe Al-Salaseh. This system allows users to view interactive seating maps, select seats, and book tickets for comedy shows.

## Features Implemented

### Phase 1: Backend Foundation

#### 1. Event Model (`database/event.model.ts`)

- **ISeat Interface**: Represents individual seats with:
  - `id`: Unique seat identifier
  - `row`: Row name (A, B, C, etc.)
  - `number`: Seat number within the row
  - `status`: 'available', 'booked', or 'locked'
  - `priceTier`: VIP, Premium, Standard, or Economy

- **ISeatingMap Interface**: Complete seating layout with:
  - `stage`: Stage description
  - `rows`: Object mapping row names to seat arrays

- **IEvent Interface**: Event details including optional seatingMap

#### 2. Server Actions (`lib/action/event.action.ts`)

- **saveSeatingMap()**: Updates event seating map using MongoDB $set
- **getEventById()**: Fetches event with performance optimization (.lean())
- **createEvent()**: Helper function for creating new events
- All functions use proper error handling with handleError and action utilities

### Phase 2: Frontend Implementation

#### 3. Event Details Page (`app/events/[id]/page.tsx`)

- Server Component that fetches event data
- Handles missing events with notFound()
- Displays event information and seating map
- Type-safe with proper IEvent interface usage

#### 4. Interactive SeatMap Component (`components/events/index.tsx`)

- **Client Component** with "use client" directive
- **State Management**: Uses useState for selectedSeats array
- **Interactive Features**:
  - Click to select/deselect available seats
  - Visual feedback for different seat statuses
  - Hover effects and tooltips
- **Dynamic Styling**:
  - Green: Available seats
  - Blue: Selected seats
  - Red: Booked seats (disabled)
  - Yellow: Locked seats (disabled)
- **Booking Summary**:
  - Lists selected seats with details
  - Calculates total price
  - Confirm booking button

## File Structure

```
database/
├── event.model.ts          # Event, Seat, and SeatingMap interfaces
├── user.model.ts           # User model
└── account.model.ts        # Account model

lib/
├── action/
│   ├── event.action.ts     # Event-related server actions
│   ├── sample-data.action.ts # Sample data generation
│   └── auth.action.ts      # Authentication actions
└── handler/
    ├── action.ts           # Generic action handler
    └── error.ts            # Error handling utilities

app/
├── events/
│   ├── [id]/
│   │   └── page.tsx        # Event details page
│   └── create-sample/
│       └── page.tsx        # Sample data creation
└── (main)/
    └── page.tsx            # Home page with navigation

components/
├── events/
│   └── index.tsx           # SeatMap component
└── ui/                     # UI components (Button, etc.)

constants/
├── seating.ts              # Seating-related constants
└── routes.ts               # Application routes
```

## Usage Instructions

### 1. Create Sample Data

1. Navigate to the home page (`/`)
2. Click "Create Sample Event & Test Seating Map"
3. This will create a sample comedy show with a 9-row seating layout

### 2. View Seating Map

1. After creating sample data, you'll be redirected to the event page
2. View the interactive seating map with:
   - Stage at the top
   - 9 rows (A-I) with different price tiers
   - Color-coded seat statuses

### 3. Select Seats

1. Click on green (available) seats to select them
2. Selected seats turn blue and scale up
3. Click again to deselect
4. Red and yellow seats are disabled (booked/locked)

### 4. Book Tickets

1. View selected seats in the summary section
2. See total price calculation
3. Click "Confirm Booking" button to proceed

## Technical Implementation Details

### Database Schema

- Uses MongoDB with Mongoose
- Flexible seating map structure with Schema.Types.Mixed
- Proper TypeScript interfaces for type safety

### Error Handling

- Uses project's existing error handling system
- Proper ActionResponse types
- Server-side validation and error messages

### Performance Optimizations

- .lean() queries for better performance
- JSON serialization for server/client data transfer
- Efficient state management in React components

### Styling

- Tailwind CSS for responsive design
- Smooth transitions and hover effects
- Mobile-friendly responsive layout

## Constants and Configuration

- Seat prices defined in `constants/seating.ts`
- Easy to modify pricing tiers
- Consistent status values across the system

## Testing

- Sample data generation for immediate testing
- Multiple seat statuses for UI testing
- Different price tiers demonstration

## Future Enhancements

- Real booking functionality with payment processing
- Seat reservation with time limits
- Admin panel for seating map management
- Real-time seat availability updates
- Mobile app integration
