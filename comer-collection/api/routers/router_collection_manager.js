import { Router } from "express";

import { manageImageTags } from "../controllers/imagetags.js";
import { manageImageArtists } from "../controllers/imageartists.js";
const router = Router();

// Handle image/tag assignments
router.put("/imagetags", manageImageTags);

// Handle image/artist assignments
router.put("/imageartists", manageImageArtists);

export default router;
