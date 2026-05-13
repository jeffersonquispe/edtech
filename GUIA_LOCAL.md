# Guía de Ejecución Local — EdTech

## Prerequisitos

- Node.js 20+ en `C:\nodejs-20\` (ya instalado)
- Supabase configurado con keys en `.env.local` de ambos proyectos
- Migraciones SQL aplicadas (ya hechas)
- Trigger `handle_new_user` corregido (ver sección Troubleshooting)

---

## Arquitectura local

```
Navegador (http://localhost:3000)
        │
        ▼
  Frontend Next.js           ← puerto 3000
  (frontend/)
        │  fetch con credentials (cookies)
        ▼
  Backend API Next.js        ← puerto 3001
  (backend/app/api/**)
        │
        ▼
  Supabase (cloud)           ← vkizdtzdiberhsdqelja.supabase.co
```

---

## Paso 1 — Abrir dos terminales PowerShell

### Terminal 1: Backend (puerto 3001)

```powershell
$env:PATH = "C:\nodejs-20;$env:PATH"
cd C:\Users\Jeff\Desktop\edtech\backend
npm run dev
```

> El puerto 3001 ya está en `package.json` → `"dev": "next dev --port 3001"`

Verás:
```
▲ Next.js 16.x.x (Turbopack)
- Local: http://localhost:3001
✓ Ready in 1.2s
```

### Terminal 2: Frontend (puerto 3000)

```powershell
$env:PATH = "C:\nodejs-20;$env:PATH"
cd C:\Users\Jeff\Desktop\edtech\frontend
npm run dev
```

Verás:
```
▲ Next.js 16.x.x (Turbopack)
- Local: http://localhost:3000
✓ Ready in 1.5s
```

---

## Paso 2 — Variables de entorno requeridas

### `backend/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://vkizdtzdiberhsdqelja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZraXpkdHpkaWJlcmhzZHFlbGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyODc2MTcsImV4cCI6MjA5Mzg2MzYxN30.rQVMv9pZyWzVwJuxi1G4dI9W4-8hButRfCXu-oWjfZo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZraXpkdHpkaWJlcmhzZHFlbGphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODI4NzYxNywiZXhwIjoyMDkzODYzNjE3fQ.SLMIFsYS1Q91I5y4W4KkBa-jrCsX26g4Cv62rXIlFso
```

### `frontend/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://vkizdtzdiberhsdqelja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZraXpkdHpkaWJlcmhzZHFlbGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyODc2MTcsImV4cCI6MjA5Mzg2MzYxN30.rQVMv9pZyWzVwJuxi1G4dI9W4-8hButRfCXu-oWjfZo
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

---

## Paso 3 — Usar la plataforma desde el navegador

Abre **http://localhost:3000**

### Flujo Instructor
1. `/signup` → crear cuenta con rol **Instructor**
2. `/dashboard/instructor` → clic en **+ Nuevo Curso**
3. Editar el curso → marcar **Publicar curso** → Guardar
4. Agregar lecciones con título, URL de video (YouTube embed) y contenido markdown

### Flujo Estudiante
1. `/signup` → crear cuenta con rol **Estudiante**
2. `/` → ver listado de cursos publicados
3. Clic en un curso → botón **Inscribirse al curso**
4. `/dashboard/student` → ver mis cursos
5. **Continuar →** → `/learn/[courseId]` → ver lecciones

---

## Paso 4 — Probar el API con curl

### Obtener token de autenticación

```powershell
$SUPABASE_URL = "https://vkizdtzdiberhsdqelja.supabase.co"
$ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZraXpkdHpkaWJlcmhzZHFlbGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyODc2MTcsImV4cCI6MjA5Mzg2MzYxN30.rQVMv9pZyWzVwJuxi1G4dI9W4-8hButRfCXu-oWjfZo"

$resp = Invoke-RestMethod `
  -Uri "$SUPABASE_URL/auth/v1/token?grant_type=password" `
  -Method POST `
  -Headers @{ "apikey" = $ANON_KEY; "Content-Type" = "application/json" } `
  -Body '{"email":"instructor@test.com","password":"test123456"}'

$token = $resp.access_token
```

> **IMPORTANTE:** usar siempre `Authorization: Bearer $token`, NO `Cookie: sb-access-token`.
> El backend soporta Bearer token para curl y cookies de sesión para el navegador.

### Crear curso

```powershell
curl -X POST http://localhost:3001/api/courses `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{"title":"Curso de Python","description":"Aprende Python desde cero","price":49.99}'
```

### Listar cursos publicados

```powershell
curl http://localhost:3001/api/courses
```

### Publicar un curso

```powershell
curl -X PATCH "http://localhost:3001/api/courses/<COURSE_ID>" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $token" `
  -d '{"is_published": true}'
```

### Inscribirse a un curso

```powershell
curl -X POST "http://localhost:3001/api/courses/<COURSE_ID>/enroll" `
  -H "Authorization: Bearer $token"
# Segunda llamada al mismo curso → 409 Conflict
```

### Ver lecciones

```powershell
curl "http://localhost:3001/api/courses/<COURSE_ID>/lessons" `
  -H "Authorization: Bearer $token"
# Devuelve [] si no hay lecciones o no estás inscrito — nunca 403
```

### Consultar categorías

```powershell
curl "$SUPABASE_URL/rest/v1/categories?select=id,name" `
  -H "apikey: $ANON_KEY"
```

---

## Endpoints disponibles

| Método | URL | Auth | Descripción |
|--------|-----|------|-------------|
| GET | `/api/courses` | No | Cursos publicados (acepta `?category=uuid`) |
| POST | `/api/courses` | Instructor | Crear curso |
| PATCH | `/api/courses/<id>` | Instructor dueño | Editar curso (parcial) |
| POST | `/api/courses/<id>/enroll` | Estudiante | Inscribirse (409 si ya inscrito) |
| GET | `/api/courses/<id>/lessons` | Inscrito | Ver lecciones ([] si no inscrito) |

---

## Páginas del frontend

| Ruta | Rol | Descripción |
|------|-----|-------------|
| `/` | Público | Listado de cursos publicados |
| `/login` | Público | Iniciar sesión |
| `/signup` | Público | Crear cuenta (elige rol al registrarse) |
| `/courses/[id]` | Público | Detalle del curso + botón inscripción |
| `/dashboard/student` | Estudiante | Mis cursos inscritos |
| `/learn/[courseId]` | Estudiante inscrito | Ver lecciones (video + markdown) |
| `/dashboard/instructor` | Instructor | Mis cursos + crear nuevo |
| `/dashboard/instructor/courses/[id]` | Instructor dueño | Editar curso, publicar, gestionar lecciones |

---

## Datos seed disponibles

### Categorías (5)
```
Desarrollo Web   → slug: desarrollo-web
Data Science     → slug: data-science
DevOps           → slug: devops
Diseno UI/UX     → slug: diseno-ui-ux
Mobile           → slug: mobile
```

---

## Scripts de inicio rápido

### `start-backend.ps1`
```powershell
$env:PATH = "C:\nodejs-20;$env:PATH"
Set-Location "C:\Users\Jeff\Desktop\edtech\backend"
npm run dev
```

### `start-frontend.ps1`
```powershell
$env:PATH = "C:\nodejs-20;$env:PATH"
Set-Location "C:\Users\Jeff\Desktop\edtech\frontend"
npm run dev
```

Ejecutar: clic derecho → "Run with PowerShell"

---

## Troubleshooting

### "Port 3001 already in use"
```powershell
Get-Process -Name node | Stop-Process -Force
```

### "Database error creating new user" al registrarse
El trigger tiene un bug de search_path. Aplicar en Supabase Studio → SQL Editor:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### `{"error":"Unauthorized"}` en curl
Usar `Authorization: Bearer $token` — no `Cookie: sb-access-token`.

### `{"error":"Invalid API key"}` al pedir token
La anon key es incorrecta o antigua. Usar la de `backend/.env.local`.

### `{"error":"Internal error"}` al crear curso con categoría
Asegurarse de pasar un UUID real de categoría (no texto literal).
Obtener UUIDs con: `curl "$SUPABASE_URL/rest/v1/categories?select=id,name" -H "apikey: $ANON_KEY"`

### Warning "middleware deprecated" en el frontend
Ya corregido: `middleware.ts` renombrado a `proxy.ts` (convención Next.js 16).

### CORS error en el navegador
El backend permite `http://localhost:3000`. Si cambias el puerto del frontend,
actualizar `backend/next.config.ts`:
```ts
{ key: "Access-Control-Allow-Origin", value: "http://localhost:XXXX" }
```

### "NEXT_PUBLIC_SUPABASE_URL is undefined"
Verificar que existe `.env.local` en ambos proyectos:
```powershell
ls C:\Users\Jeff\Desktop\edtech\backend\.env*
ls C:\Users\Jeff\Desktop\edtech\frontend\.env*
```
