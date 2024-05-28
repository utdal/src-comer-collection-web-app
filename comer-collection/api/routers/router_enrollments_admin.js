import { Router } from "express";
import { manageUserCourses } from "../controllers/enrollments.js";

const router = Router();

// Handle user/course assignments
router.put("/", manageUserCourses);

export default router;
