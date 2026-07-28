import { Router } from "express";
import {
  createEngineer,
  deleteEngineerById,
  getEngineerById,
  getEngineerProfile,
  listEngineers,
  updateEngineerById,
} from "../controllers/engineerController";
import {
  getEngineerBids,
  getEngineerEarnings,
  getEngineerProjects,
} from "../controllers/engineerDashboardController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", listEngineers);
router.post("/", createEngineer);
router.get("/:id/profile", requireAuth, getEngineerProfile);
router.get("/:id/projects", requireAuth, getEngineerProjects);
router.get("/:id/bids", requireAuth, getEngineerBids);
router.get("/:id/earnings", requireAuth, getEngineerEarnings);
router.get("/:id", requireAuth, getEngineerById);
router.put("/:id", requireAuth, updateEngineerById);
router.delete("/:id", requireAuth, deleteEngineerById);

export default router;
