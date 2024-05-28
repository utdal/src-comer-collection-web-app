import { Router } from "express";

import { listArtists, getArtist } from "../controllers/artists.js";
import { listTags, getTag } from "../controllers/tags.js";
import { listPublicExhibitions, loadExhibitionPublic } from "../controllers/exhibitions.js";
import { signIn } from "../controllers/users.js";
const router = Router();

// Authentication
router.put("/signin", signIn);

// Read artists
router.get("/artists", listArtists);
router.get("/artists/:artistId(\\d+)", getArtist);

// Read tags
router.get("/tags", listTags);
router.get("/tags/:tagId(\\d+)", getTag);

// Read exhibitions
router.get("/exhibitions", listPublicExhibitions);
router.get("/exhibitions/:exhibitionId(\\d+)/load", loadExhibitionPublic);

export default router;
