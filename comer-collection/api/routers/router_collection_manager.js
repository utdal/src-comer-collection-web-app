import { Router } from "express";

import { deleteTag, listTags, getTag, createTag, updateTag } from "../controllers/tags.js";
import { manageImageTags } from "../controllers/imagetags.js";
import { manageImageArtists } from "../controllers/imageartists.js";
const router = Router();

// Handle tags
router.get("/tags", listTags);
router.get("/tags/:tagId(\\d+)", getTag);
router.post("/tags", createTag);
router.put("/tags/:tagId(\\d+)", updateTag);
router.delete("/tags/:tagId(\\d+)", deleteTag);

// Handle image/tag assignments
router.put("/imagetags", manageImageTags);

// Handle image/artist assignments
router.put("/imageartists", manageImageArtists);

export default router;
