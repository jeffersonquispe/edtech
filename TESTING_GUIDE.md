# 📋 Guía de Testing — EdTech Platform

## Estado actual

✅ **Configurado:**
- Backend: Jest + Supertest
- Frontend: Vitest + React Testing Library
- Scripts de test en ambos `package.json`

**Tests creados:**
- Backend: `lib/errors.test.ts`, `__tests__/api/courses.test.ts`, `__tests__/api/courses/enroll.test.ts`, `__tests__/api/courses/lessons.test.ts`
- Frontend: `app/login/page.test.tsx`, `app/_components/logout-button.test.tsx`

---

## 🚀 Cómo ejecutar tests

### Backend (Jest)
```bash
cd backend
npm install                 # Instala dependencias (jest, ts-jest, supertest)
npm run test               # Watch mode
npm run test:run           # Ejecución única
npm run test:coverage      # Reporte HTML en ./coverage
```

### Frontend (Vitest)
```bash
cd frontend
npm install                 # Instala dependencias (vitest, testing-library, jsdom)
npm run test               # Watch mode
npm run test:run           # Ejecución única
npm run test:ui            # Interfaz gráfica en browser
npm run coverage           # Reporte HTML en ./coverage
```

---

## 📊 Cobertura esperada vs. actual

| Módulo | Cobertura esperada | Tests creados | Siguiente paso |
|---|---|---|---|
| `backend/lib/errors.ts` | 100% | ✅ 6 tests | Completada |
| `backend/app/api/courses/route.ts` | 80% | ✅ 7 tests (GET + POST) | Agregar validaciones de body |
| `backend/app/api/courses/[id]/enroll/route.ts` | 100% | ✅ 4 tests | Completada |
| `backend/app/api/courses/[id]/lessons/route.ts` | 100% | ✅ 4 tests | Completada |
| `backend/app/api/courses/[id]/route.ts` (PATCH) | 0% | ❌ Pendiente | Crear tests |
| `frontend/app/login/page.tsx` | 70% | ✅ 5 tests | Agregar validaciones de email |
| `frontend/app/_components/logout-button.tsx` | 100% | ✅ 3 tests | Completada |
| `frontend/app/dashboard/` | 0% | ❌ Pendiente | Crear suite de tests |
| `frontend/app/_components/enroll-button.tsx` | 0% | ❌ Pendiente | Crear tests |

---

## 🎯 Próximos pasos prioritarios

### Tier 1 — Crítico (terminar esta semana)

1. **Backend — PATCH `/api/courses/[id]`**
   - Tests para actualización de curso
   - Validar que solo el instructor dueño puede editar
   - Validar RLS bloquea si no es dueño

2. **Frontend — Dashboard Instructor**
   - Tests para `CreateCourseForm`
   - Tests para `EditCourseForm`
   - Tests para `LessonsManager`

3. **Frontend — Componentes de lista de cursos**
   - Tests para filtrado por categoría
   - Tests para enroll button

### Tier 2 — Importante (próximas 2 semanas)

4. **Backend — Validación de input en endpoints**
   - Validar estructura de `body` en POST/PATCH
   - Tests para campos requeridos
   - Tests para tipo de datos incorrecto

5. **Frontend — Dashboard Estudiante**
   - Tests para `CourseCard`
   - Tests para `LessonViewer`
   - Tests para estado de inscripción

6. **Integración E2E** (con Playwright)
   - Flow de login + inscripción + ver lecciones
   - Flow de creación de curso por instructor

### Tier 3 — Mejoras (próximo mes)

7. **Widget Edy**
   - Tests para conexión LiveKit
   - Tests de manejo de errores

8. **Reviews**
   - Tests para crear/editar/eliminar reseñas
   - Tests para star rating

---

## ✅ Patrones a seguir

### Pattern 1: Mock de Supabase (Backend)

```typescript
// lib/errors.test.ts — Función pura (sin Supabase)
import { mapPostgresError } from './errors'

describe('mapPostgresError', () => {
  it('mapea código 23505 a 409', () => {
    const result = mapPostgresError({ code: '23505' })
    expect(result.status).toBe(409)
  })
})
```

```typescript
// __tests__/api/courses.test.ts — Route Handler con Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
  getAuthUser: jest.fn(),
}))

describe('GET /api/courses', () => {
  it('devuelve cursos publicados', async () => {
    const mockQuery = {
      eq: jest.fn().mockResolvedValue({ 
        data: [{...}], 
        error: null 
      }),
    }

    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue(mockQuery),
      }),
    })

    const result = await GET(req)
    expect(result.status).toBe(200)
  })
})
```

### Pattern 2: Test de componentes React (Frontend)

```typescript
// app/login/page.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

describe('LoginPage', () => {
  it('ejecuta login exitoso', async () => {
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@example.com' } 
    })
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })
})
```

### Pattern 3: AAA (Arrange-Act-Assert)

```typescript
it('debe hacer algo', async () => {
  // Arrange: preparar datos y mocks
  const mockData = [{ id: '1', title: 'Test' }]
  mockSupabase.from.mockReturnValue({ ... })

  // Act: ejecutar la función/componente
  const result = await fetchCourses()

  // Assert: verificar el resultado
  expect(result).toEqual(mockData)
})
```

---

## 🐛 Errores comunes y soluciones

| Error | Causa | Solución |
|---|---|---|
| `Cannot find module '@/lib/api'` | Alias `@/` no configurado | Verificar `jsconfig.json` / `tsconfig.json` |
| Mock de Supabase no aplica | `jest.mock()` no está en top-level | Mover a inicio del archivo |
| `act()` warning en waitFor | Actualización de estado asíncrona | Usar `waitFor(() => expect(...))` |
| Test pasa solo, falla en grupo | Estado compartido entre tests | Agregar `beforeEach(() => jest.clearAllMocks())` |
| RLS devuelve `[]`, no error | Comportamiento esperado en Supabase | Testear que array vacío es correcto |

---

## 📈 Métricas de cobertura esperadas

```
lib/errors.ts          → 100% (función pura)
lib/supabase/server.ts → 60% (principalmente mocked)
app/api/courses/       → 70% (endpoints testados)
app/login/             → 70% (componente cliente)
app/dashboard/         → 40% (por ampliar)
```

Generar reporte:
```bash
# Backend
cd backend && npm run test:coverage

# Frontend
cd frontend && npm run coverage
```

---

## 🔒 Consideraciones de seguridad en tests

- **Nunca mockear RLS** — asumimos que Supabase lo maneja
- **Siempre testear acceso denegado** — incluir casos donde RLS devuelve `[]`
- **No commitear `.env.local` en fixtures** — usar valores de ejemplo
- **Testear mapeo de errores** — asegurar que no exponemos detalles internos

---

## 🚦 CI/CD — Próximos pasos

Cuando se integre con GitHub Actions:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Test Backend
        run: cd backend && npm install && npm run test:run

      - name: Test Frontend
        run: cd frontend && npm install && npm run test:run

      - name: Coverage
        run: |
          cd backend && npm run test:coverage
          cd frontend && npm run coverage
```

---

## 📚 Referencias

- [Vitest Docs](https://vitest.dev/)
- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supabase Testing Guide](https://supabase.com/docs/guides/testing)

---

**Última actualización:** 2026-05-18  
**Autor:** Claude Code  
**Estado:** 🟢 Configuración completa, tests base listos
