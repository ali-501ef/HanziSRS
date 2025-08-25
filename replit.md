# Overview

This is a Chinese character (Hanzi) spaced repetition system (SRS) web application designed to help users learn Chinese characters efficiently. The application uses a modern full-stack architecture with React frontend and Express backend, featuring a clean, premium UI inspired by Stripe's design philosophy. It implements spaced repetition algorithms to optimize character learning retention and includes features like progress tracking, statistics, and responsive design.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses React 18 with TypeScript for the frontend, built with Vite for fast development and optimized builds. The UI is built with shadcn/ui components library providing a consistent, modern design system. Styling is handled by Tailwind CSS with custom design tokens for a premium look and feel. The application uses Wouter for lightweight client-side routing and TanStack Query for server state management and caching.

## Backend Architecture
The backend is built with Express.js and TypeScript, providing a RESTful API structure. The server includes middleware for request logging, JSON parsing, and error handling. Development uses tsx for TypeScript execution, while production builds use esbuild for bundling. The application includes Vite integration for development with HMR (Hot Module Replacement) support.

## Data Storage Solutions
The application is configured to use PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The database schema includes tables for users, characters, user progress tracking, study sessions, and user statistics. A fallback in-memory storage implementation is provided for development and testing purposes. The schema supports spaced repetition algorithm parameters including ease factors, intervals, and repetition counts.

## Study System Implementation
The core feature implements a simplified SuperMemo SM-2 spaced repetition algorithm to optimize learning intervals based on user performance. The system tracks character difficulty levels (0-8), ease factors, and review intervals. Study sessions capture user responses (easy/medium/hard) and adjust future review schedules accordingly. Progress tracking includes streak counting, accuracy metrics, and learned character statistics.

## User Interface Design
The frontend implements a premium design system with careful attention to typography, spacing, and micro-interactions. The interface includes smooth animations, card-flip effects for study materials, and responsive design for mobile devices. Dark mode support is built-in through CSS custom properties and theme switching. The design emphasizes accessibility and user experience with proper focus management and semantic HTML.

# External Dependencies

## UI and Styling
- **Tailwind CSS**: Primary styling framework with custom design tokens
- **Radix UI**: Unstyled, accessible component primitives for complex UI elements
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography

## Frontend State and Routing
- **TanStack Query**: Server state management, caching, and data synchronization
- **Wouter**: Lightweight client-side routing solution
- **React Hook Form**: Form state management and validation

## Backend and Database
- **Express.js**: Web server framework
- **Drizzle ORM**: Type-safe SQL ORM for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database service
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the entire application
- **ESLint**: Code linting and formatting
- **tsx**: TypeScript execution for development

## Authentication and Validation
- **Zod**: Schema validation for API requests and responses
- **Drizzle-Zod**: Integration between Drizzle ORM and Zod for schema validation

The application architecture prioritizes type safety, developer experience, and maintainability while delivering a premium user experience for language learning.