import db from "../sequelize.js";
import { manageManyToManyAssociation } from "./associations.js";
const { Image } = db;

/**
 * Calls manageManyToManyAssociation for Images and Tags.  In the application, images are
 * typically considered the primary entity, and tags are typically considered the secondary entity.
 * However, Image and Tag have a sequelize many-to-many relationship.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const manageImageTags = async (req, res, next) => {
    const { images, tags } = req.body;
    await manageManyToManyAssociation(req, res, next, Image, Image.associations.Tags, images, tags);
};

export { manageImageTags };
