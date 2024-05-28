import { Router } from "express";

import { listExhibitions, getExhibition, adminEditExhibitionSettings, adminDeleteExhibition, loadExhibitionAdmin, saveExhibitionAdmin } from "../controllers/exhibitions.js";
const router = Router();

// Handle exhibitions
router.get("/exhibitions", listExhibitions);
router.get("/exhibitions/:exhibitionId(\\d+)", getExhibition);
router.put("/exhibitions/:exhibitionId(\\d+)", adminEditExhibitionSettings);
router.delete("/exhibitions/:exhibitionId(\\d+)", adminDeleteExhibition);

router.get("/exhibitions/:exhibitionId(\\d+)/load", loadExhibitionAdmin);
router.put("/exhibitions/:exhibitionId(\\d+)/save", saveExhibitionAdmin);

export default router;
