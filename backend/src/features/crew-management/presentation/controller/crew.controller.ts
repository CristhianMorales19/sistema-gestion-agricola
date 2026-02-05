import { Request, Response } from "express";
import { GetCrewsUseCase } from "../../application/get-crews-usecase";
import { CreateCrewUseCase } from "../../application/create-crew-usecase";
import { UpdateCrewUseCase } from "../../application/update-crew-usecase";
import { DeleteCrewUseCase } from "../../application/delete-crew.usecase";
import { SearchCrewsUseCase } from "../../application/search-crew-usecase";

export class CrewController {
  constructor(
    private getCrews: GetCrewsUseCase,
    private createCrew: CreateCrewUseCase,
    private updateCrew: UpdateCrewUseCase,
    private deleteCrew: DeleteCrewUseCase,
    private searchCrew: SearchCrewsUseCase,
  ) {}

  getAll = async (_req: Request, res: Response) => {
    try {
      const crews = await this.getCrews.execute();
      res.json({
        success: true,
        data: crews,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error al obtener cuadrillas",
      });
    }
  };

  create = async (_req: Request, res: Response) => {
    try {
      const userId = (_req as any).user?.usuario_id;
      await this.createCrew.execute(_req.body, userId);
      return res.status(201).json({
        success: true,
        message: "Cuadrilla creada",
      });
    } catch (error: any) {
      console.log(error);
      if (error.message.includes("no existen")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message.includes("Código")) {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error al crear cuadrilla",
      });
    }
  };

  update = async (_req: Request, res: Response) => {
    try {
      const crewId = Number(_req.params.id);
      const userId = (_req as any).user.usuario_id;
      await this.updateCrew.execute(_req.body, userId, crewId);

      res.json({
        success: true,
        message: "Cuadrilla actualizada",
      });
    } catch (error: any) {
      console.log(error);
      const message = (error as Error).message;

      if (error.message.includes("no existe")) {
        return res.status(404).json({
          success: false,
          message,
        });
      }

      if (message.includes("no existen")) {
        return res.status(400).json({
          success: false,
          message,
        });
      }

      if (error.code === "P2002") {
        return res.status(500).json({
          success: false,
          message: "Ya existe una cuadrilla con este código",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error al actualizar cuadrilla",
      });
    }
  };

  delete = async (_req: Request, res: Response) => {
    const crewId = Number(_req.params.id);

    try {
      const userId = (_req as any).user.usuario_id;
      await this.deleteCrew.execute(userId, crewId);

      res.json({
        success: true,
        message: "Cuadrilla eliminada",
      });
    } catch (error) {
      console.log(error);
      const message = (error as Error).message;

      if (message.includes("no existe")) {
        return res.status(404).json({ success: false, message });
      }

      return res.status(500).json({
        success: false,
        message: "Error al eliminar cuadrilla",
      });
    }
  };

  search = async (_req: Request, res: Response) => {
    try {
      const { query } = _req.params;
      const data = await this.searchCrew.execute(query);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error al buscar cuadrillas",
      });
    }
  };
}
