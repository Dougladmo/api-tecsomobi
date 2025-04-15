import { Router } from "express";
import { adminInit, adminLogin, getProfile } from "../controllers/adminController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/init", adminInit);
router.post("/login", adminLogin);
router.get("/profile", authMiddleware, getProfile);

export default router;
