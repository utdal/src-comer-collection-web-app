import { Router } from "express";
import { createImage, deleteImage, getImage, listImages, updateImage } from "../controllers/images.js";

const routerImagesCollectionManager = Router();

routerImagesCollectionManager.get("/", listImages);
routerImagesCollectionManager.get("/:imageId(\\d+)", getImage);
routerImagesCollectionManager.post("/", createImage);
routerImagesCollectionManager.put("/:imageId(\\d+)", updateImage);
routerImagesCollectionManager.delete("/:imageId(\\d+)", deleteImage);

export { routerImagesCollectionManager };
