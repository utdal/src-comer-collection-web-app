import { Router } from "express";
import { createArtist, deleteArtist, getArtist, listArtists, updateArtist } from "../controllers/artists.js";

const routerArtistsPublic = Router();
const routerArtistsCollectionManager = Router();

// Read artists
routerArtistsPublic.get("/", listArtists);
routerArtistsPublic.get("/:artistId(\\d+)", getArtist);

// Modify artists
routerArtistsCollectionManager.post("/", createArtist);
routerArtistsCollectionManager.put("/:artistId(\\d+)", updateArtist);
routerArtistsCollectionManager.delete("/:artistId(\\d+)", deleteArtist);

export { routerArtistsPublic, routerArtistsCollectionManager };
