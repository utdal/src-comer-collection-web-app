import { Router } from "express";

import { listPublicExhibitions, loadExhibitionPublic } from "../controllers/exhibitions.js";
import { signIn } from "../controllers/users.js";
const router = Router();

// Authentication
router.put("/signin", signIn);

// Read exhibitions
router.get("/exhibitions", listPublicExhibitions);
router.get("/exhibitions/:exhibitionId(\\d+)/load", loadExhibitionPublic);

export default router;
