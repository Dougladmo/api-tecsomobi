import { Router } from "express";
import ChargingPointController from "../controllers/chargingPointController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, ChargingPointController.create);
router.get("/", ChargingPointController.list);
router.get("/:id", ChargingPointController.getOne);
router.put("/:id", authMiddleware, ChargingPointController.update);
router.delete("/:id", authMiddleware, ChargingPointController.delete);

export default router;
