import { Router } from "express";
import {
  createClient,
  deleteClientById,
  getClientById,
  listClients,
  updateClientById,
} from "../controllers/clientController";

const router = Router();

router.get("/", listClients);
router.post("/", createClient);
router.get("/:id", getClientById);
router.put("/:id", updateClientById);
router.delete("/:id", deleteClientById);

export default router;
