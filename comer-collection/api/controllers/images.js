import createError from "http-errors";
import db from "../sequelize.js";
import path, { join } from "path";
import { deleteItem, updateItem, listItems, getItem, createItem } from "./items.js";
import imageType from "image-type";
import url from "url";
import { isAtLeastCollectionManager } from "../routers/router_main.js";
const { Image, Artist, Tag, Exhibition } = db;

/**
 * Uses the listItems function on the Image model and includes Artists and Tags
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const listImagesPublic = async (req, res, next) => {
    /**
     * More suitable function is available for collection managers and above
     */
    if (isAtLeastCollectionManager(req.app_user)) {
        return next();
    }
    await listItems(req, res, next, Image, [
        Artist, Tag
    ]);
};

/**
 * Uses the listItems function on the Image model and includes Artists, Tags, and Exhibitions.
 *
 * If the current user is an admin, return all information about the Exhibitions.
 *
 * If the current user is a collection manager, return only the ID numbers to allow
 * calculation of the length of the Exhibitions array.  Sequelize will not include
 * the Exhibitions array unless at least one field is included from the Exhibition model.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const listImages = async (req, res, next) => {
    await listItems(req, res, next, Image.scope("admin"), [
        Artist, Tag,
        (req.app_user.is_admin && Exhibition) ||
        (req.app_user.is_collection_manager && {
            model: Exhibition,
            attributes: ["id"]
        })
    ]);
};

/**
 * Uses the createItem function on the Image model
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const createImage = async (req, res, next) => {
    await createItem(req, res, next, Image);
};

/**
 * Uses the getItem function on the Image model and includes Artists and Tags.
 * The imageId parameter in the request URL params object is used as the primary key.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const getImagePublic = async (req, res, next) => {
    /**
     * More suitable function is available for collection managers and above
     */
    if (isAtLeastCollectionManager(req.app_user)) {
        return next();
    }
    await getItem(req, res, next, Image, [
        Artist, Tag
    ], req.params.imageId);
};

/**
 * Proxies an image from the file server to the client.
 * The imageId parameter in the request URL params object is used as the primary key.
 *
 * Retrieves the image URL from the database, then fetches the image from the file server.
 * Verifies the file server's response actually contains an image.
 *
 * If the image was retrieved and is actually a valid image,
 * returns the image to the client in the response.
 *
 * Otherwise, returns a placeholder "image coming soon" file to the client in the response
 * to ensure the client receives a valid image.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const downloadImagePublic = async (req, res, next) => {
    try {
        const image = await Image.findByPk(req.params.imageId, {
            attributes: {
                include: ["url", "thumbnailUrl"]
            }
        });
        try {
            if (!image?.url && !image?.thumbnailUrl) {
                throw new Error("No URL");
            }
            const downloadedImage = await fetch(image.url ?? image.thumbnailUrl);
            const imageData = await downloadedImage.blob();
            const imageBuffer = await imageData.arrayBuffer();
            const type = await imageType(imageBuffer);
            if (type && type.mime.startsWith("image/")) {
                res.setHeader("Content-Type", type.mime);
                res.setHeader("Cross-Origin-Resource-Policy", "same-site");
                res.status(200).send(Buffer.from(imageBuffer));
            } else {
                throw new Error("Not an image");
            }
        } catch (e) {
            res.setHeader("Content-Type", "image/jpg");
            res.setHeader("Cross-Origin-Resource-Policy", "same-site");
            res.status(200).sendFile(join(path.dirname(url.fileURLToPath(import.meta.url)), "../../public/images", "image_coming_soon.jpg"));
        }
    } catch (e) {
        next(createError(500, { debugMessage: e.message }));
    }
};

/**
 * Uses the getItem function on the Image model and includes Artists, Tags, and Exhibitions.
 * The imageId parameter in the request URL params object is used as the primary key
 *
 * If the current user is an admin, return all information about the Exhibitions.
 *
 * If the current user is a collection manager, return only the ID numbers to allow
 * calculation of the length of the Exhibitions array.  Sequelize will not include
 * the Exhibitions array unless at least one field is included from the Exhibition model.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const getImage = async (req, res, next) => {
    await getItem(req, res, next, Image.scope("admin"), [
        Artist, Tag,
        (req.app_user.is_admin && Exhibition) ||
        (req.app_user.is_collection_manager && {
            model: Exhibition,
            attributes: ["id"]
        })
    ], req.params.imageId);
};

/**
 * Uses the updateItem function on the User model.
 * The userId parameter in the request URL params object is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const updateImage = async (req, res, next) => {
    await updateItem(req, res, next, Image, req.params.imageId);
};

/**
 * Uses the deleteItem function on the User model
 * The userId parameter in the request URL params object is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const deleteImage = async (req, res, next) => {
    await deleteItem(req, res, next, Image, req.params.imageId);
};

export { downloadImagePublic, listImages, listImagesPublic, createImage, getImage, getImagePublic, updateImage, deleteImage };
