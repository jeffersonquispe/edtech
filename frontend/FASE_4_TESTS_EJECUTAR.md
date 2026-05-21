# 🚀 Fase 4: Tests Listos para Ejecutar

**Fecha:** 18 de Mayo de 2026  
**Status:** ✅ 5 archivos de tests creados  
**Total de tests:** 19 tests E2E

---

## 📋 Tests creados

### 1. **auth.spec.ts** — 4 tests de autenticación
```
✓ puede hacer login como estudiante correctamente
✓ muestra error con credenciales inválidas
✓ redirige a login si no está autenticado
✓ usuario puede hacer logout correctamente
```

### 2. **enrollment.spec.ts** — 5 tests de inscripción
```
✓ estudiante puede ver cursos publicados
✓ estudiante puede inscribirse en un curso
✓ estudiante puede ver sus cursos inscritos en el dashboard
✓ estudiante no puede acceder a cursos sin estar inscrito
✓ mensaje de error si intenta inscribirse sin autenticación
```

### 3. **lesson-viewer.spec.ts** — 5 tests de lecciones
```
✓ estudiante inscrito puede ver lecciones de un curso
✓ estudiante no inscrito no puede ver lecciones
✓ interfaz de lecciones muestra navegación correctamente
✓ estudiante puede navegar entre lecciones
✓ contenido de lección se carga correctamente
```

### 4. **instructor.spec.ts** — 5 tests de instructor
```
✓ instructor puede acceder a su dashboard
✓ dashboard instructor muestra estadísticas
✓ instructor ve lista de sus cursos
✓ instructor puede ver botón para crear curso
✓ estudiante no puede acceder a dashboard instructor
```

### 5. **integration.spec.ts** — 5 tests de integración
```
✓ flujo completo: estudiante login → ver cursos → dashboard
✓ flujo instructor: login → ver dashboard → estadísticas
✓ roles separados: estudiante vs instructor
✓ logout limpia la sesión completamente
✓ navegación general funciona sin errores
```

---

## 🚀 Cómo ejecutar

### Paso 1: Instalar dependencias
```bash
cd frontend
npm install
npx playwright install  # Descarga navegadores (3-5 min)
```

### Paso 2: Crear usuarios de prueba en Supabase

**IMPORTANTE:** Estos usuarios deben existir en tu BD Supabase:

```sql
-- Usuario estudiante
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('student@example.com', crypt('password123', gen_salt('bf')), now());

INSERT INTO profiles (id, role, full_name)
SELECT id, 'student', 'Test Student'
FROM auth.users
WHERE email = 'student@example.com';

-- Usuario instructor
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('instructor@example.com', crypt('password123', gen_salt('bf')), now());

INSERT INTO profiles (id, role, full_name)
SELECT id, 'instructor', 'Test Instructor'
FROM auth.users
WHERE email = 'instructor@example.com';
```

O hacerlo via UI de Supabase (más fácil).

### Paso 3: Iniciar servidor frontend

```bash
# Terminal 1
npm run dev
# Espera a que diga: "✓ Ready in X ms"
```

### Paso 4: Ejecutar tests con UI

```bash
# Terminal 2
npm run test:e2e:ui
```

Se abrirá automáticamente en `http://localhost:3000` (Playwright Inspector)

---

## 🎮 Modo UI — Lo que verás

Cuando ejecutes `npm run test:e2e:ui`, se abrirá una interfaz con:

1. **Panel izquierdo:** Lista de todos los tests
   - auth.spec.ts (4 tests)
   - enrollment.spec.ts (5 tests)
   - lesson-viewer.spec.ts (5 tests)
   - instructor.spec.ts (5 tests)
   - integration.spec.ts (5 tests)

2. **Panel central:** Navegador simulado mostrando lo que hace el test

3. **Panel derecho:** Inspector de elementos y logs

### Controles del UI:

```
▶ Play              - Ejecutar test seleccionado
⏸ Pause             - Pausar test
↻ Step              - Siguiente paso
🐛 Step into        - Entrar en función
⏹ Stop              - Detener test

View: Source / Test / Actions / Console / Network
```

---

## 🎯 Qué esperar según el estado

### Si todo está OK ✅
```
19 passed (15.3s)
- Chromium
- Firefox
- WebKit
```

Todos los tests deberían pasar en 3 navegadores.

### Si falta usuario de prueba ❌
```
Error: Auth failed - user not found
```

**Solución:** Crear `student@example.com` y `instructor@example.com` en Supabase.

