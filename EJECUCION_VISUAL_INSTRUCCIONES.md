# 🎬 Ejecución Visual — Tests en Tiempo Real

**Cómo ver los 19 tests ejecutándose en vivo en el navegador**

---

## 📋 Estado actual

✅ **Dependencias instaladas**  
✅ **Playwright 1.60.0 listo**  
⏳ **Navegadores descargándose** (3-5 min)  
⏳ **Tests listos para ejecutar**  

---

## 🚀 Pasos para ver los tests en vivo

### Paso 1: Esperar a que terminen los navegadores
```bash
# Ya en progreso...
npx playwright install

# Cuando terminé, verás:
# ✓ Chromium (XX mb)
# ✓ Firefox (XX mb)
# ✓ WebKit (XX mb)
```

### Paso 2: Abrir 2 terminales

**Terminal 1 — Servidor Frontend:**
```bash
cd "/c/Users/Jeff/Desktop/edtech/frontend"
npm run dev
```

Espera a que diga:
```
✓ Ready in XXms
  http://localhost:3000
```

**Terminal 2 — Tests con UI:**
```bash
cd "/c/Users/Jeff/Desktop/edtech/frontend"
npm run test:e2e:ui
```

Se abrirá automáticamente un navegador con la interfaz de Playwright.

---

## 🖥️ Interfaz que verás

```
┌────────────────────────────────────────────────────────┐
│          Playwright Inspector                      [×]  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Tests                                  [Run all]      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                        │
│  📁 auth.spec.ts                                       │
│    ├─ ✓ puede hacer login correctamente               │
│    ├─ ✓ muestra error con credenciales inválidas      │
│    ├─ ✓ redirige a login si no está autenticado       │
│    └─ ▶ usuario puede hacer logout                    │
│                                                        │
│  📁 enrollment.spec.ts                                 │
│    ├─ ⏸ estudiante puede ver cursos                   │
│    ├─ ⏸ estudiante puede inscribirse                  │
│    ├─ ⏸ ver sus cursos inscritos                      │
│    ├─ ⏸ no puede acceder sin estar inscrito           │
│    └─ ⏸ mensaje de error sin autenticación            │
│                                                        │
│  📁 lesson-viewer.spec.ts                              │
│    └─ ...                                              │
│                                                        │
│  ...más tests abajo                                    │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  🌐 Navegador (Chromium)                               │
│  ────────────────────────────────────────────────────  │
│  http://localhost:3000/login                           │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │          EdTech                                │   │
│  │   Bienvenido de nuevo                         │   │
│  │                                                │   │
│  │  Email:    student@example.com    ← auto-rellenado │
│  │  Password: ••••••••••••••••       ← auto-rellenado │
│  │  [Ingresar]  ← siendo clickeado              │   │
│  │                                                │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
├────────────────────────────────────────────────────────┤
│  ▶ Play  ⏸ Pause  → Step  🐛 Debug  ⏹ Stop            │
│  ⏱ 0.45s                                               │
└────────────────────────────────────────────────────────┘
```

---

## 📊 Lo que verás en tiempo real

### En el lado izquierdo — Lista de tests

```
✓ PASSED (verde)
  - puede hacer login correctamente
  - muestra error con credenciales inválidas
  - redirige a login si no está autenticado
  - usuario puede hacer logout

⏸ PAUSED (naranja)
  - estudiante puede ver cursos publicados

▶ RUNNING (azul)
  - estudiante puede inscribirse en un curso

❌ FAILED (rojo)
  - (si hay fallos, aquí aparecen)
```

### En el centro — Navegador simulado

Verás exactamente lo que hace cada test:

1. **Auth tests:** Página de login, llenar campos, clic en botón
2. **Enrollment tests:** Catálogo de cursos, botón "Inscribirse"
3. **Lesson tests:** Visor de lecciones con video
4. **Instructor tests:** Dashboard con estadísticas
5. **Integration tests:** Flujos completos

### En la barra inferior — Controles

```
▶ Play              - Continuar ejecución
⏸ Pause             - Pausar el test actual
→ Step              - Avanzar un paso
🐛 Debug            - Modo debug (F10)
⏹ Stop              - Detener todo
📸 Screenshot       - Tomar screenshot
🎥 Video            - Ver grabación
```

---

## 🎬 Ejemplo: viendo un test paso a paso

### Antes de ejecutar:
```
1. Click izquierdo en: "puede hacer login correctamente"
2. El test se resalta en naranja (PAUSED)
3. Haz click en ▶ Play
```

### Lo que ocurre:
```
[0.0s]  Navegando a http://localhost:3000/login
[0.2s]  Página cargada
[0.3s]  Email field encontrado y rellenado: student@example.com
[0.4s]  Password field encontrado y rellenado: ••••••••••••
[0.5s]  Click en botón "Ingresar"
[0.7s]  Navegando a http://localhost:3000
[1.0s]  ✓ Assertion passed: page.url() matches /.*\//
[1.2s]  ✓ TEST PASSED
```

---

## 🎮 Cosas que puedes hacer en la UI

### 1. Ver el código del test
```
Click en la pestaña: [Source]

Verás el código TypeScript del test:
test('puede hacer login correctamente', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.login('student@example.com', 'password123')
  await expect(page).toHaveURL(/.*\//)
})
```

### 2. Ejecutar solo un test
```
Click derecho en un test → [Run]
O haz click en el test y presiona ▶
```

### 3. Ejecutar todos los tests
```
Click en [Run all] en la parte superior
Ejecutará los 19 tests en secuencia
```

### 4. Ver acciones detalladas
```
Click en la pestaña: [Actions]

Verás cada acción:
→ goto http://localhost:3000/login
→ click [text="Email"]
→ fill student@example.com
→ click [text="Ingresar"]
→ waitForNavigation
```

