import { Router } from "express";

import { getCurrentUser, changePassword } from "../controllers/users.js";
const router = Router();

// Get current user
router.get("/profile", getCurrentUser);
router.put("/changepassword", changePassword);

export default router;
