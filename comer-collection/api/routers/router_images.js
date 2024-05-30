import { Router } from "express";
import { createImage, deleteImage, downloadImagePublic, getImage, getImagePublic, listDeletedImages, listImages, listImagesPublic, permanentlyDeleteImage, updateImage } from "../controllers/images.js";

const routerImagesPublic = Router();
const routerImagesCollectionManager = Router();
const routerDeletedImagesCollectionManager = Router();
const routerDeletedImagesAdmin = Router();

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

routerDeletedImagesCollectionManager.get("/", listDeletedImages);
routerDeletedImagesAdmin.delete("/:imageId(\\d+)", permanentlyDeleteImage);

export { routerImagesPublic, routerImagesCollectionManager, routerDeletedImagesCollectionManager, routerDeletedImagesAdmin };