### 5. Ver logs de consola
```
Click en la pestaña: [Console]

Si hay errores, aparecerán aquí
```

### 6. Ver network
```
Click en la pestaña: [Network]

Verás todas las peticiones HTTP:
GET /api/courses 200
POST /api/auth/login 200
etc.
```

---

## 🕐 Tiempo estimado

```
Descarga de navegadores:     3-5 minutos
Inicio servidor frontend:    10 segundos
Inicio UI de tests:          5 segundos
Ejecución de 19 tests:       15-20 segundos
────────────────────────────────────────
Total:                       3-6 minutos
```

---

## ✅ Checklist antes de empezar

- [x] Dependencias instaladas: `npm install --legacy-peer-deps`
- [x] Playwright versión 1.60.0+: `npx playwright --version`
- [ ] Navegadores descargados: `npx playwright install` (en progreso)
- [ ] Usuarios creados en Supabase:
  - [ ] student@example.com / password123
  - [ ] instructor@example.com / password123
- [ ] Terminal 1 lista para: `npm run dev`
- [ ] Terminal 2 lista para: `npm run test:e2e:ui`

---

## 📱 Tests que verás

### Tests de Autenticación (4)
```
1. Login exitoso → Página principal
2. Error con credenciales → Mensaje de error
3. Sin autenticación → Redirige a login
4. Logout → Limpia sesión
```

### Tests de Inscripción (5)
```
5. Ver catálogo de cursos
6. Inscribirse en un curso
7. Ver cursos inscritos en dashboard
8. Acceso bloqueado sin inscripción
9. Error sin autenticación
```

### Tests de Lecciones (5)
```
10. Ver lecciones (inscrito)
11. Lecciones bloqueadas (no inscrito)
12. Navegación de lecciones
13. Navegar entre lecciones
14. Cargar contenido de lección
```

### Tests de Instructor (5)
```
15. Acceder a dashboard instructor
16. Ver estadísticas en dashboard
17. Lista de cursos del instructor
18. Botón para crear curso
19. Estudiante no puede ver instructor dashboard
```

### Tests de Integración (5)
```
20. Flujo completo estudiante
21. Flujo completo instructor
22. Múltiples roles simultáneamente
23. Logout limpia sesión
24. Sin errores en navegación
```

---

## 🐛 Si algo falla

### Error: "Port 3000 already in use"
```bash
# Buscar proceso en puerto 3000
lsof -i :3000

# Matar proceso
kill -9 <PID>

# Intentar de nuevo
npm run dev
```

### Error: "Auth failed"
```
1. Verificar que usuarios existen en Supabase:
   - student@example.com / password123
   - instructor@example.com / password123

2. Verificar que tienen rol en tabla 'profiles':
   - role = 'student' o 'instructor'
```

### Error: "Connection refused"
```
1. Asegúrate que Terminal 1 está corriendo: npm run dev
2. Verifica que dice: "✓ Ready in XXms"
3. Abre http://localhost:3000 en navegador
```

### Error: "Test timeout"
```
Esto es normal. Algunos tests pueden tardar si:
- Supabase está lento
- La BD está vacía
- El navegador está descargando

Solo espera a que termine.
```

---

## 🎉 ¿Qué significa ver los tests pasar?

Cuando ves:
```
✓ 19 tests PASSED
  - Chromium (4.2s)
  - Firefox (4.5s)
  - WebKit (3.8s)
```

Significa:
- ✅ La plataforma funciona en todos los navegadores
- ✅ Autenticación funciona
- ✅ Inscripción funciona
- ✅ Lecciones funcionan
- ✅ Dashboards funcionan
- ✅ RLS está protegiendo datos
- ✅ Todo E2E está validado

---

## 📖 Documentación para consultar

Si necesitas ayuda mientras ves los tests:

- **¿Cómo funciona esto?** → [e2e/README.md](./frontend/e2e/README.md)
- **¿Qué es cada test?** → [FASE_4_TESTS_EJECUTAR.md](./frontend/FASE_4_TESTS_EJECUTAR.md)
- **¿Problemas?** → [PLAYWRIGHT_SETUP.md](./frontend/PLAYWRIGHT_SETUP.md) sección Troubleshooting

---

## 🚀 Comandos rápidos

```bash
# Terminal 1 - Servidor
cd "/c/Users/Jeff/Desktop/edtech/frontend"
npm run dev

# Terminal 2 - Tests con UI (RECOMENDADO)
cd "/c/Users/Jeff/Desktop/edtech/frontend"
npm run test:e2e:ui

# Alternativa: Tests sin UI (resultado en consola)
npm run test:e2e

# Alternativa: Debug paso a paso
npm run test:e2e:debug

# Ver reporte HTML después
npx playwright show-report
```

---

## 🎯 Resumen

**Fases completadas:**
- ✅ Fase 1: Setup
- ✅ Fase 2: Page Objects
- ✅ Fase 3: Fixtures
- ✅ Fase 4: Tests (19 tests)
- ⏳ Fase 5: CI/CD

**Lo que verás:**
- 19 tests ejecutándose en vivo
- Navegador simulado mostrando acciones
- Status de cada test en tiempo real
- UI interactiva para debugging

**Tiempo:** 3-6 minutos desde ahora

---

## ✨ ¡Listo!

Cuando terminen los navegadores de descargar, ejecuta:

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run test:e2e:ui
```

Y verás los 19 tests ejecutándose en tiempo real en el navegador. 🚀

---

**Estado:** 🟢 TODO LISTO PARA EJECUTAR  
**Próximo:** Ver tests en vivo  
**Fecha:** 18 de Mayo de 2026
