import { Router } from "express";
import { manageUserCourses } from "../controllers/enrollments.js";

const routerEnrollmentsAdmin = Router();

// Handle user/course assignments
routerEnrollmentsAdmin.put("/", manageUserCourses);

export { routerEnrollmentsAdmin };
