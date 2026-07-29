import { Router } from "express";
import {
  createProjectPhase,
  deleteProjectById,
  createProject,
  getProjectProgress,
  getProjectById,
  listProjectPhases,
  listProjects,
  updateProjectPhase,
  updateProjectStatus,
  updateProjectById,
} from "../controllers/projectController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", listProjects);
router.post("/", createProject);
router.get("/:id/progress", getProjectProgress);
router.get("/:id/phases", listProjectPhases);
router.post("/:id/phases", createProjectPhase);
router.get("/:id", getProjectById);
router.put("/:id", updateProjectById);
router.patch("/:id/status", updateProjectStatus);
router.patch("/:id/phases/:phaseId", updateProjectPhase);
router.delete("/:id", deleteProjectById);

export default router;
