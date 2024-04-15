import { Router } from "express";

import { createExhibition, ownerEditExhibitionSettings, ownerDeleteExhibition, loadExhibitionOwner, saveExhibitionOwner } from "../controllers/exhibitions.js";
const router = Router();

// Handle exhibitions
router.post("/exhibitions", createExhibition);
router.put("/exhibitions/:exhibitionId(\\d+)", ownerEditExhibitionSettings);
router.delete("/exhibitions/:exhibitionId(\\d+)", ownerDeleteExhibition);
router.get("/exhibitions/:exhibitionId(\\d+)/load", loadExhibitionOwner);
router.put("/exhibitions/:exhibitionId(\\d+)/save", saveExhibitionOwner);

export default router;
