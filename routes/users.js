import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  recordJourney,
  rechargeUserCard,
  getAllSummaries,
} from "../controllers/user.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.put("/:id", verifyUser, updateUser);

router.delete("/:id", verifyUser, deleteUser);

router.get("/:id", verifyUser, getUser);

router.get("/", verifyAdmin, getUsers);

router.get("/get/summaries", verifyAdmin, getAllSummaries);

router.post("/recordJourney", verifyUser, recordJourney);

router.post("/recharge", verifyUser, rechargeUserCard);

export default router;
