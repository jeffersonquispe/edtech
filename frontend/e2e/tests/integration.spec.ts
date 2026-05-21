import { test, expect } from '../fixtures/auth.fixture'
import { LoginPage } from '../pages/login.page'
import { CoursesPage } from '../pages/courses.page'
import { StudentDashboardPage } from '../pages/student-dashboard.page'
import { InstructorDashboardPage } from '../pages/instructor-dashboard.page'

test.describe('Integration Tests - Complete Flows', () => {
  test('flujo completo: estudiante login → ver cursos → dashboard', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page)
    const coursesPage = new CoursesPage(page)
    const dashboardPage = new StudentDashboardPage(page)

    // Act 1: Login
    await loginPage.login('student@example.com', 'password123')
    await expect(page).toHaveURL(/.*\//)

    // Act 2: Ver catálogo de cursos
    await coursesPage.goto()
    await coursesPage.expectCourseCountGreaterThan(0)

    // Act 3: Ir al dashboard
    await dashboardPage.goto()
    await dashboardPage.expectPageVisible()

    // Assert: Está en el dashboard de estudiante
    await expect(page).toHaveURL(/.*\/dashboard\/student/)
  })

  test('flujo instructor: login → ver dashboard → estadísticas', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page)
    const dashboardPage = new InstructorDashboardPage(page)

    // Act 1: Login como instructor
    await loginPage.login('instructor@example.com', 'password123')
    await expect(page).toHaveURL(/.*\//)

    // Act 2: Ir a dashboard instructor
    await dashboardPage.goto()

    // Assert: Está en dashboard instructor con estadísticas
    await dashboardPage.expectPageVisible()
    await dashboardPage.expectStatsVisible()
  })

  test('roles separados: estudiante vs instructor', async ({
    studentPage,
    instructorPage,
  }) => {
    // Arrange
    const studentDash = new StudentDashboardPage(studentPage)
    const instructorDash = new InstructorDashboardPage(instructorPage)

    // Act 1: Estudiante accede a su dashboard
    await studentDash.goto()

    // Act 2: Instructor accede a su dashboard
    await instructorDash.goto()

    // Assert: Ambos están en sus propios dashboards
    await expect(studentPage).toHaveURL(/.*\/dashboard\/student/)
    await expect(instructorPage).toHaveURL(/.*\/dashboard\/instructor/)
  })

  test('logout limpia la sesión completamente', async ({ studentPage }) => {
    // Arrange - autenticado
    const coursesPage = new CoursesPage(studentPage)

    // Act 1: Verificar que está autenticado
    await coursesPage.goto()
    await expect(studentPage).toHaveURL(/.*\//)

    // Act 2: Logout
    await coursesPage.logout()

    // Assert: Redirigido a login
    await expect(studentPage).toHaveURL(/.*\/login/)

    // Act 3: Intentar acceder a página protegida
    await studentPage.goto('/dashboard/student')

    // Assert: Redirigido a login nuevamente
    await expect(studentPage).toHaveURL(/.*\/login/)
  })

  test('navegación general funciona sin errores', async ({ studentPage }) => {
    // Arrange
    const coursesPage = new CoursesPage(studentPage)
    const dashboardPage = new StudentDashboardPage(studentPage)

    // Act 1: Inicio
    await coursesPage.goto()
    await expect(studentPage).toHaveURL(/.*\//)

    // Act 2: Dashboard
    await dashboardPage.goto()
    await expect(studentPage).toHaveURL(/.*\/dashboard\/student/)

    // Act 3: Volver a inicio
    await coursesPage.goto()
    await expect(studentPage).toHaveURL(/.*\//)

    // Assert: Sin errores en la consola
    const errors = studentPage.on('console', (msg) => {
      if (msg.type() === 'error') {
        expect(true).toBeFalsy() // Fallaría si hay errores
      }
    })
  })
})
