import { Router } from "express";
import { manageImageArtists } from "../controllers/imageartists.js";

const routerImageArtistsAdmin = Router();

// Handle image/artist assignments
routerImageArtistsAdmin.put("/", manageImageArtists);

export { routerImageArtistsAdmin };
