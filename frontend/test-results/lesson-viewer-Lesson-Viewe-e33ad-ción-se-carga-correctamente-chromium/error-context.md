# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lesson-viewer.spec.ts >> Lesson Viewer >> contenido de lección se carga correctamente
- Location: e2e\tests\lesson-viewer.spec.ts:57:7

# Error details

```
Test timeout of 30000ms exceeded while setting up "studentPage".
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - navigation [ref=e3]:
      - link "E EdTech" [ref=e4] [cursor=pointer]:
        - /url: /
        - generic [ref=e5]: E
        - generic [ref=e6]: EdTech
      - generic [ref=e7]:
        - link "Ingresar" [ref=e8] [cursor=pointer]:
          - /url: /login
        - link "Registrarse" [ref=e9] [cursor=pointer]:
          - /url: /signup
  - main [ref=e10]:
    - generic [ref=e15]:
      - generic [ref=e16]:
        - generic [ref=e17]: E
        - generic [ref=e18]: EdTech
      - heading "Bienvenido de nuevo" [level=1] [ref=e19]
      - paragraph [ref=e20]: Ingresa a tu cuenta para continuar
      - generic [ref=e21]:
        - generic [ref=e22]:
          - generic [ref=e23]: Email
          - textbox "Email" [ref=e24]
        - generic [ref=e25]:
          - generic [ref=e26]: Contraseña
          - textbox "Contraseña" [ref=e27]
        - button "Ingresar" [ref=e28]
      - paragraph [ref=e29]:
        - text: ¿No tienes cuenta?
        - link "Regístrate" [ref=e30] [cursor=pointer]:
          - /url: /signup
  - button "🎤" [ref=e31]
```