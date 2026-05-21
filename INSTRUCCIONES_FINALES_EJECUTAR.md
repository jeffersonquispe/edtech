# 🎬 INSTRUCCIONES FINALES — Ejecutar Tests en Vivo

**Status:** ✅ TODO LISTO PARA EJECUTAR  
**Fecha:** 18 de Mayo de 2026

---

## ✅ Verificación previa

```
✓ Playwright 1.60.0 instalado
✓ Navegadores descargados (Chromium, Firefox, WebKit)
✓ 19 tests creados y listos
✓ Page Objects configurados
✓ Fixtures de autenticación listos
```

---

## 🚀 PASO 1: CREAR USUARIOS EN SUPABASE

**IMPORTANTE:** Antes de ejecutar los tests, crea estos usuarios en tu base de datos Supabase:

### Usuario 1: Estudiante
- Email: `student@example.com`
- Password: `password123`
- En tabla `profiles`: `role = 'student'`

### Usuario 2: Instructor
- Email: `instructor@example.com`
- Password: `password123`
- En tabla `profiles`: `role = 'instructor'`

**Opción A: Vía UI de Supabase**
1. Ve a tu proyecto Supabase → Authentication → Users
2. Click en "Add user"
3. Email: `student@example.com`, Password: `password123`
4. Click en la fila → Edit → Ir a tabla profiles
5. Asegúrate que `role = 'student'`
6. Repite para instructor

**Opción B: Vía SQL (más rápido)**
```sql
-- Crear usuario estudiante
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('student@example.com', crypt('password123', gen_salt('bf')), now());

INSERT INTO profiles (id, role, full_name)
SELECT id, 'student', 'Test Student'
FROM auth.users
WHERE email = 'student@example.com';

-- Crear usuario instructor
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('instructor@example.com', crypt('password123', gen_salt('bf')), now());

INSERT INTO profiles (id, role, full_name)
SELECT id, 'instructor', 'Test Instructor'
FROM auth.users
WHERE email = 'instructor@example.com';
```

---

## 🚀 PASO 2: ABRIR DOS TERMINALES

### Terminal 1: Servidor Frontend

```bash
cd "/c/Users/Jeff/Desktop/edtech/frontend"
npm run dev
```

**Espera a que veas:**
```
✓ Ready in XXms
  http://localhost:3000
```

**NO cierres esta terminal, déjala corriendo.**

---

### Terminal 2: Tests con UI (abre DESPUÉS de que Terminal 1 esté lista)

```bash
cd "/c/Users/Jeff/Desktop/edtech/frontend"
npm run test:e2e:ui
```

**Se abrirá automáticamente** una ventana del navegador con la interfaz de Playwright.

---

## 🎮 LO QUE VERÁS EN LA INTERFAZ

```
┌─────────────────────────────────────────────────┐
│  Playwright Inspector - EdTech E2E Tests    [×]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  📋 Tests                    [Run all ▶]        │
│  ═══════════════════════════════════════════    │
│                                                 │
│  📁 auth.spec.ts                                │
│    ├─ ✓ puede hacer login correctamente         │
│    ├─ ✓ muestra error con credenciales          │
│    ├─ ✓ redirige a login sin autenticación      │
│    └─ ▶ usuario puede hacer logout              │
│                                                 │
│  📁 enrollment.spec.ts                          │
│    ├─ ⏸ estudiante puede ver cursos            │
│    ├─ ⏸ estudiante puede inscribirse           │
│    └─ ...                                       │
│                                                 │
│  🌐 NAVEGADOR (En vivo)                         │
│  ──────────────────────────────────────────     │
│  URL: http://localhost:3000/login               │
│                                                 │
│  [Email field being filled...]                  │
│  [Password field being filled...]               │
│  [Click on login button...]                     │
│  ──────────────────────────────────────────     │
│                                                 │
│  ▶ Play  ⏸ Pause  → Step  🐛 Debug  ⏹ Stop     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎬 CONTROLES BÁSICOS

| Botón | Acción | Tecla |
|-------|--------|-------|
| **▶ Play** | Ejecutar/continuar | Enter |
| **⏸ Pause** | Pausar test | Space |
| **→ Step** | Siguiente paso | N |
| **🐛 Debug** | Modo debug | D |
| **⏹ Stop** | Detener test | Esc |

---

## 📊 PRUEBAS QUE EJECUTARÁN

### Tests de Autenticación (4)
```
1. Login exitoso como estudiante
2. Error con credenciales inválidas
3. Redirección a login sin autenticación
4. Logout limpia la sesión
```

### Tests de Inscripción (5)
```
5. Ver catálogo de cursos
6. Inscribirse en un curso
7. Ver cursos inscritos en dashboard
8. No acceso sin inscripción
9. Error sin autenticación
```

### Tests de Lecciones (5)
```
10. Ver lecciones (inscrito)
11. Lecciones bloqueadas (no inscrito)
12. Navegación en lecciones
13. Navegar entre lecciones
14. Cargar contenido
```

### Tests de Instructor (5)
```
15. Acceder a dashboard
16. Ver estadísticas
17. Lista de cursos
18. Crear curso
19. Bloquear acceso a estudiante
```

### Tests de Integración (5)
```
20. Flujo estudiante completo
21. Flujo instructor completo
22. Roles simultáneos
23. Logout limpia todo
24. Sin errores en navegación
```

---

## ✅ CHECKLIST ANTES DE EJECUTAR

- [ ] Usuarios creados en Supabase:
  - [ ] `student@example.com` (role: student)
  - [ ] `instructor@example.com` (role: instructor)
- [ ] Terminal 1 abierta: `npm run dev`
- [ ] Terminal 1 muestra: "✓ Ready in XXms"
- [ ] Terminal 1 NO está cerrada
- [ ] Vas a ejecutar Terminal 2: `npm run test:e2e:ui`

---

## 🎯 FLUJO COMPLETO (8 pasos)

### Paso 1: Terminal 1 abierta
```bash
cd "/c/Users/Jeff/Desktop/edtech/frontend"
npm run dev
```

### Paso 2: Espera a "✓ Ready in XXms"

### Paso 3: Terminal 2 abierta (nueva terminal)
```bash
cd "/c/Users/Jeff/Desktop/edtech/frontend"
npm run test:e2e:ui
```

### Paso 4: Se abre navegador automáticamente

### Paso 5: Ves lista de 19 tests en el lado izquierdo

### Paso 6: Haz click en [Run all] para ejecutar todos

### Paso 7: Observa cómo ocurren las acciones en tiempo real

### Paso 8: ¡Espera a que terminen! (15-20 segundos)

---

## 🎉 RESULTADO ESPERADO

Después de que terminen todos los tests:

```
✓ 19 tests PASSED