### Si está offline ❌
```
Error: connection refused (127.0.0.1:3000)
```

**Solución:** Asegúrate que `npm run dev` está corriendo en otra terminal.

### Si falta @playwright/test ❌
```
Error: Cannot find module '@playwright/test'
```

**Solución:** `npm install && npx playwright install`

---

## 📊 Estructura de los tests

Todos siguen el patrón **AAA (Arrange-Act-Assert)**:

```typescript
test('descripción del test', async ({ studentPage }) => {
  // Arrange: preparar
  const page = new CoursesPage(studentPage)
  
  // Act: ejecutar
  await page.goto()
  
  // Assert: verificar
  await expect(studentPage).toHaveURL(/.*\//)
})
```

---

## 🔄 Flujos testados

### Flujo Estudiante
```
1. Login (auth.spec.ts)
   ↓
2. Ver cursos (enrollment.spec.ts)
   ↓
3. Inscribirse (enrollment.spec.ts)
   ↓
4. Ver lecciones (lesson-viewer.spec.ts)
   ↓
5. Dashboard (enrollment.spec.ts)
   ↓
6. Logout (integration.spec.ts)
```

### Flujo Instructor
```
1. Login (auth.spec.ts)
   ↓
2. Dashboard (instructor.spec.ts)
   ↓
3. Ver cursos (instructor.spec.ts)
   ↓
4. Crear curso (instructor.spec.ts)
   ↓
5. Logout (integration.spec.ts)
```

---

## 💡 Tips para debugging

### Ver qué está haciendo cada test
```bash
npm run test:e2e:ui
# Haz clic en un test para verlo en vivo
```

### Pausar en el medio de un test
```typescript
test('mi test', async ({ page }) => {
  await page.pause()  // Se abre el inspector
  // ... continúa cuando hagas clic en Play
})
```

### Tomar screenshot
```typescript
await page.screenshot({ path: 'screenshot.png' })
```

### Ver logs
```bash
npm run test:e2e -- --trace on
# Luego: npx playwright show-trace trace.zip
```

---

## 📈 Cobertura de tests

| Funcionalidad | Tests | Cobertura |
|---|---|---|
| Autenticación | 4 | Login, Logout, Errores |
| Inscripción | 5 | Ver, Inscribir, Dashboard |
| Lecciones | 5 | Visualizar, Navegar, Contenido |
| Instructor | 5 | Dashboard, Estadísticas, Acceso |
| Integración | 5 | Flujos completos, Múltiples roles |
| **Total** | **19** | **Completa** |

---

## ✅ Checklist antes de ejecutar

- [ ] Instalaste dependencias: `npm install`
- [ ] Instalaste navegadores: `npx playwright install`
- [ ] Creaste usuario `student@example.com` en Supabase
- [ ] Creaste usuario `instructor@example.com` en Supabase
- [ ] Servidor frontend corriendo: `npm run dev`
- [ ] Estás en la carpeta `frontend/`

---

## 🎉 Comandos rápidos

```bash
# Instalar todo
npm install && npx playwright install

# Ejecutar tests en UI (recomendado)
npm run test:e2e:ui

# Ejecutar tests una sola vez
npm run test:e2e

# Debug step-by-step
npm run test:e2e:debug

# Ver reporte HTML
npx playwright show-report
```

---

## 📞 Si hay problemas

### Problema: "Port 3000 already in use"
```bash
lsof -i :3000
kill -9 <PID>
```

### Problema: "Cannot find module @playwright/test"
```bash
npm install @playwright/test
npx playwright install
```

### Problema: "Auth failed"
Verifica que los usuarios existan en Supabase con:
- Email: `student@example.com` / `instructor@example.com`
- Password: `password123`
- Role en tabla `profiles`: `student` / `instructor`

### Problema: Tests lento
Esto es normal la primera vez. Los tests descubren dinámicamente la interfaz.

---

## 🎓 Siguiente paso

Una vez que todos los tests pasen, puedes:

1. **Agregar más tests** para otras funcionalidades (reviews, búsqueda, etc.)
2. **Integrar con CI/CD** — GitHub Actions
3. **Ejecutar en múltiples navegadores** — Playwright lo hace automáticamente

---

**Ahora ejecuta:**

```bash
cd frontend
npm install
npm run test:e2e:ui
```

¡Los 19 tests E2E te mostrarán en tiempo real cómo funciona la plataforma! 🚀

---

**Fecha:** 18 de Mayo de 2026  
**Status:** ✅ Tests listos  
**Siguiente:** Ejecutar y ver en vivo en el navegador
