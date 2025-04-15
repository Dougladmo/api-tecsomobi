import { Request, Response } from "express";
import ChargingPointService from "../services/chargingPointService";
import { chargingPointSchema } from "../schemas/chargingPointSchema";
import { ValidationError } from "yup";

class ChargingPointController {
  static async create(req: Request, res: Response) {
    try {
      await chargingPointSchema.validate(req.body, { abortEarly: false });
      const created = await ChargingPointService.create(req.body);
      return res.status(201).json(created);
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.errors });
      }
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Erro inesperado" });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const chargingPoints = await ChargingPointService.list();
      return res.json(chargingPoints);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro inesperado" });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const chargingPoint = await ChargingPointService.getOne(Number(id));
      if (!chargingPoint) {
        return res.status(404).json({ error: "Ponto de recarga não encontrado" });
      }
      return res.json(chargingPoint);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro inesperado" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await chargingPointSchema.validate(req.body, { abortEarly: false });
      const updated = await ChargingPointService.update(Number(id), req.body);
      if (!updated) {
        return res.status(404).json({ error: "Ponto de recarga não encontrado" });
      }
      return res.json(updated);
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.errors });
      }
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Erro inesperado" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await ChargingPointService.delete(Number(id));
      if (!deleted) {
        return res.status(404).json({ error: "Ponto de recarga não encontrado" });
      }
      return res.json({ message: "Ponto de recarga excluído com sucesso" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro inesperado" });
    }
  }
}

export default ChargingPointController;
