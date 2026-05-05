import { Router } from "express";
import {
  getUserById,
  listEngineers,
  updateUserById,
} from "../controllers/userController";

const router = Router();

router.get("/", listEngineers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);

export default router;
