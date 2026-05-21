# 🎭 Setup de Playwright — EdTech Platform

Guía de instalación y configuración de Playwright para tests E2E.

## ✅ Fase 1: Setup — COMPLETADA

### Archivos creados

```
frontend/
├── playwright.config.ts              ✅ Configuración central
├── package.json                      ✅ Scripts de test añadidos
├── e2e/
│   ├── .gitignore
│   ├── README.md                     ✅ Documentación
│   ├── pages/                        ✅ Page Objects
│   │   ├── base.page.ts
│   │   ├── login.page.ts
│   │   ├── courses.page.ts
│   │   ├── student-dashboard.page.ts
│   │   ├── lesson-viewer.page.ts
│   │   └── instructor-dashboard.page.ts
│   └── fixtures/                     ✅ Fixtures de auth
│       └── auth.fixture.ts
```

### Dependencias añadidas

```json
"@playwright/test": "^1.48.0"
```

---

## 🚀 Instalación

### Paso 1: Instalar dependencias

```bash
cd frontend
npm install
```

Esto instalará `@playwright/test` y todas sus dependencias.

### Paso 2: Instalar navegadores de Playwright

```bash
npx playwright install
```

Esto descargará:
- ✅ Chromium
- ✅ Firefox
- ✅ WebKit (Safari)

Tiempo estimado: **3-5 minutos**

### Paso 3: Verificar instalación

```bash
npx playwright --version
# Debería mostrar algo como: Version 1.48.0
```

---

## 📋 Scripts disponibles

```bash
# Ejecutar E2E tests (una sola vez)
npm run test:e2e

# Modo UI (interfaz gráfica interactiva)
npm run test:e2e:ui

# Debug mode (paso a paso con inspector)
npm run test:e2e:debug
```

---

## 🔐 Configuración de autenticación

### Antes de ejecutar tests

Necesitas usuarios de prueba en tu Supabase:

1. **Crear usuario estudiante:**
   - Email: `student@example.com`
   - Password: `password123`
   - Rol en `profiles`: `student`

2. **Crear usuario instructor:**
   - Email: `instructor@example.com`
   - Password: `password123`
   - Rol en `profiles`: `instructor`

3. **(Opcional) Crear usuario adicional:**
   - Email: `student2@example.com`
   - Password: `password123`
   - Rol en `profiles`: `student`

### Actualizar credenciales

Si usas credenciales diferentes, edita `e2e/fixtures/auth.fixture.ts`:

```typescript
export const testUsers = {
  student: {
    email: 'tu-email-estudiante@example.com',  // ← Cambia esto
    password: 'tu-password',                     // ← Cambia esto
  },
  instructor: {
    email: 'tu-email-instructor@example.com',   // ← Cambia esto
    password: 'tu-password',                     // ← Cambia esto
  },
  // ...
}
```

---

## ✅ Verificación paso a paso

### Verificación 1: Estructura de carpetas

```bash
# Desde la carpeta frontend/
ls -R e2e/

# Debería mostrar:
# e2e/
# ├── .gitignore
# ├── README.md
# ├── pages/
# │   ├── base.page.ts
# │   ├── login.page.ts
# │   ├── courses.page.ts
# │   ├── student-dashboard.page.ts
# │   ├── lesson-viewer.page.ts
# │   └── instructor-dashboard.page.ts
# └── fixtures/
#     └── auth.fixture.ts
```

### Verificación 2: Configuración de Playwright

```bash
# Verificar que playwright.config.ts existe
cat playwright.config.ts | head -20

# Debería mostrar:
# import { defineConfig, devices } from '@playwright/test'
# export default defineConfig({
#   testDir: './e2e/tests',
#   ...
```

### Verificación 3: Package.json actualizado

```bash
# Verificar que los scripts están presentes
grep -A 3 "test:e2e" package.json

# Debería mostrar:
# "test:e2e": "playwright test",
# "test:e2e:ui": "playwright test --ui",
# "test:e2e:debug": "playwright test --debug"
```

### Verificación 4: Ejecutar un test de prueba

Primero, crea un test simple para verificar que todo funciona:

```bash
# Crear archivo de prueba
cat > e2e/tests/health-check.spec.ts << 'EOF'
import { test, expect } from '@playwright/test'

test('debe cargar la página principal', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/EdTech|Tienda de cursos/i)
})
EOF
```

