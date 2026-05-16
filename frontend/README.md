# EdTech Frontend — Plataforma de Cursos Online

Una plataforma moderna de cursos online construida con **Next.js 14+**, **TypeScript**, **Tailwind CSS 4**, y **Supabase**.

## 🚀 Quick Start

### Requirements
- **Node.js 20.9.0+** (required for Next.js 16+)
- npm o yarn

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm run start
```

## 🎨 Design System

### Fonts
- **Headings**: [Sora](https://fonts.google.com/specimen/Sora) — geometric, distinctive, modern
- **Body**: [DM Sans](https://fonts.google.com/specimen/DM+Sans) — clean, readable, friendly

### Color Palette
- **Background**: Warm cream `#F6F4F0`
- **Primary text**: Deep near-black `#141415`
- **Brand accent**: Vibrant indigo `#5B4FFF` (CTAs, badges, highlights)
- **Warm accent**: Coral `#FF6C3D` (used sparingly for warmth)
- **Card**: Pure white with subtle shadows

### UI Features
- ✨ **Smooth animations**: Staggered fade-in, card hover lifts, smooth transitions
- 🎯 **Interactive feedback**: Button press effects, focus rings in brand color
- 🌈 **Gradient accents**: Purple hero section, colorful card top stripes
- 📱 **Responsive design**: Mobile-first, optimized for all screen sizes

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx                    # Home (course listing with hero)
│   ├── layout.tsx                  # Root layout with fonts
│   ├── globals.css                 # Global styles, animations, theme
│   ├── _components/                # Shared components
│   │   ├── navbar.tsx
│   │   └── logout-button.tsx
│   ├── courses/[id]/              # Course detail page
│   │   ├── page.tsx
│   │   └── _components/enroll-button.tsx
│   ├── dashboard/
│   │   ├── student/page.tsx       # My Courses (enrolled)
│   │   └── instructor/page.tsx    # My Courses (created)
│   ├── learn/[courseId]/page.tsx  # Lesson viewing
│   ├── login/page.tsx             # Authentication
│   └── signup/page.tsx
├── lib/
│   ├── api.ts                     # API client
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   └── server.ts              # Server client
│   └── utils.ts
├── types/database.ts              # Supabase types
└── package.json
```

## 🔐 Authentication & Authorization

- **Auth**: Supabase Auth (email + password)
- **Authorization**: Row Level Security (RLS) policies in Supabase
- **Roles**: `student` or `instructor`
- **Session**: Managed via cookies (SSR-compatible)

## 🗄️ Database

Connected to Supabase PostgreSQL with 6 tables:
- `profiles` — User extended data (role, name, avatar)
- `categories` — Course categories
- `courses` — Course listings
- `lessons` — Lesson content (video + markdown)
- `enrollments` — Student course registrations
- `reviews` — Course reviews (UI pending)

All tables use **Row Level Security** for authorization.

## 📝 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## 🛠️ Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + custom animations
- **UI Components**: Shadcn/ui (base-nova style)
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Icons**: Lucide React

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [CLAUDE.md](../CLAUDE.md) — Full project documentation

## 📝 Recent Updates (Phase 3 — UI Polish)

### ✨ Design Improvements
- Complete visual redesign with warm, professional aesthetic
- Distinctive font pairing (Sora + DM Sans)
- Vibrant indigo brand accent (`#5B4FFF`)
- Smooth animations & micro-interactions
- Improved card design with hover effects
- Beautiful gradient hero section on home page
- Polished auth forms with accent stripes
- Better dashboard layouts with stats & improved cards

### 🎬 Pages Improved
- ✅ Home page (hero + course grid with staggered animations)
- ✅ Navbar (glass effect, branded logo icon)
- ✅ Login / Signup (centered cards with accent stripe)
- ✅ Course detail (styled sidebar with gradient)
- ✅ Student dashboard (enrolled courses with new cards)
- ✅ Instructor dashboard (course management with stats)
- ✅ Learn page (lesson cards with number badges)

---

**Built with ❤️ for EdTech**
