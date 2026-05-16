# EdTech — Plataforma de Cursos Online

Plataforma completa estilo **Udemy/Gumroad** construida con **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, y **Supabase**.

## ⚠️ Requirements

- **Node.js 20.9.0+** (required for Next.js 16+)
- npm, yarn, or pnpm
- Supabase account (free tier works)

## 🎯 Features

### 👨‍🎓 For Students
- 📚 Browse published course catalog
- 🔑 Sign up and enroll in courses
- 📖 Watch embedded videos + read markdown content
- 📊 Dashboard with enrolled courses
- 🔐 Secure authentication

### 👨‍🏫 For Instructors
- ✏️ Create and edit courses
- 📝 Manage lessons (add, edit, delete)
- 🚀 Publish/unpublish courses
- 📈 View enrollment statistics

## ⚡ Quick Start

### 1. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend (optional)
cd ../backend
npm install
```

### 2. Environment Setup

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

**Backend** (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run Development Servers

**Frontend** (required):
```bash
cd frontend
npm run dev
```
→ Opens http://localhost:3000

**Backend** (optional):
```bash
cd backend
npm run dev
```
→ API at http://localhost:3001

## 📋 Project Status

### ✅ Phase 0 — Setup
- Git repository initialized
- Monorepo structure (backend + frontend)
- Supabase integration

### ✅ Phase 1 — Database
- 6 SQL migrations with RLS policies
- Complete schema (profiles, categories, courses, lessons, enrollments, reviews)
- Row-level security for authorization

### ✅ Phase 2 — Backend API
- 5 REST endpoints for course management
- Supabase client utilities
- Error handling & validation

### ✅ Phase 3 — Frontend & UI Polish
- ✨ **Complete visual redesign** with premium aesthetic
- 🎨 **Distinctive design system**: Sora + DM Sans fonts, indigo accent color
- 📚 **All pages implemented**: Home, courses, dashboard, auth, lessons
- 🎬 **Smooth animations**: Staggered cards, hover effects, micro-interactions
- 📱 **Responsive design**: Mobile-first, optimized for all screens

**New in Phase 3:**
- Warm cream background (`#F6F4F0`)
- Brand indigo accent (`#5B4FFF`) on all CTAs
- Frosted glass navbar with branded logo
- Gradient purple hero section
- Polished auth forms with accent stripes
- Card hover animations & staggered fade-in
- Better dashboards with stats & improved layouts

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | Next.js Route Handlers |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **UI** | Shadcn/ui, Lucide Icons |
| **Styling** | Tailwind CSS 4 + custom animations |

## 📂 Project Structure

```
edtech/
├── frontend/                    # Next.js 16 web app
│   ├── app/
│   │   ├── page.tsx            # Home (hero + course grid)
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Tailwind + animations
│   │   ├── login/page.tsx      # Authentication
│   │   ├── signup/page.tsx
│   │   ├── courses/[id]/       # Course detail
│   │   ├── dashboard/          # Student & instructor dashboards
│   │   ├── learn/[courseId]/   # Lesson viewing
│   │   └── _components/        # Navbar, buttons, etc.
│   ├── lib/
│   │   ├── supabase/           # Client & server clients
│   │   └── api.ts              # API utilities
│   └── types/database.ts       # Generated Supabase types
│
├── backend/                    # Next.js API (optional)
│   └── app/api/courses/        # Endpoints
│
├── CLAUDE.md                   # Complete architecture docs
├── DATA_MODEL.md               # Database schema
├── SETUP_SUPABASE.md           # Setup guide
└── README.md                   # This file
```

## 📚 Documentation

- **[frontend/README.md](./frontend/README.md)** — Frontend setup & design system
- **[CLAUDE.md](./CLAUDE.md)** — Architecture, API contracts, RLS policies
- **[DATA_MODEL.md](./DATA_MODEL.md)** — Database schema & relationships
- **[SETUP_SUPABASE.md](./SETUP_SUPABASE.md)** — Supabase configuration

## 🎨 Design System

### Fonts
- **Headings**: [Sora](https://fonts.google.com/specimen/Sora) — geometric, distinctive
- **Body**: [DM Sans](https://fonts.google.com/specimen/DM+Sans) — clean, readable

### Colors
- **Background**: Warm cream `#F6F4F0`
- **Brand accent**: Vibrant indigo `#5B4FFF`
- **Text**: Deep `#141415`

### Features
- ✨ Smooth animations
- 🎯 Hover effects & feedback
- 🌈 Gradient accents
- 📱 Mobile-responsive

## 🔐 Authentication & Security

- **Auth**: Supabase Auth (email + password)
- **Authorization**: Row Level Security (RLS) in PostgreSQL
- **Session**: Secure cookies (SSR-compatible)
- **API Protection**: RLS policies enforce authorization server-side

## 🚀 Next Steps

- [ ] Payment integration (Stripe)
- [ ] Course progress tracking
- [ ] Reviews & ratings (UI)
- [ ] Search & filtering
- [ ] User profile settings
- [ ] Certificates
- [ ] Discussion forums

## 📝 Development

### Run Tests
```bash
npm run test
```

### Build for Production
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## 🤝 Contributing

See [CLAUDE.md](./CLAUDE.md) for development guidelines and project conventions.

---

**Built with ❤️ for EdTech learners everywhere**

*Last updated: May 2026 — Phase 3 Complete ✨*
