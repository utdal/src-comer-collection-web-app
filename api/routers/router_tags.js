import { Router } from "express";
import { deleteTag, listTags, getTag, createTag, updateTag } from "../controllers/tags.js";

const routerTagsPublic = Router();
const routerTagsCollectionManager = Router();

// Read artists
routerTagsPublic.get("/", listTags);
routerTagsPublic.get("/:tagId(\\d+)", getTag);

// Modify artists
routerTagsCollectionManager.post("/", createTag);
routerTagsCollectionManager.put("/:tagId(\\d+)", updateTag);
routerTagsCollectionManager.delete("/:tagId(\\d+)", deleteTag);

export { routerTagsPublic, routerTagsCollectionManager };
