# CivilHub - FYDP Project

## Project Overview

CivilHub is a web-based civil engineering marketplace for Bangladesh.
It connects verified civil engineers with clients for construction projects,
service hiring, and resource trading.

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- Backend: Express + TypeScript + Mongoose
- Database: MongoDB
- Real-time: Socket.io
- AI Feature: Cost estimation model (XGBoost + ANN hybrid)

## Project Structure

FYDP/
├── src/ # React frontend
├── backend/ # Express backend
│ ├── src/
│ │ ├── controllers/ # Business logic
│ │ ├── models/ # Mongoose schemas
│ │ ├── routes/ # API endpoints
│ │ ├── utils/ # Middleware & helpers
│ │ ├── app.ts # Express app setup
│ │ ├── index.ts # Server entry point
│ │ └── socket.ts # WebSocket setup

## Coding Guidelines

- Follow Express REST conventions and DRY principle
- Use TypeScript strictly for both frontend and backend — no `any` types
- Use middleware for auth, validation, and error handling
- Use Mongoose schemas for database models
- Use React functional components with hooks only
- Use Tailwind + shadcn/ui for all UI components
- Implement proper error handling and validation
- API base URL: http://localhost:4000/api/

## Key Features to Build

1. Engineer registration & verification system
2. Client project posting
3. Engineer search & filtering by location/specialization
4. AI-based construction cost estimator
5. Review & rating system

## Bangladesh Context

- All locations refer to Bangladesh districts
- Currency is BDT (Bangladeshi Taka)
- Engineers must have BUET/IEB credentials for verification
