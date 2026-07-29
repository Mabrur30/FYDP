import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  listNotifications,
  markNotificationRead,
} from "../controllers/notificationController";

const router = Router();

router.use(requireAuth);
router.get("/", listNotifications);
router.post("/:id/read", markNotificationRead);

export default router;
