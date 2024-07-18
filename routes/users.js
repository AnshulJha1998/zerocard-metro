import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  recordJourney,
} from "../controllers/user.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.put("/:id", verifyUser, updateUser);

router.delete("/:id", verifyUser, deleteUser);

router.get("/:id", verifyUser, getUser);

router.get("/", verifyAdmin, getUsers);

router.post("/recordJourney", verifyUser, recordJourney);

export default router;