Luego ejecuta el test:

```bash
# Asegúrate de que el servidor frontend está corriendo
npm run dev &

# En otra terminal, ejecuta el test
npm run test:e2e e2e/tests/health-check.spec.ts
```

Si todo está bien, deberías ver:

```
✓ health-check.spec.ts (1 test)
```

---

## 🔧 Configuración de Supabase para tests

### Variables de entorno (opcional)

Si necesitas variables específicas para tests, crea un archivo `.env.test`:

```bash
# .env.test
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

Luego úsalo en Playwright:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    // ...
  },
})
```

---

## 📊 Estructura de un test (Preview)

Aquí está la estructura que seguiremos en Fase 4:

```typescript
// e2e/tests/auth.spec.ts
import { test, expect } from '../fixtures/auth.fixture'
import { LoginPage } from '../pages/login.page'

test.describe('Authentication', () => {
  test('estudiante puede hacer login', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page)

    // Act
    await loginPage.login('student@example.com', 'password123')

    // Assert
    await expect(page).toHaveURL(/.*\//)
  })

  test('muestra error con credenciales inválidas', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page)

    // Act
    await loginPage.goto('/login')
    await loginPage.fillEmail('invalid@example.com')
    await loginPage.fillPassword('wrongpassword')
    await loginPage.submitForm()

    // Assert
    await loginPage.expectErrorMessage()
  })
})
```

---

## 🚨 Troubleshooting

### Error: "Port 3000 already in use"

```bash
# Mata el proceso que está usando puerto 3000
lsof -i :3000  # En macOS/Linux
netstat -ano | findstr :3000  # En Windows

# Luego:
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Error: "Playwright browser not found"

```bash
# Re-instala los navegadores
npx playwright install
```

### Error: "Cannot find module './e2e/tests'"

```bash
# Verifica que los tests están en la carpeta correcta
ls e2e/tests/

# Si está vacía, necesitas crear los tests (Fase 4)
# Por ahora puedes crear un test dummy para verificar la estructura
```

### Error: "baseURL not set"

```bash
# Asegúrate de que:
# 1. playwright.config.ts está en la raíz de frontend/
# 2. Contiene: use: { baseURL: 'http://localhost:3000' }
# 3. El servidor frontend está corriendo: npm run dev
```

### Error: "Auth state not found"

```bash
# Si ves "Failed to authenticate as student"
# Verifica que:
# 1. El usuario existe en Supabase con el email correcto
# 2. Las credenciales en auth.fixture.ts son correctas
# 3. Tu BD de Supabase tiene los usuarios de prueba
```

---

## ✨ Próximos pasos — Fase 4

En la Fase 4, crearemos los tests reales en:

```
e2e/tests/
├── auth.spec.ts              # Login/logout
├── enrollment.spec.ts        # Inscripción en cursos
├── lesson-viewer.spec.ts     # Ver lecciones
├── instructor.spec.ts        # Dashboard instructor
└── integration.spec.ts       # Flujos completos
```

## 📚 Comandos útiles durante desarrollo

```bash
# Ejecutar un test específico
npm run test:e2e e2e/tests/auth.spec.ts

# Ejecutar tests con patrón
npm run test:e2e -- -g "can login"

# Ejecutar solo en un navegador
npx playwright test --project=chromium

# Generar trace para debugging
npx playwright test --trace on

# Ver el reporte HTML
npx playwright show-report
```

---

## ✅ Checklist de setup

- [x] Instalar `@playwright/test` en package.json
- [x] Crear `playwright.config.ts`
- [x] Crear estructura de carpetas `e2e/`
- [x] Crear Page Objects (base, login, courses, etc.)
- [x] Crear fixtures de autenticación
- [x] Documentar en `e2e/README.md`
- [x] Crear este guía de setup
- [ ] Crear usuarios de prueba en Supabase
- [ ] Ejecutar test health-check y verificar
- [ ] Crear tests de Fase 4

---

**Estado:** 🟢 Fases 1-3 completadas  
**Próximo:** Crear tests en Fase 4  
**Documentación:** [Playwright Docs](https://playwright.dev/)
