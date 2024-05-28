import { Router } from "express";
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse } from "../controllers/courses.js";

const router = Router();

router.get("/", listCourses);
router.get("/:courseId(\\d+)", getCourse);
router.post("/", createCourse);
router.put("/:courseId(\\d+)", updateCourse);
router.delete("/:courseId(\\d+)", deleteCourse);

export default router;
