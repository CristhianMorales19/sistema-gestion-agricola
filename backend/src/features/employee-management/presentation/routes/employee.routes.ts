import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { PrismaEmployeeRepository } from "../../infrastructure/prisma-employee.repository";
import { GetEmployeesUseCase } from "../../application/get-employees.usecase";
import { EmployeeController } from "../controller/employee.controller";
import { validateBody } from "../middleware/validate-body";
import { CreateEmployeeSchema } from "../dto/create-employee.dto";

import { checkJwt } from "../../../../shared/infrastructure/config/auth0-simple.config";
import { agroManoAuthMiddleware } from "../../../authentication/infrastructure/middleware/agromano-auth.middleware";
import { requireAnyPermission } from "../../../authentication/infrastructure/middleware/agromano-rbac.middleware";
import { CreateEmployeeUseCase } from "../../application/create-employee.usecase";
import { requirePermission } from "../../../authentication/infrastructure/middleware/agromano-rbac.middleware";
import { DeleteEmployeeUseCase } from "../../application/delete-employee.usecass";
import { SearchEmployeesUseCase } from "../../application/search.employees.usecase";
import { GetEmployeesWithoutCrewUseCase } from "../../application/get-employees-without-crew.usecase";
import { GetEmployeeByIdUseCase } from "../../application/get-employee-by-id.usecase";
import { UpdateEmployeeUseCase } from "../../application/update-employee.usecase";
import { UpdateEmployeeSchema } from "../dto/update-employee.dto";

const router = Router();
const prisma = new PrismaClient();

const repo = new PrismaEmployeeRepository(prisma);
const getEmployeesUseCase = new GetEmployeesUseCase(repo);
const createEmployeeUseCase = new CreateEmployeeUseCase(repo);
const deleteEmployee = new DeleteEmployeeUseCase(repo);
const searchEmployees = new SearchEmployeesUseCase(repo);
const getEmployeesWithoutCrew = new GetEmployeesWithoutCrewUseCase(repo);
const getEmployeeById = new GetEmployeeByIdUseCase(repo);
const updateEmployee = new UpdateEmployeeUseCase(repo);

const controller = new EmployeeController(
  getEmployeesUseCase,
  createEmployeeUseCase,
  deleteEmployee,
  searchEmployees,
  getEmployeesWithoutCrew,
  getEmployeeById,
  updateEmployee,
);

router.get(
  "/",
  checkJwt,
  agroManoAuthMiddleware,
  requireAnyPermission(["trabajadores:read:all", "trabajadores:read:own"]),
  controller.getAll,
);

router.post(
  "/",
  checkJwt,
  agroManoAuthMiddleware,
  validateBody(CreateEmployeeSchema),
  requirePermission("trabajadores:create"),
  controller.create,
);

router.delete(
  "/:id",
  checkJwt,
  agroManoAuthMiddleware,
  requirePermission("trabajadores:delete"),
  controller.delete,
);

router.get(
  "/search/:query",
  checkJwt,
  agroManoAuthMiddleware,
  requireAnyPermission(["trabajadores:read:all", "trabajadores:read:own"]),
  controller.search,
);

router.get(
  "/sin-cuadrilla",
  checkJwt,
  agroManoAuthMiddleware,
  requireAnyPermission(["trabajadores:read:all", "trabajadores:read:own"]),
  controller.getWithoutCrew,
);

router.get(
  "/:id",
  checkJwt,
  agroManoAuthMiddleware,
  requireAnyPermission(["trabajadores:read:all", "trabajadores:read:own"]),
  controller.getById,
);

router.put(
  "/:id",
  checkJwt,
  agroManoAuthMiddleware,
  requireAnyPermission(["trabajadores:read:all", "trabajadores:read:own"]),
  validateBody(UpdateEmployeeSchema),
  controller.update,
);

export default router;
