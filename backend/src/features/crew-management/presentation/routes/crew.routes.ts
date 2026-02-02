import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { CrewController } from "../controller/crew.controller";
import { GetCrewsUseCase } from "../../application/get-crews-usecase";
import { PrimaCrewRepository } from "../../infrastructure/prisma-crew.repository";
import { checkJwt } from "../../../../shared/infrastructure/config/auth0-simple.config";
import { requirePermission } from "../../../authentication/infrastructure/middleware/agromano-rbac.middleware";
import { agroManoAuthMiddleware } from "../../../authentication/infrastructure/middleware/agromano-auth.middleware";
import { CreateCrewUseCase } from "../../application/create-crew-usecase";
import { UpdateCrewUseCase } from "../../application/update-crew-usecase";
import { validateBody } from "../../../../shared/utils/validate-body";
import { UpdateCrewSchema } from "../dto/update-crew.dto";
import { CreateCrewSchema } from "../dto/create-crew.dto";
import { DeleteCrewUseCase } from "../../application/delete-crew.usecase";
import { SearchCrewsUseCase } from "../../application/search-crew-usecase";

const router = Router();
const prisma = new PrismaClient();
const repo = new PrimaCrewRepository(prisma);

const getCrewUseCase = new GetCrewsUseCase(repo);
const createCrewUseCase = new CreateCrewUseCase(repo);
const updateCrewUseCase = new UpdateCrewUseCase(repo);
const deleteCrewUseCase = new DeleteCrewUseCase(repo);
const searchCrewUseCase = new SearchCrewsUseCase(repo);

const controller = new CrewController(
  getCrewUseCase,
  createCrewUseCase,
  updateCrewUseCase,
  deleteCrewUseCase,
  searchCrewUseCase,
);

router.get(
  "/",
  checkJwt,
  agroManoAuthMiddleware,
  requirePermission("trabajadores:delete"),
  controller.getAll,
);

router.get(
  "/:query",
  checkJwt,
  agroManoAuthMiddleware,
  requirePermission("trabajadores:delete"),
  controller.search,
);

router.post(
  "/",
  checkJwt,
  agroManoAuthMiddleware,
  requirePermission("trabajadores:delete"),
  validateBody(CreateCrewSchema),
  controller.create,
);

router.patch(
  "/:id",
  checkJwt,
  agroManoAuthMiddleware,
  requirePermission("trabajadores:delete"),
  validateBody(UpdateCrewSchema),
  controller.update,
);

router.delete(
  "/:id",
  checkJwt,
  agroManoAuthMiddleware,
  requirePermission("trabajadores:delete"),
  controller.delete,
);

export default router;
