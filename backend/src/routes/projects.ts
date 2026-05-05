import { Router } from "express";
import {
  createProject,
  getProjectById,
  listProjects,
} from "../controllers/projectController";

const router = Router();

router.get("/", listProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);

export default router;
