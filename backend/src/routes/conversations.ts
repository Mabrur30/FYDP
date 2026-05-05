import { Router } from "express";
import {
  listConversations,
  listMessages,
  postMessage,
} from "../controllers/chatController";

const router = Router();

router.get("/", listConversations);
router.get("/:id/messages", listMessages);
router.post("/:id/messages", postMessage);

export default router;
