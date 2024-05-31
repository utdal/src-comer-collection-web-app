import { Router } from "express";
import { adminDeleteExhibition, adminEditExhibitionSettings, adminLoadExhibition, adminSaveExhibition, createExhibition, getExhibition, listExhibitions, listPublicExhibitions, ownerDeleteExhibition, ownerEditExhibitionSettings, ownerLoadExhibition, ownerSaveExhibition, publicLoadExhibition } from "../controllers/exhibitions.js";

const routerExhibitionPublic = Router();
const routerExhibitionUser = Router();
const routerExhibitionAdmin = Router();

// Read exhibitions

routerExhibitionPublic.get("/", listPublicExhibitions);
routerExhibitionAdmin.get("/", listExhibitions);

// Read specific exhibition

routerExhibitionPublic.get("/:exhibitionId(\\d+)/data", publicLoadExhibition);
routerExhibitionUser.get("/:exhibitionId(\\d+)/data", ownerLoadExhibition);
routerExhibitionAdmin.get("/:exhibitionId(\\d+)/data", adminLoadExhibition);

// Manage exhibitions

routerExhibitionUser.post("/", createExhibition);
routerExhibitionUser.put("/:exhibitionId(\\d+)", ownerEditExhibitionSettings);
routerExhibitionUser.delete("/:exhibitionId(\\d+)", ownerDeleteExhibition);

routerExhibitionAdmin.get("/:exhibitionId(\\d+)", getExhibition);
routerExhibitionAdmin.put("/:exhibitionId(\\d+)", adminEditExhibitionSettings);
routerExhibitionAdmin.delete("/:exhibitionId(\\d+)", adminDeleteExhibition);

// Manage specific exhibition

routerExhibitionUser.put("/:exhibitionId(\\d+)/data", ownerSaveExhibition);
routerExhibitionAdmin.put("/:exhibitionId(\\d+)/data", adminSaveExhibition);

export { routerExhibitionPublic, routerExhibitionUser, routerExhibitionAdmin };
