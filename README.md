# 🌐 A-Manager App (Starter Project)

A-Manager is a starter web application built with Next.js 15, featuring user authentication, an agent-based architecture, and integration with Supabase/Postgres.

The UI is built using Tailwind CSS and Shadcn UI, providing a modern and responsive design.

This project serves as a foundation for building scalable web applications using the agent-based approach (AntiGravity) and MCP services.

## 📋 Current Features

- 🔒 Secure user authentication (NextAuth)
- 🏗 Agent-based project structure using .agents:
  - rules/project-rules.md - coding rules and standards
  - skills/shadcn - UI components handling
  - skills/supabase-postgres-best-practices - database best practices
- 🌐 Responsive UI with Tailwind CSS and Shadcn UI
- 🧩 Agent-driven development with AntiGravity (code automation)
- 🛠 MCP services for integrating external tools and APIs
- 🗄 Database integration with Supabase/Postgres

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS (+ tailwind-merge, clsx)
- Shadcn UI

**Backend:**
- Supabase + Postgres

**Agent & Automation:**
- AntiGravity for agent development
- MCP (Model Context Protocol) services for integrations
- Skills and Rules for code automation

## 🏗 Project Structure

- `.agents/rules` - project rules and coding standards  
- `.agents/skills` - modules for UI, database, and API handling  
- `app/` - Next.js pages and routing  
- `components/` - React components  
- `lib/` - utilities and configuration  

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/elena-savitskaya/a-manager.git
```

cd a-manager

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create .env.local file with the following variables:

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET=your_nextauth_secret
GROQ_API_KEY=your-real-key
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

### 4. Run the App

```bash
npm run dev
```