import db from "../sequelize.js";
import { manageManyToManyAssociation } from "./associations.js";
const { Image } = db;

const manageImageArtists = async (req, res, next) => {
    const { images, artists } = req.body;
    await manageManyToManyAssociation(req, res, next, Image, Image.associations.Artists, images, artists);
};

export { manageImageArtists };
