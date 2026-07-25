# FrontDesk Reply Assistant

A tool that reads customer emails, writes a first draft reply using AI, and waits for a human to click "approve" before anything actually gets sent. Because we're not quite ready to let an AI autonomously email customers with a straight face.

Built as a portfolio project to explore what "AI-assisted" should actually look like in a real workflow — helpful enough to save time, restrained enough to not embarrass anyone.

---

## Live Demo

**Frontend:** [add URL after deploy]
**Login:** `admin@frontdesk.dev` / `FrontDesk2024!`

> Heads up — the backend runs on Render's free tier, which puts the server to sleep after 15 minutes of inactivity. If you're the first visitor in a while, the login might take 30-60 seconds while the server wakes up, stretches, and asks what year it is. Everything after that is fast.

---

## The Idea

Small businesses get the same customer questions on repeat. "What are your hours?" "Can I return this?" "Do you ship to Alaska?" Answering each one from scratch is a slow tax on someone's day.

This app takes the inquiry, has an AI draft a reply in the business's own tone, and drops it in a workspace where a human can edit, approve, and send. The AI never sends anything on its own — which is both a safety feature and, honestly, the whole point.

---

## What It Does

- **Inbox** — All customer inquiries in one list, filtered by status (New, Drafted, Approved, Sent, Failed)
- **One-click AI drafts** — Grounded in a configurable business profile (name, tone, FAQ context)
- **Editable before sending** — Because AI is confident but not always correct
- **Activity log** — Every draft, edit, approval, and send is recorded automatically
- **Configurable tone** — Warm & Friendly, Formal & Professional, or Direct & Efficient. Change it once, every future draft follows suit.

---

## Stack

| Layer | Choice |
|---|---|
| Backend | Java 17, Spring Boot 3, Maven |
| Database | PostgreSQL 16, Flyway migrations |
| Auth | JWT (in-memory, no localStorage) |
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| State | React Query (server), Zustand (auth session) |
| AI | Groq API (`llama-3.3-70b-versatile`) |
| Hosting | Render (backend + Postgres), Vercel (frontend) |

---

## Running Locally

### Prerequisites

- Java 17
- Maven 3.9+
- Node 18+
- PostgreSQL 16 installed directly on Windows or Mac (Docker is optional and honestly a pain on older Windows)
- A free Groq API key from [console.groq.com](https://console.groq.com)

### 1. Set Up the Database

Install PostgreSQL 16. During install, set the password to something you'll remember. Then create a database called `frontdesk`:

Open pgAdmin → right-click Databases → Create → Database → name it `frontdesk` → Save.

### 2. Backend

```bash
cd backend
cp src/main/resources/application.yml.example src/main/resources/application.yml
