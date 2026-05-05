import { Router } from "express";
import {
  deleteProjectById,
  createProject,
  getProjectById,
  listProjects,
  updateProjectById,
} from "../controllers/projectController";

const router = Router();

router.get("/", listProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);
router.put("/:id", updateProjectById);
router.delete("/:id", deleteProjectById);

export default router;
