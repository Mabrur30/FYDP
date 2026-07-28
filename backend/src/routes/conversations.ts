import { Router } from "express";
import {
  listConversations,
  listMessages,
  postMessage,
} from "../controllers/chatController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, listConversations);
router.get("/:id/messages", requireAuth, listMessages);
router.post("/:id/messages", requireAuth, postMessage);

export default router;
