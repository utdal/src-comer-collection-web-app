import db from "../sequelize.js";
const { Image } = db;
import { manageManyToManyAssociation } from "./associations.js";

const manageImageTags = async (req, res, next) => {
    const { images, tags } = req.body;
    await manageManyToManyAssociation(req, res, next, Image, Image.associations.Tags, images, tags);
};

export { manageImageTags };