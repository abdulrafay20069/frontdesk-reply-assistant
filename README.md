# FrontDesk Reply Assistant

I built this to explore how AI fits into a real human workflow — specifically the loop of "customer asks something, someone writes a reply." The AI handles the first draft; a person reviews and approves every reply before it goes anywhere.

## Live Demo

[URL] · Login: `admin@frontdesk.dev` / `FrontDesk2024!`

## Stack

- **Backend:** Java 17, Spring Boot 3, PostgreSQL, Flyway, JJWT
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, React Query, Zustand
- **AI:** Groq API (llama-3.3-70b-versatile)
- **Deploy:** Railway (backend + DB), Vercel (frontend)

## What It Does

- Manages incoming customer inquiries with status tracking from receipt to reply
- Generates first-draft replies grounded in a configurable business profile (name, tone, FAQ context)
- Enforces human approval before any reply is marked sent — the AI has no autonomous send path
- Logs every action (draft generated, edited, approved, sent) to an auditable activity trail

## Running Locally

### Prerequisites

- Docker (for Postgres)
- Java 17
- Node 18+
- Maven 3.9+
- A Groq API key — free at [console.groq.com](https://console.groq.com)

### 1. Start Postgres

```bash
docker-compose up -d


Note: The backend is hosted on Render's free tier. If the app has been idle, the first login may take up to a minute while the server wakes up. Subsequent requests are fast.
