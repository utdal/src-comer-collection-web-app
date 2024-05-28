import { Router } from "express";
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse } from "../controllers/courses.js";

const routerCoursesAdmin = Router();

routerCoursesAdmin.get("/", listCourses);
routerCoursesAdmin.get("/:courseId(\\d+)", getCourse);
routerCoursesAdmin.post("/", createCourse);
routerCoursesAdmin.put("/:courseId(\\d+)", updateCourse);
routerCoursesAdmin.delete("/:courseId(\\d+)", deleteCourse);

export { routerCoursesAdmin };
