# CivilHub - FYDP Project

## Project Overview

CivilHub is a web-based civil engineering marketplace for Bangladesh.
It connects verified civil engineers with clients for construction projects,
service hiring, and resource trading.

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- AI Feature: Cost estimation model (XGBoost + ANN hybrid)

## Project Structure

FYDP/
├── src/ # React frontend (TypeScript)
├── backend/ # Express backend (Node.js)
│ ├── models/ # Mongoose models
│ ├── routes/ # API route handlers
│ ├── controllers/ # Business logic
│ └── server.js # Entry point

## Coding Guidelines

- Backend: Use async/await, proper error handling with try/catch
- Use Mongoose for all MongoDB operations
- RESTful API conventions — proper HTTP methods and status codes
- Frontend: React functional components + hooks only
- Use Tailwind + shadcn/ui for all UI — no inline styles
- TypeScript strictly on frontend — no `any` types
- API base URL: http://localhost:5000/api/

## Key Features to Build

1. Engineer registration & verification system
2. Client project posting
3. Engineer search & filtering by location/specialization
4. AI-based construction cost estimator
5. Review & rating system

## Bangladesh Context

- All locations refer to Bangladesh districts
- Currency is BDT (Bangladeshi Taka)
- Engineers verified via BUET/IEB credentials
