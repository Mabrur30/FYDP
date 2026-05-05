import { Router } from "express";
import {
  registerEngineer,
  registerClient,
  login,
} from "../controllers/authController";

const router = Router();

router.post("/engineer/register", registerEngineer);
router.post("/client/register", registerClient);
router.post("/login", login);

export default router;
