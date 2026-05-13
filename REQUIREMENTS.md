# Requisitos del Proyecto EdTech

## Versiones Requeridas

| Herramienta | Versión Mínima | Estado |
|---|---|---|
| Node.js | 20.9.0 | ⚠️ Tienes 16.20.0 |
| npm | 8+ | ✅ |
| Supabase CLI | latest | ⚠️ Requiere Node 20+ |

## Actualizar Node.js

### Opción 1: Usar nvm (Recomendado en Windows)

**Si usas nvm-windows:**

```powershell
# Listar versiones disponibles
nvm list available

# Instalar Node 20
nvm install 20.13.0

# Cambiar a Node 20
nvm use 20.13.0

# Verificar
node --version  # Debe ser v20.13.0 o mayor
```

### Opción 2: Descargar directamente

1. Ve a https://nodejs.org/
2. Descarga LTS (20.x o mayor)
3. Ejecuta el instalador
4. Reinicia la terminal

### Opción 3: Usar Volta (más moderno)

```powershell
# Instalar Volta (si no lo tienes)
choco install volta

# Fijar Node 20 para este proyecto
volta pin node@20

# En la siguiente terminal:
node --version  # Automáticamente Node 20
```

---

## Verificar Después de Actualizar

```bash
node --version     # Debe ser v20.x.x o mayor
npm --version      # Debe ser 8.x.x o mayor

# Prueba en el proyecto
cd backend
npm run dev       # Debe iniciar sin errores
```

---

## Dependencias Instaladas

**Backend:**
```json
{
  "@supabase/ssr": "^0.x.x",
  "@supabase/supabase-js": "^2.x.x"
}
```

**Frontend:**
```json
{
  "@supabase/ssr": "^0.x.x",
  "@supabase/supabase-js": "^2.x.x",
  "tailwindcss": "^4.x.x"
}
```

Shadcn/ui será instalado una vez que tengas Node 20+.

---

## Pasos Una Vez Actualices Node

1. **Limpia cache npm:**
   ```bash
   npm cache clean --force
   ```

2. **Reinstala dependencias:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Intenta compilar:**
   ```bash
   cd backend && npm run build
   ```

4. **Instala shadcn/ui en frontend:**
   ```bash
   cd frontend && npx shadcn@latest init
   ```

5. **Vuelve a leer este README:**
   ```bash
   cd .. && cat README.md
   ```

---

## Variables de Entorno Necesarias

**backend/.env.local:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**frontend/.env.local:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

---

## Troubleshooting

**Q: "Cannot find module '@supabase/ssr'"**  
A: Ejecuta `npm install` de nuevo después de actualizar Node.

**Q: "Next.js requires Node.js >=20.9.0"**  
A: Actualiza Node a 20+.

**Q: "shadcn@latest won't install"**  
A: Requiere Node 20+. Actualiza primero.

**Q: TypeScript error en editores**  
A: Asegúrate de que VS Code use la versión correcta de TypeScript (`Ctrl+Shift+P` > "TypeScript: Select TypeScript Version").
