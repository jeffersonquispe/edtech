# E2E Tests — EdTech Platform

Tests End-to-End usando **Playwright** para validar flujos completos de la plataforma EdTech.

## 📁 Estructura

```
e2e/
├── pages/                     # Page Object Model
│   ├── base.page.ts          # Clase base con métodos comunes
│   ├── login.page.ts         # Página de login
│   ├── courses.page.ts       # Catálogo de cursos
│   ├── student-dashboard.page.ts
│   ├── lesson-viewer.page.ts # Visor de lecciones
│   └── instructor-dashboard.page.ts
├── fixtures/                  # Datos y setup reutilizables
│   └── auth.fixture.ts       # Fixtures de autenticación
├── tests/                     # Tests (por crear en Fase 4)
│   ├── auth.spec.ts
│   ├── enrollment.spec.ts
│   └── instructor.spec.ts
├── .auth/                     # Almacena estados de autenticación (gitignored)
│   ├── student.json
│   └── instructor.json
└── .gitignore
```

## 🚀 Comandos

```bash
# Instalar Playwright (solo primera vez)
npm install @playwright/test

# Ejecutar todos los tests
npm run test:e2e

# Modo UI (interfaz gráfica interactiva)
npm run test:e2e:ui

# Debug mode (paso a paso)
npm run test:e2e:debug

# Ver reporte de tests
npx playwright show-report
```

## 🔐 Autenticación

Los tests usan fixtures pre-autenticadas para evitar fazer login en cada test:

```typescript
import { test, expect } from '../fixtures/auth.fixture'

test('estudiante puede ver cursos', async ({ studentPage }) => {
  // studentPage ya está autenticado como estudiante
  await studentPage.goto('/')
  // ... resto del test
})

test('instructor puede crear curso', async ({ instructorPage }) => {
  // instructorPage ya está autenticado como instructor
  await instructorPage.goto('/dashboard/instructor')
  // ... resto del test
})
```

### Contextos disponibles

- **`studentContext`** — Contexto de navegador autenticado como estudiante
- **`instructorContext`** — Contexto de navegador autenticado como instructor
- **`studentPage`** — Página pre-autenticada como estudiante
- **`instructorPage`** — Página pre-autenticada como instructor
- **`authenticatedPage`** — Alias para studentPage

## 📝 Page Objects

Cada página tiene su clase correspondiente en `pages/`:

```typescript
import { LoginPage } from '../pages/login.page'

const loginPage = new LoginPage(page)
await loginPage.login('user@example.com', 'password')
await loginPage.expectToBeOnLoginPage()
```

### Métodos comunes (BasePage)

```typescript
await page.goto(path)                    // Navega a URL
await page.click(selector)               // Click
await page.fill(selector, text)          // Rellena input
await page.getByRole(...)                // Selecciona por role
await page.getByText(...)                // Selecciona por texto
await page.expectToBeVisible(selector)   // Espera a que sea visible
await page.waitForURL(pattern)           // Espera a que URL coincida
```

## 🧪 Escribir un nuevo test

```typescript
// e2e/tests/my-feature.spec.ts
import { test, expect } from '../fixtures/auth.fixture'
import { CoursesPage } from '../pages/courses.page'

test.describe('Mi Feature', () => {
  test('caso de prueba básico', async ({ studentPage }) => {
    // Arrange
    const coursesPage = new CoursesPage(studentPage)

    // Act
    await coursesPage.goto()
    await coursesPage.expectCourseVisible('Next.js Pro')

    // Assert
    expect(coursesPage.page.url()).toContain('/')
  })

  test('caso con error', async ({ page }) => {
    // Page es un contexto no autenticado
    const loginPage = new LoginPage(page)
    await loginPage.login('invalid@email.com', 'wrong')
    await loginPage.expectErrorMessage()
  })
})
```

## ✅ Buenas prácticas

1. **Use Page Objects** — No escriba selectores directamente en los tests
2. **Nombres descriptivos** — `test('usuario puede inscribirse en curso')` vs `test('feature 1')`
3. **Siga el patrón AAA** — Arrange → Act → Assert
4. **Reutilice fixtures** — Use `studentPage`, `instructorPage` en lugar de hacer login manual
5. **Espere explícitamente** — Use `waitForURL()`, `waitForNavigation()` en lugar de sleeps
6. **Manejar errores** — Capture y valide mensajes de error esperados

## 📊 Cobertura esperada (Fase 4+)

- ✅ Autenticación (login/logout)
- ✅ Flujo de inscripción completo
- ✅ Ver lecciones después de inscribirse
- ✅ Instructor crear/editar cursos
- 🔜 Reviews y ratings
- 🔜 Filtrado de cursos
- 🔜 Widget Edy (voz)

## 🐛 Debugging

```bash
# Ver qué está haciendo el test en tiempo real
npm run test:e2e:debug

# En modo debug, usa:
# - Step over (F10)
# - Step into (F11)
# - Continue (F5)
# - Breakpoints
```

O genera un trace de video:

```bash
npx playwright test --trace on

# Luego verifica con:
npx playwright show-trace trace.zip
```

## 📚 Referencias

- [Playwright Docs](https://playwright.dev/)
- [Page Objects Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

**Última actualización:** 2026-05-18  
**Status:** Fases 1-3 completadas ✅ | Fase 4 pendiente (tests específicos)
