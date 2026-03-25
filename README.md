# 🌐 SubManager App (Starter Project)

SubManager — стартовий веб-проект на Next.js 15 з авторизацією користувачів, агентською структурою та інтеграцією з Supabase/Postgres. UI побудований на Tailwind CSS та Shadcn UI для сучасного, адаптивного дизайну.  

Проєкт слугує базою для подальшої розробки будь-яких веб-застосунків з використанням агентського підходу (AntiGravity) та MCP сервісів.

## 📋 Current Features

- 🔒 Безпечна авторизація користувачів (NextAuth)
- 🏗 Структура проекту з `.agents`:
  - `rules/project-rules.md` — правила та стандарти коду
  - `skills/shadcn` — UI-компоненти
  - `skills/supabase-postgres-best-practices` — практики роботи з базою
- 🌐 Адаптивний дизайн UI з Tailwind CSS та Shadcn UI
- 🧩 Агентська розробка з AntiGravity для автоматизації коду
- 🛠 MCP сервіси для інтеграції зовнішніх інструментів та API
- 🗄 Робота з базою даних через Supabase/Postgres

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
- AntiGravity для агентської розробки
- MCP (Model Context Protocol) сервіси для інтеграцій
- Skills та Rules для автоматизації коду

## 🏗 Project Structure

- `.agents/rules` — правила та стандарти проекту  
- `.agents/skills` — модулі для роботи з UI, базою, API  
- `app/` — сторінки Next.js  
- `components/` — React компоненти  
- `lib/` — допоміжні функції та налаштування  

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

Створіть файл .env.local з наступними змінними:

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET="your_nextauth_secret"

### 4. Run the App

```bash
npm run dev
```