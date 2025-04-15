import express from "express";
import cors from "cors";
import chargingPointRoutes from "./routes/chargingPointRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/chargingPoints", chargingPointRoutes);

app.use("/admin", adminRoutes);

export default app;
