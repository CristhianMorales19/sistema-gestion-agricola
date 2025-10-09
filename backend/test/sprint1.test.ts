import request from "supertest";
import app from "../../backend/src/app"; // tu app principal Express

describe("Sprint 1 - Pruebas de HU", () => {
  // HU-000: Consulta de empleados
  it("HU-000: debería devolver lista de empleados", async () => {
    const res = await request(app).get("/api/trabajadores");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // HU-001: Crear registro de trabajador
  it("HU-001: debería crear un trabajador", async () => {
    const nuevoTrabajador = { nombre: "Juan Pérez", puesto: "Obrero" };
    const res = await request(app).post("/api/trabajadores").send(nuevoTrabajador);
    expect(res.status).toBe(201);
    expect(res.body.nombre).toBe("Juan Pérez");
  });

  // HU-002: Asignar información laboral al trabajador
  it("HU-002: debería asignar información laboral", async () => {
    const infoLaboral = { trabajadorId: 1, salario: 500, departamento: "Campo" };
    const res = await request(app).put("/api/trabajadores/1/info").send(infoLaboral);
    expect(res.status).toBe(200);
    expect(res.body.salario).toBe(500);
  });

  // HU-005: Crear roles de usuario
  it("HU-005: debería crear un rol", async () => {
    const rol = { nombre: "ADMIN" };
    const res = await request(app).post("/api/roles").send(rol);
    expect(res.status).toBe(201);
    expect(res.body.nombre).toBe("ADMIN");
  });

  // HU-006: Asignar rol a usuario
  it("HU-006: debería asignar rol a usuario", async () => {
    const asignacion = { userId: 1, rolId: 1 };
    const res = await request(app).post("/api/usuarios/1/roles").send(asignacion);
    expect(res.status).toBe(200);
    expect(res.body.mensaje).toMatch(/rol asignado/i);
  });

  // HU-033: Login de usuario
  it("HU-033: debería loguear un usuario", async () => {
    const credenciales = { email: "admin@agromano.com", password: "Admin123!" };
    const res = await request(app).post("/api/auth/login").send(credenciales);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  // HU-034: Logout de usuario
  it("HU-034: debería cerrar sesión", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body.mensaje).toMatch(/logout exitoso/i);
  });
});
