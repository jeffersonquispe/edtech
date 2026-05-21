# 🔧 Recomendaciones de mejoras — Testing del EdTech Platform

## Resumen ejecutivo

La estructura de testing está completa y lista para usar. Se han identificado **3 áreas principales** donde mejorar la experiencia de testing y aumentar cobertura.

---

## 1. 📁 Organización de archivos — MEJORA RECOMENDADA

**Estado actual:**
```
backend/
├── lib/errors.test.ts           ← ✅ Co-ubicado con el código
├── app/api/
│   └── courses/
│       └── route.ts
└── __tests__/                   ← ❌ Duplicidad innecesaria
    └── api/
        └── courses.test.ts      ← Lejos del código fuente
```

**Problema:**
- Los tests están en dos lugares diferentes
- Hace difícil navegar entre código y tests
- Inconsistencia entre backend y frontend

**Solución recomendada:**
```
backend/
├── lib/
│   ├── errors.ts
│   └── errors.test.ts           ← Co-ubicado ✅
├── app/api/
│   ├── courses/
│   │   ├── route.ts
│   │   └── route.test.ts        ← Co-ubicado ✅
│   ├── courses/[id]/
│   │   ├── route.ts
│   │   └── route.test.ts
│   └── courses/[id]/enroll/
│       ├── route.ts
│       └── route.test.ts
```

**Cambio recomendado en jest.config.js:**
```javascript
testMatch: [
  '**/*.test.ts',     // ← Buscar tests junto al código
  '**/*.spec.ts',
  '__tests__/**/*.ts',  // ← Mantener para tests integración
],
```

**Beneficio:**
- IDE mostrará el test inmediatamente cuando abras el archivo
- Más fácil mantener tests sincronizados con cambios
- Patrón estándar en JavaScript moderno

---

## 2. 🧪 Helpers de testing compartidos — MEJORA RECOMENDADA

**Estado actual:**
- Cada test re-implementa el mock de Supabase
- Código duplicado en múltiples archivos de test
- Cambios al mock requieren actualizar todos los tests

**Solución — Crear `jest.helpers.ts` en backend:**

```typescript
// backend/__tests__/helpers/supabase-mocks.ts
import { jest } from '@jest/globals'

export const createMockSupabaseClient = (overrides = {}) => ({
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    ...overrides,
  }),
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
  },
})

export const createMockAuthUser = (overrides = {}) => ({
  data: {
    user: {
      id: 'user-123',
      email: 'test@example.com',
      ...overrides,
    },
  },
  error: null,
})

export const createMockPostgresError = (code: string, message = 'DB error') => ({
  code,
  message,
  constraint: 'test_constraint',
})
```

**Uso en tests:**

```typescript
// Antes (código duplicado)
mockCreateClient.mockResolvedValue({
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ data: courses, error: null }),
    }),
  }),
})

// Después (usando helper)
import { createMockSupabaseClient } from '@/__tests__/helpers/supabase-mocks'

mockCreateClient.mockResolvedValue(
  createMockSupabaseClient({
    select: () => ({
      eq: () => Promise.resolve({ data: courses, error: null }),
    }),
  })
)
```

**Beneficio:**
- Reducir duplicidad de código en ~30%
- Cambios al mock en un solo lugar
- Tests más legibles

---

## 3. 🎭 Test Fixtures — MEJORA RECOMENDADA

**Estado actual:**
- Datos de test hardcodeados en cada test (`mockCourses = [{ id: '1', ... }]`)
- Datos inconsistentes entre tests
- Difícil cambiar datos de test globalmente

**Solución — Crear factories:**

```typescript
// backend/__tests__/fixtures/courses.fixture.ts
export const createMockCourse = (overrides = {}) => ({
  id: 'course-123',
  title: 'Next.js Pro',
  description: 'Learn Next.js',
  price: 29.99,
  is_published: true,
  instructor_id: 'user-456',
  category_id: 'cat-789',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const createMockLesson = (overrides = {}) => ({
  id: 'lesson-1',
  course_id: 'course-123',
  title: 'Introduction',
  content_md: '# Intro',
  video_url: null,
  position: 1,
  created_at: new Date().toISOString(),
  ...overrides,
})

export const createMockEnrollment = (overrides = {}) => ({
  id: 'enroll-1',
  student_id: 'student-123',
  course_id: 'course-123',
  created_at: new Date().toISOString(),
  ...overrides,
})

// Uso en tests
const course = createMockCourse({ title: 'Python Basics' })
const lessons = [
  createMockLesson({ position: 1 }),
  createMockLesson({ position: 2, title: 'Advanced' }),
]
```

**Beneficio:**
- Tests más legibles (menos boilerplate)
- Datos más realistas y completos
- Fácil mantener cambios de schema

