import db from "../sequelize.js";
import { manageManyToManyAssociation } from "./associations.js";
const { Image } = db;

const manageImageTags = async (req, res, next) => {
    const { images, tags } = req.body;
    await manageManyToManyAssociation(req, res, next, Image, Image.associations.Tags, images, tags);
};

export { manageImageTags };
