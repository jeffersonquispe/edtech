# ⚡ Quick Start — Playwright E2E Testing

Guía rápida para empezar con tests E2E en 5 minutos.

---

## 1️⃣ Instalar (2 minutos)

```bash
cd frontend
npm install
npx playwright install
```

---

## 2️⃣ Crear usuarios de prueba en Supabase (2 minutos)

Necesitas crear 2 usuarios en tu BD Supabase:

**Estudiante:**
- Email: `student@example.com`
- Password: `password123`
- En tabla `profiles`: role = `student`

**Instructor:**
- Email: `instructor@example.com`
- Password: `password123`
- En tabla `profiles`: role = `instructor`

---

## 3️⃣ Crear tu primer test (1 minuto)

Copia esto en `e2e/tests/auth.spec.ts`:

```typescript
import { test, expect } from '../fixtures/auth.fixture'
import { LoginPage } from '../pages/login.page'

test('puede hacer login como estudiante', async ({ studentPage }) => {
  await studentPage.goto('/')
  // ✅ Ya está autenticado como estudiante!
  expect(studentPage.url()).toContain('/')
})

test('login fallido con credenciales inválidas', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.login('wrong@example.com', 'wrong')
  await loginPage.expectErrorMessage()
})
```

---

## 4️⃣ Ejecutar test

```bash
# Inicia el servidor en otra terminal
npm run dev &

# En otra terminal, ejecuta el test
npm run test:e2e
```

**Resultado esperado:**
```
✓ can login as student (2.5s)
✓ login fails with invalid credentials (1.8s)

2 passed (4.3s)
```

---

## 📚 Ejemplos rápidos

### Login y ver cursos

```typescript
import { test } from '../fixtures/auth.fixture'
import { CoursesPage } from '../pages/courses.page'

test('ver cursos publicados', async ({ studentPage }) => {
  const coursesPage = new CoursesPage(studentPage)
  await coursesPage.goto()
  await coursesPage.expectCourseVisible('Next.js Pro')
})
```

### Enrollarse en un curso

```typescript
test('inscribirse en curso', async ({ studentPage }) => {
  const coursesPage = new CoursesPage(studentPage)
  await coursesPage.goto()
  await coursesPage.enrollInCourse('Python Basics')
  // Espera a que redirija a /learn/:id
})
```

### Ver lecciones

```typescript
import { LessonViewerPage } from '../pages/lesson-viewer.page'

test('ver lecciones después de inscribirse', async ({ studentPage }) => {
  const lessonPage = new LessonViewerPage(studentPage)
  await lessonPage.goToLessonByUrl('course-123')
  await lessonPage.expectLessonVisible()
})
```

### Dashboard instructor

```typescript
import { InstructorDashboardPage } from '../pages/instructor-dashboard.page'

test('instructor ve su dashboard', async ({ instructorPage }) => {
  const dashboard = new InstructorDashboardPage(instructorPage)
  await dashboard.goto()
  await dashboard.expectPageVisible()
  await dashboard.expectStatsVisible()
})
```

---

## 🎮 Modos de ejecución

### Modo normal (one-shot)
```bash
npm run test:e2e
```

### Modo UI (interfaz gráfica)
```bash
npm run test:e2e:ui
```
Se abre automáticamente en `http://localhost:3000`

### Modo debug (paso a paso)
```bash
npm run test:e2e:debug
```
Puedes pausar y avanzar paso a paso

### Ver reporte HTML
```bash
npx playwright show-report
```

---

## 🔍 Debugging rápido

```typescript
// Agregar pausa en medio de un test
test('mi test', async ({ page }) => {
  await page.pause()  // ⏸️ Se abre inspector interactivo
  // ...
})

// Tomar screenshot
await page.screenshot({ path: 'screenshot.png' })

// Log de red
page.on('response', response => {
  console.log(response.url(), response.status())
})
```

---

## 📋 Estructura de un test típico