Browsers:
✓ chromium (4.2s)
✓ firefox (4.5s)
✓ webkit (3.8s)
✓ mobile (3.2s)

Total: 15.7s
```

**Eso significa:**
- ✅ Login funciona
- ✅ Inscripción funciona
- ✅ Lecciones funcionan
- ✅ Dashboards funcionan
- ✅ RLS protege los datos
- ✅ Todo en 4 navegadores

---

## 🐛 SI ALGO FALLA

### Error: "Auth failed"
```
Causa: Usuario no existe en Supabase
Solución: Crea los usuarios (ver Paso 1 arriba)
```

### Error: "Connection refused"
```
Causa: Terminal 1 (npm run dev) no está corriendo
Solución: Asegúrate que Terminal 1 dice "✓ Ready in XXms"
```

### Error: "Port 3000 already in use"
```bash
# Encuentra el proceso
lsof -i :3000

# Mata el proceso
kill -9 <PID>

# Intenta de nuevo
npm run dev
```

### Error: "Timeout waiting for selector"
```
Causa: Página tardó en cargar
Solución: Esto es normal. Espera a que terminen los tests.
         La segunda vez más rápido.
```

---

## 💡 TIPS DURANTE LA EJECUCIÓN

### Para ver un test paso a paso
1. Haz click en el nombre del test
2. Haz click en ▶ Play
3. Usa → Step para avanzar lentamente

### Para ver el código del test
1. Click en pestaña [Source]
2. Verás el código TypeScript

### Para ver acciones detalladas
1. Click en pestaña [Actions]
2. Verás cada click, input, navegación

### Para ver logs
1. Click en pestaña [Console]
2. Si hay errores, aparecerán aquí

---

## 📖 DOCUMENTACIÓN ÚTIL

Si necesitas ayuda mientras ejecutas:

- **¿Qué está pasando?** → Mira el navegador simulado en el centro
- **¿Cuál test falla?** → Verás ✓ (passed) o ❌ (failed)
- **¿Cómo debugging?** → Haz click en test y usa → Step
- **¿Problemas?** → Lee [PLAYWRIGHT_SETUP.md](./frontend/PLAYWRIGHT_SETUP.md)

---

## ⏱️ TIEMPO ESTIMADO

```
Terminal 1 (npm run dev):     10 segundos
Terminal 2 (npm run test:e2e:ui):  5 segundos
Carga de navegador:           3 segundos
Ejecución de 19 tests:        15-20 segundos
Total:                        33-38 segundos
```

---

## 🎬 COMENZAR AHORA

### Opción A: Ejecutar todo automáticamente

Si quieres, puedo intentar ejecutar los tests directamente aquí.

### Opción B: Tú ejecutas en tu máquina (RECOMENDADO)

Sigue los pasos anteriores tú mismo para tener control total.

---

## ✨ LO QUE LOGRARÁS

Verás en tiempo real:
- ✅ Login funcionando
- ✅ Inscripción en cursos
- ✅ Visualización de lecciones
- ✅ Dashboards de estudiante e instructor
- ✅ Control de permisos (RLS)
- ✅ Manejo de errores

Todo validado automáticamente en 4 navegadores.

---

## 🎉 SIGUIENTES ACCIONES

### Después de ejecutar:
1. Verifica que los 19 tests pasen
2. Explora los controles del UI
3. Prueba el modo debug para ver paso a paso
4. Lee la documentación para entender mejor

### Cuando estés listo para Fase 5:
1. Crear `.github/workflows/e2e.yml`
2. Integrar con GitHub Actions
3. Reportes automáticos en PR

---

**ESTADO:** 🟢 TODO LISTO

**Próximo paso:** Ejecutar los tests

**Tiempo:** 30 segundos desde ahora

¡Adelante! 🚀
