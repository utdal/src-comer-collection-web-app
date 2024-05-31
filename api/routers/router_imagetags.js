import { Router } from "express";
import { manageImageTags } from "../controllers/imagetags.js";

const routerImageTagsAdmin = Router();

// Handle image/tag assignments
routerImageTagsAdmin.put("/", manageImageTags);

export { routerImageTagsAdmin };
