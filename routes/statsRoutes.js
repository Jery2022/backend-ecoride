import { Router } from "express";
import { getStats } from "../controllers/statsController.js";

const statsRouter = Router();


// Route pour récupérer toutes les statisiques
statsRouter.get("/stats", getStats);

export default statsRouter;
