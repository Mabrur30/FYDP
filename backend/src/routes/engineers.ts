import { Router } from "express";
import {
  createEngineer,
  deleteEngineerById,
  getEngineerById,
  listEngineers,
  updateEngineerById,
} from "../controllers/engineerController";

const router = Router();

router.get("/", listEngineers);
router.post("/", createEngineer);
router.get("/:id", getEngineerById);
router.put("/:id", updateEngineerById);
router.delete("/:id", deleteEngineerById);

export default router;