---

## 4. 🔄 Integración tests — NUEVA SUGERENCIA

**Estado actual:**
- Tests unitarios de endpoints aislados
- Sin tests de flujos completos (login → enroll → ver lecciones)

**Sugerencia — Crear integration tests:**

```typescript
// backend/__tests__/integration/enrollment-flow.test.ts
describe('Enrollment Flow Integration', () => {
  it('estudiante puede ver lecciones después de inscribirse', async () => {
    // 1. Get cursos publicados
    const coursesRes = await GET(new NextRequest('...'))
    const courses = await coursesRes.json()
    
    // 2. POST enroll
    const enrollRes = await POST(
      new NextRequest('...'),
      { params: Promise.resolve({ id: courses[0].id }) }
    )
    expect(enrollRes.status).toBe(201)
    
    // 3. GET lessons (ahora visible debido a RLS)
    const lessonsRes = await GET(
      new NextRequest('...'),
      { params: Promise.resolve({ id: courses[0].id }) }
    )
    const lessons = await lessonsRes.json()
    expect(lessons.length).toBeGreaterThan(0)
  })
})
```

**Beneficio:**
- Detecta bugs que los tests unitarios pierden
- Valida RLS en contexto real
- Aumenta confianza antes de deployment

---

## 5. 🎯 Test Patterns recomendados — GUÍA

### Patrón A: Tests por dominio (actual ✅)
```
lib/errors.test.ts      ← Funciones utilitarias
api/courses.test.ts     ← Endpoints
components/login.test.ts ← Componentes
```

### Patrón B: Tests por característica (alternativa)
```
__tests__/courses/
  ├── create.test.ts
  ├── enroll.test.ts
  ├── lessons.test.ts
__tests__/auth/
  ├── login.test.ts
  ├── logout.test.ts
```

**Recomendación:** Mantener Patrón A (actual) pero mover `__tests__` files junto al código.

---

## 6. 📊 Cobertura targets — MEJORA RECOMENDADA

**Propuesta de thresholds en jest.config.js:**

```javascript
module.exports = {
  // ... otros config
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,      // Al menos 70% de branches
      functions: 75,     // Al menos 75% de funciones
      lines: 75,         // Al menos 75% de líneas
      statements: 75,
    },
    './lib/errors.ts': {
      lines: 100,        // Función crítica: 100%
    },
    './app/api/': {
      lines: 80,         // APIs: 80%
    },
  },
}
```

**Beneficio:**
- Previene merges con cobertura insuficiente
- Establece expectativas claras
- Mejora seguridad del código

---

## 7. 🚀 Scripts útiles a agregar — MEJORA RECOMENDADA

**En backend/package.json:**

```json
{
  "scripts": {
    "test": "jest --watch",
    "test:run": "jest",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

**En frontend/package.json:**

```json
{
  "scripts": {
    "test": "vitest --watch",
    "test:run": "vitest run",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage",
    "test:ci": "vitest run --coverage --reporter=verbose"
  }
}
```

---

## 📈 Hoja de ruta — Próximas 4 semanas

### Semana 1 (esta semana) ✅ COMPLETADO
- [x] Configurar Jest (backend)
- [x] Configurar Vitest (frontend)
- [x] Tests base para funciones críticas
- [x] Tests de endpoint GET/POST/PATCH

### Semana 2
- [ ] Reorganizar tests junto al código
- [ ] Crear helpers y fixtures
- [ ] Agregar tests de PATCH `/api/courses/[id]`
- [ ] Tests para Dashboard componentes

### Semana 3
- [ ] Integration tests de flows completos
- [ ] Tests de error handling
- [ ] Cobertura al 75%+ en APIs

### Semana 4
- [ ] Tests para widget Edy
- [ ] Tests para Reviews
- [ ] Setup CI/CD con GitHub Actions

---

## ✨ Checklist de implementación

- [x] Jest configurado en backend
- [x] Vitest configurado en frontend
- [x] 4 tests de errors mapeados
- [x] 7 tests para endpoints GET/POST
- [x] 5 tests para componentes Auth
- [ ] Reorganizar archivos de tests (Semana 2)
- [ ] Crear helpers de mocks (Semana 2)
- [ ] Alcanzar 70%+ cobertura (Semana 3)
- [ ] Integration tests (Semana 3)
- [ ] CI/CD pipeline (Semana 4)

---

**Conclusión:**

El proyecto tiene una base sólida de testing. Las recomendaciones anteriores **mejoran mantenibilidad**, **reducen duplicidad** y **aumentan confianza** en el código. Priorizar la reorganización de archivos (recomendación #1) antes de agregar muchos más tests.

---

**Última actualización:** 2026-05-18  
**Status:** 🟢 Listo para implementar mejoras
