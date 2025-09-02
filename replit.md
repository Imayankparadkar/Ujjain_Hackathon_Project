# SmartKumbh - AI-Powered Pilgrim Navigation & Safety Platform

## Overview

SmartKumbh is a comprehensive full-stack web application designed to enhance the safety, navigation, and spiritual experience of pilgrims during the Kumbh Mela. The platform provides real-time crowd monitoring, safety alerts, lost & found services, spiritual event tracking, AI-powered chat assistance, and interactive mapping features. Built with modern web technologies, it serves both public visitors and authenticated users with role-based access control.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system featuring warm colors (orange/saffron theme) and elderly-friendly accessibility mode
- **UI Components**: Radix UI primitives with shadcn/ui components for consistent design and accessibility
- **State Management**: React Context for authentication and elderly mode, React Hook Form for form handling
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management and caching

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Build System**: ESBuild for server bundling and production deployment
- **Development**: Hot module replacement with Vite middleware integration
- **API Design**: RESTful API with Zod validation schemas

### Authentication & Authorization
- **Identity Provider**: Firebase Authentication for user management
- **Data Storage**: Firestore for user profiles and application data
- **Role-Based Access**: Differentiated access between regular users and administrators
- **Session Management**: Firebase Auth state persistence with real-time user profile synchronization

### Data Architecture
The application uses a hybrid storage approach:
- **Relational Data**: PostgreSQL via Drizzle ORM for structured data (users, alerts, events, reports)
- **Document Storage**: Firestore for flexible data and real-time synchronization
- **Schema Management**: Drizzle migrations for database versioning

Key entities include:
- Users with profiles, emergency contacts, and QR identification
- Safety alerts with priority levels and location-based filtering
- Lost & found cases with status tracking and officer assignment
- Spiritual events with live streaming capabilities
- Cleanliness reports with facility ratings
- Crowd density data for real-time monitoring

### Interactive Features
- **Mapping**: Leaflet-based interactive maps with custom markers for important locations
- **QR Code Generation**: Dynamic QR codes for user identification and emergency contact
- **AI Chat Assistant**: Google Gemini-powered multilingual chatbot (KumbhBot) supporting 12 Indian languages
- **Real-time Updates**: Live data synchronization for crowd density, alerts, and events
- **Accessibility**: Elderly mode with increased font sizes and high-contrast themes

## External Dependencies

### Core Services
- **Firebase**: Authentication, Firestore database, real-time synchronization
- **Google Gemini AI**: Multilingual chat assistant with context-aware responses
- **Neon Database**: PostgreSQL hosting for structured data storage
- **Leaflet/OpenStreetMap**: Interactive mapping and geolocation services

### Development & Build Tools
- **Replit**: Development environment with custom cartographer and error overlay plugins
- **Vite**: Build tool with React plugin and development server
- **TypeScript**: Type safety and enhanced developer experience
- **Drizzle Kit**: Database schema management and migrations

### UI & Styling Libraries
- **Radix UI**: Accessible primitive components for complex UI patterns
- **Tailwind CSS**: Utility-first CSS framework with custom theme configuration
- **Lucide React**: Consistent icon system throughout the application
- **QRCode.js**: Client-side QR code generation for user identification

### Data Validation & Forms
- **Zod**: Runtime type validation for API endpoints and form data
- **React Hook Form**: Performant form handling with validation integration
- **Hookform Resolvers**: Zod integration for form validation schemas

The architecture prioritizes scalability, accessibility, and real-time data synchronization to handle the large-scale requirements of the Kumbh Mela event while providing a smooth user experience across different devices and user capabilities.