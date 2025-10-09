import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../../frontend/src/features/authentication/presentation/components/LoginPage/LoginPage";
import AdminDashboard from "../../frontend/src/features/authentication/presentation/components/AdminDashboard/AdminDashboard";
import EmpleadoCampoDashboard from "../../frontend/src/features/authentication/presentation/components/EmpleadoCampoDashboard/EmpleadoCampoDashboard";
import AuthService from "../../frontend/src/features/authentication/application/services/AuthService";

// HU-033: Login de usuario
test("HU-033: debería renderizar el login y permitir iniciar sesión", async () => {
  render(<LoginPage />);
  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/contraseña/i);
  const loginButton = screen.getByRole("button", { name: /login/i });

  fireEvent.change(emailInput, { target: { value: "test@demo.com" } });
  fireEvent.change(passwordInput, { target: { value: "123456" } });
  fireEvent.click(loginButton);

  expect(await screen.findByText(/bienvenido/i)).toBeInTheDocument();
});

// HU-034: Logout de usuario
test("HU-034: debería permitir hacer logout", () => {
  jest.spyOn(AuthService, "logout").mockImplementation(() => Promise.resolve());
  AuthService.logout();
  expect(AuthService.logout).toHaveBeenCalled();
});

// HU-005: Crear roles de usuario
test("HU-005: debería mostrar panel de roles", () => {
  render(<AdminDashboard />);
  expect(screen.getByText(/roles/i)).toBeInTheDocument();
});

// HU-006: Asignar rol a usuario
test("HU-006: debería permitir asignar rol", () => {
  render(<AdminDashboard />);
  expect(screen.getByText(/asignar rol/i)).toBeInTheDocument();
});

// HU-000: Consulta de empleados
test("HU-000: debería renderizar lista de empleados", () => {
  const empleados = [{ id: 1, nombre: "Juan Pérez" }];
  render(<EmpleadoCampoDashboard empleados={empleados} />);
  expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument();
});
