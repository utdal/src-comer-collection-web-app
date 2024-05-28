import { Router } from "express";

import { listPublicExhibitions, loadExhibitionPublic } from "../controllers/exhibitions.js";
const router = Router();

// Read exhibitions
router.get("/exhibitions", listPublicExhibitions);
router.get("/exhibitions/:exhibitionId(\\d+)/load", loadExhibitionPublic);

export default router;
