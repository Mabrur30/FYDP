import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  awardBid,
  createBid,
  listEngineerBids,
  listProjectBids,
  updateBid,
  withdrawBid,
} from "../controllers/bidController";

const router = Router();

router.use(requireAuth);
router.get("/engineer/:engineerId", listEngineerBids);
router.get("/project/:projectId", listProjectBids);
router.post("/", createBid);
router.put("/:id", updateBid);
router.delete("/:id", withdrawBid);
router.post("/:id/award", awardBid);

export default router;
