import { Router } from "express";
import { createImage, deleteImage, downloadImagePublic, getImage, getImagePublic, listImages, listImagesPublic, updateImage } from "../controllers/images.js";

const routerImagesPublic = Router();
const routerImagesCollectionManager = Router();

// Read images
routerImagesPublic.get("/", listImagesPublic);
routerImagesPublic.get("/:imageId(\\d+)", getImagePublic);
// Download images
routerImagesPublic.get("/:imageId/download", downloadImagePublic);

routerImagesCollectionManager.get("/", listImages);
routerImagesCollectionManager.get("/:imageId(\\d+)", getImage);
routerImagesCollectionManager.post("/", createImage);
routerImagesCollectionManager.put("/:imageId(\\d+)", updateImage);
routerImagesCollectionManager.delete("/:imageId(\\d+)", deleteImage);

export { routerImagesPublic, routerImagesCollectionManager };
