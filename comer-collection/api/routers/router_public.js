import { Router } from "express";

import { listTags, getTag } from "../controllers/tags.js";
import { listPublicExhibitions, loadExhibitionPublic } from "../controllers/exhibitions.js";
import { signIn } from "../controllers/users.js";
const router = Router();

// Authentication
router.put("/signin", signIn);

// Read tags
router.get("/tags", listTags);
router.get("/tags/:tagId(\\d+)", getTag);

// Read exhibitions
router.get("/exhibitions", listPublicExhibitions);
router.get("/exhibitions/:exhibitionId(\\d+)/load", loadExhibitionPublic);

export default router;
