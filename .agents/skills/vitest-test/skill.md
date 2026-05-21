---
name: vitest-testing
description: >
  Aplica cuando escribas tests, agregues cobertura,
  generes specs o hagas TDD con Vitest en el proyecto EdTech
  (Next.js 16 + Supabase + TypeScript).
  Trigger: "escribe tests", "agrega cobertura", "test para",
  "testea este componente", "mock de supabase".
---

# Guía Vitest — Proyecto EdTech

## Stack del proyecto

- **Framework:** Vitest + React Testing Library
- **App:** Next.js 16 · TypeScript · Tailwind CSS 4 · Supabase
- **Patrón:** AAA (Arrange, Act, Assert)
- **Archivos:** `*.test.ts` / `*.spec.ts` colocados junto al código fuente
- **Alias de importación:** `@/` apunta a `edtech/frontend/`

---

## Comandos

```bash
npm run test          # correr todos los tests una vez
npm run test:ui       # abrir Vitest UI en el browser
npm run coverage      # reporte de cobertura HTML
npx vitest run --reporter=verbose   # salida detallada en CI
```

---

## Reglas generales

- Testear **comportamiento**, NO implementación interna
- Incluir siempre **caso feliz**, **caso de error** y **caso borde**
- Mocks con `vi.mock()` — nunca `jest.mock()`
- Queries de accesibilidad con `getByRole`, `getByLabelText`
- Nunca usar `getByTestId` en tests unitarios (solo en E2E con Playwright)

---

## Estructura de carpetas

```
edtech/frontend/
├── app/
│   ├── login/
│   │   ├── page.tsx
│   │   └── page.test.tsx        ← test del componente Login
│   └── dashboard/
│       ├── page.tsx
│       └── page.test.tsx
├── lib/
│   ├── api.ts
│   ├── api.test.ts              ← tests de fetchCourses, enrollInCourse, etc.
│   └── supabase/
│       ├── client.ts
│       └── client.test.ts
└── __tests__/                   ← tests de integración o compartidos
```

---

## Mock de Supabase

Siempre mockear el cliente de Supabase para aislar los tests del backend real.

```ts
// Patrón estándar para mockear Supabase en EdTech
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    auth: {
      getUser:    vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: null, error: null }),
      signOut:    vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}))
```

Para casos específicos, sobreescribir el mock dentro del test:

```ts
it('devuelve error si Supabase falla', async () => {
  vi.mocked(supabase.from).mockReturnValueOnce({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
  } as any)

  const result = await fetchPublishedCourses()
  expect(result).toEqual([])
})
```

---

## Tablas del proyecto y qué testear

| Tabla         | Función a testear          | Casos obligatorios                              |
|---------------|----------------------------|-------------------------------------------------|
| `courses`     | `fetchPublishedCourses()`  | devuelve cursos, devuelve [] si error, filtra no publicados |
| `enrollments` | `enrollInCourse()`         | inscripción OK, duplicado → 409, curso no existe |
| `lessons`     | `fetchLessons()`           | devuelve lecciones si inscrito, [] si no inscrito (RLS) |
| `profiles`    | `getUserProfile()`         | devuelve perfil, null si no autenticado         |
| `auth`        | `loginUser()`              | login OK, credenciales incorrectas, email vacío |

---

## Plantillas por tipo de test

### Test de función utilitaria (`lib/api.ts`)

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchPublishedCourses } from '@/lib/api'

vi.mock('@/lib/supabase/client', () => ({ /* mock estándar */ }))

describe('fetchPublishedCourses', () => {
  beforeEach(() => vi.clearAllMocks())

  it('devuelve array de cursos publicados', async () => {
    // Arrange
    const mockCourses = [{ id: '1', title: 'Next.js Pro', is_published: true }]
    // ... configurar mock para devolver mockCourses

    // Act
    const result = await fetchPublishedCourses()

    // Assert
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Next.js Pro')
  })

  it('devuelve [] si Supabase retorna error', async () => {
    // ... configurar mock para devolver error
    const result = await fetchPublishedCourses()
    expect(result).toEqual([])
  })
})
```

### Test de componente React (`app/login/page.tsx`)

```ts
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LoginPage from '@/app/login/page'

describe('LoginPage', () => {
  it('muestra error si el email está vacío al enviar', async () => {
    // Arrange
    render(<LoginPage />)

    // Act — hacer clic sin completar el email
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))

    // Assert
    expect(screen.getByText(/email requerido/i)).toBeInTheDocument()
  })

  it('deshabilita el botón mientras carga', async () => {
    render(<LoginPage />)
    // ... completar campos y enviar
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeDisabled()
  })
})
```

### Test de RLS / acceso sin sesión

```ts
it('fetchLessons devuelve [] si el usuario no está inscrito', async () => {
  // Simula el comportamiento de RLS: Supabase devuelve array vacío (no 403)
  mockSupabase.from.mockReturnValueOnce({
    select: vi.fn().mockResolvedValue({ data: [], error: null }),
  })

  const result = await fetchLessons('course-id-123')

  expect(result).toEqual([])
  // IMPORTANTE: RLS devuelve [] silencioso, no lanza excepción
})
```

---

## Errores comunes en EdTech y cómo evitarlos

| Error en el test | Causa | Solución |
|---|---|---|
| `Cannot find module '@/lib/api'` | Alias `@/` no configurado | Agregar `resolve.alias` en `vitest.config.ts` |
| Mock de Supabase no aplica | `vi.mock()` fuera del scope del módulo | Mover `vi.mock()` al nivel superior del archivo |
| `act()` warning en componentes | Estado asíncrono sin envolver | Usar `await waitFor(() => ...)` de Testing Library |
| Test pasa solo o falla en grupo | Estado compartido entre tests | Agregar `beforeEach(() => vi.clearAllMocks())` |
| RLS devuelve `[]` pero se espera error | Comportamiento real de Supabase | Testear que el array está vacío, no que hay excepción |

---

## Cobertura mínima esperada para EdTech

```
lib/api.ts          → 80% líneas
lib/supabase/       → 70% líneas  
app/login/          → 70% líneas
app/dashboard/      → 60% líneas
```

Generar reporte y ver en browser:
```bash
npm run coverage
# Abre coverage/index.html para ver qué líneas faltan
```