```typescript
import { test, expect } from '../fixtures/auth.fixture'
import { CoursesPage } from '../pages/courses.page'

test('usuario puede filtrar cursos por categoría', async ({ studentPage }) => {
  // 1. ARRANGE — preparar datos
  const coursesPage = new CoursesPage(studentPage)
  
  // 2. ACT — ejecutar acciones
  await coursesPage.goto()
  await coursesPage.filterByCategoryId('programming')
  
  // 3. ASSERT — verificar resultados
  await coursesPage.expectCourseVisible('JavaScript Advanced')
})
```

---

## 🚀 Page Objects disponibles

Ya están creados, solo úsalos:

| Página | Uso |
|--------|-----|
| `LoginPage` | Tests de autenticación |
| `CoursesPage` | Catálogo y enrollment |
| `StudentDashboardPage` | Dashboard estudiante |
| `LessonViewerPage` | Visor de lecciones |
| `InstructorDashboardPage` | Dashboard instructor |
| `BasePage` | Métodos comunes (heredados) |

**Ejemplo:**
```typescript
import { LoginPage } from '../pages/login.page'
import { CoursesPage } from '../pages/courses.page'

const loginPage = new LoginPage(page)
const coursesPage = new CoursesPage(page)
```

---

## 🔐 Fixtures (pre-autenticación)

Ya no necesitas hacer login en cada test:

```typescript
// Sin fixture: necesitas hacer login
async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.login('student@example.com', 'password123')
  // ... test
}

// Con fixture: ya está autenticado
async ({ studentPage }) => {
  // ✅ Ya está logged como estudiante
  // ... test
}
```

**Fixtures disponibles:**
- `studentPage` — Pre-autenticado como estudiante
- `instructorPage` — Pre-autenticado como instructor
- `authenticatedPage` — Alias de studentPage
- `page` — Sin autenticación (para tests de login)

---

## ⚙️ Configuración personalizada

### Cambiar usuarios de prueba

Edita `e2e/fixtures/auth.fixture.ts`:

```typescript
export const testUsers = {
  student: {
    email: 'your-email@example.com',  // ← Cambia
    password: 'your-password',         // ← Cambia
  },
  instructor: {
    email: 'instructor@example.com',
    password: 'password123',
  },
}
```

### Cambiar URL base

Edita `playwright.config.ts`:

```typescript
use: {
  baseURL: 'http://localhost:3000',  // ← Cambia si es necesario
}
```

### Cambiar timeout

```typescript
// En un test específico
test('slow test', async ({ page }) => {
  page.setDefaultTimeout(30000)  // 30 segundos
  // ...
})

// Globalmente en playwright.config.ts
use: {
  navigationTimeout: 30000,
  actionTimeout: 10000,
}
```

---

## 🐛 Problemas comunes

### "Cannot find user with email..."
**Solución:** Crea los usuarios en Supabase primero

### "Port 3000 already in use"
**Solución:** Mata el proceso: `lsof -i :3000 && kill -9 <PID>`

### "Timeout waiting for selector"
**Solución:** Usa `waitForURL()` o `waitForNavigation()` después de clicks

### "Auth state not found"
**Solución:** Verifica que los usuarios existan en Supabase

---

## 📖 Documentación completa

- Setup detallado: [PLAYWRIGHT_SETUP.md](./PLAYWRIGHT_SETUP.md)
- Status actual: [PLAYWRIGHT_STATUS.md](./PLAYWRIGHT_STATUS.md)
- Estructura E2E: [e2e/README.md](./e2e/README.md)

---

## 🎯 Próximos pasos

1. ✅ Instalar Playwright
2. ✅ Crear usuarios de prueba
3. ✅ Crear tu primer test
4. ✅ Ejecutar: `npm run test:e2e`
5. 📈 Agregar más tests
6. 🚀 Integrar en CI/CD

---

**¡Listo para empezar!** 🚀

```bash
npm run test:e2e:ui  # Abre interfaz gráfica
```

Luego haz clic en "Create new test" para generar tests automáticamente viendo tus acciones en el navegador.
