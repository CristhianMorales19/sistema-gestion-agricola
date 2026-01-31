import { Request, Response } from "express";
import { GetEmployeesUseCase } from "../../application/get-employees.usecase";
import { CreateEmployeeUseCase } from "../../application/create-employee.usecase";
import { DeleteEmployeeUseCase } from "../../application/delete-employee.usecass";
import { SearchEmployeesUseCase } from "../../application/search.employees.usecase";
import { GetEmployeesWithoutCrewUseCase } from "../../application/get-employees-without-crew.usecase";
import { GetEmployeeByIdUseCase } from "../../application/get-employee-by-id.usecase";
import { UpdateEmployeeUseCase } from "../../application/update-employee.usecase";

export class EmployeeController {
  constructor(
    private getEmployees: GetEmployeesUseCase,
    private createEmployee: CreateEmployeeUseCase,
    private deleteEmployee: DeleteEmployeeUseCase,
    private searchEmployees: SearchEmployeesUseCase,
    private getEmployeesWithoutCrew: GetEmployeesWithoutCrewUseCase,
    private getEmployeeById: GetEmployeeByIdUseCase,
    private updateEmployeeUseCase: UpdateEmployeeUseCase,
  ) {}

  getAll = async (_req: Request, res: Response) => {
    try {
      const employees = await this.getEmployees.execute();
      res.json({
        success: true,
        data: employees,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error al obtener empleados",
      });
    }
  };

  create = async (req: Request, res: Response) => {
    const userId = (req as any).user?.usuario_id;
    try {
      await this.createEmployee.execute(req.body, userId);

      res.status(201).json({
        success: true,
        message: "Empleado creado",
      });
    } catch (error: any) {
      console.error(error);
      if (error.message.includes("cédula")) {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message.includes("fecha")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Error al crear empleado",
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.deleteEmployee.execute(id);

      res.json({
        success: true,
        message: "Empleado eliminado",
      });
    } catch (error: any) {
      console.error(error);
      if (error.message === "Empleado no encontrado") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      res.status(500).json({
        success: false,
        message: "Error al eliminar empleado",
      });
    }
  };

  search = async (req: Request, res: Response) => {
    try {
      const query = req.params.query;

      const employees = await this.searchEmployees.execute(query);

      res.json({
        success: true,
        data: employees,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error al buscar empleado",
      });
    }
  };

  getWithoutCrew = async (_req: Request, res: Response) => {
    try {
      const employees = await this.getEmployeesWithoutCrew.execute();

      res.json({
        success: true,
        data: employees,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error al obtener empleados sin cuadrilla",
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const result = await this.getEmployeeById.execute(id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Empleado no encontrado",
        });
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error al obtener empleado",
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.usuario_id;
      const employeeId = Number(req.params.id);

      await this.updateEmployeeUseCase.execute(employeeId, req.body, userId);

      res.json({ success: true, message: "Empleado actualizado" });
    } catch (error: any) {
      console.error(error);
      if (error.message === "Empleado no encontrado") {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(500).json({
        success: false,
        message: "Error en el sistema",
      });
    }
  };
}
