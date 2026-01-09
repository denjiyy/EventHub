# EventHub - Events Tickets Browser

A modern React application for discovering and booking event tickets built with TypeScript, Tailwind CSS, and Vite.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── CategoryBadge.tsx
│   ├── EventCard.tsx
│   ├── LoadingSkeleton.tsx
│   ├── Navigation.tsx
│   └── ToastContainer.tsx
├── context/             # React context for state management
│   ├── AppContext.tsx
│   └── Router.tsx
├── data/                # Static data and mock data
│   └── mockEvents.ts
├── pages/               # Page components
│   ├── BookingsPage.tsx
│   ├── CreateEventPage.tsx
│   ├── EventDetailPage.tsx
│   ├── EventsPage.tsx
│   └── HomePage.tsx
├── types/               # TypeScript type definitions
│   └── index.ts
├── App.tsx              # Root application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Features

- **Home Page**: Featured events showcase and search functionality
- **Events Page**: Browse all events with filtering by location, category, and date
- **Event Detail Page**: View full event details and book tickets
- **Bookings Page**: Manage your event bookings
- **Create Event Page**: Create new events (stub implementation)
- **Toast Notifications**: User feedback system for actions
- **Responsive Design**: Mobile-first design approach

## Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS
- **Vite**: Fast build tool and dev server
- **Lucide React**: Icon library

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Component Overview

### Pages
- **HomePage**: Landing page with featured events and search
- **EventsPage**: All events with advanced filtering
- **EventDetailPage**: Event details with booking form
- **BookingsPage**: User's confirmed bookings
- **CreateEventPage**: Form to create new events

### Components
- **Navigation**: Top navigation bar with page links
- **EventCard**: Reusable event display card
- **CategoryBadge**: Event category label
- **ToastContainer**: Notification display system
- **LoadingSkeleton**: Loading state placeholder

### Context
- **AppContext**: Manages events, bookings, toasts, and API calls
- **Router**: Client-side routing and navigation

## State Management

The application uses React Context for global state:
- Events list and filtering
- User bookings
- Toast notifications
- Client-side routing

## Styling

All styles use Tailwind CSS with a consistent design system:
- Color scheme: Violet/Indigo primary colors
- Spacing: Tailwind's default spacing scale
- Typography: System fonts with Tailwind classes
- Responsive breakpoints: Mobile-first design
