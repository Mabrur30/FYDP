import { Router } from "express";
import {
  acceptRequest,
  createPost,
  createRequest,
  getConnections,
  getPosts,
  getRequests,
  likePost,
  rejectRequest,
} from "../controllers/networkController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/connections", getConnections);
router.get("/requests", getRequests);
router.post("/requests", createRequest);
router.post("/requests/:requesterId/accept", acceptRequest);
router.post("/requests/:requesterId/reject", rejectRequest);

router.get("/posts", getPosts);
router.post("/posts", createPost);
router.post("/posts/:id/like", likePost);

export default router;
