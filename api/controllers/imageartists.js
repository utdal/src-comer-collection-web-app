import db from "../sequelize.js";
import { manageManyToManyAssociation } from "./associations.js";
const { Image } = db;

/**
 * Calls manageManyToManyAssociation for Images and Artists.  In the application, images are
 * typically considered the primary entity, and artists are typically considered the secondary entity.
 * However, Image and Artist have a sequelize many-to-many relationship.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const manageImageArtists = async (req, res, next) => {
    const { images, artists } = req.body;
    await manageManyToManyAssociation(req, res, next, Image, Image.associations.Artists, images, artists);
};

export { manageImageArtists };
