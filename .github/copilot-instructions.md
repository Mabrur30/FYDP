# CivilHub - FYDP Project

## Project Overview
CivilHub is a web-based civil engineering marketplace for Bangladesh.
It connects verified civil engineers with clients for construction projects,
service hiring, and resource trading.

## Tech Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- Backend: Django + Django REST Framework (Python)
- Database: MongoDB (via Djongo)
- AI Feature: Cost estimation model (XGBoost + ANN hybrid)

## Project Structure
FYDP/
├── src/              # React frontend
├── backend/          # Django backend
│   ├── engineers/    # Engineer app
│   ├── clients/      # Client app
│   ├── projects/     # Project listings
│   └── reviews/      # Ratings & reviews

## Coding Guidelines
- Follow Django MTV pattern and DRY principle
- Use Django REST Framework serializers and ViewSets
- Use React functional components with hooks only
- Use Tailwind + shadcn/ui for all UI components
- Use TypeScript strictly — no `any` types
- API base URL: http://localhost:8000/api/

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
