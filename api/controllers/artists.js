import db from "../sequelize.js";
import { updateItem, deleteItem, listItems, createItem, getItem } from "./items.js";
const { Artist, Image } = db;

/**
 * Uses the listItems function on the Artist model and includes Images
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const listArtists = async (req, res, next) => {
    await listItems(req, res, next, Artist, [Image], req.params.artistId);
};

/**
 * Uses the createItem function on the Artist model
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const createArtist = async (req, res, next) => {
    await createItem(req, res, next, Artist);
};

/**
 * Uses the getItem function on the Artist model and includes Images.
 * The artistId parameter in the request URL params object is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const getArtist = async (req, res, next) => {
    await getItem(req, res, next, Artist, [Image], req.params.artistId);
};

/**
 * Uses the updateItem function on the Artist model.
 * The artistId parameter in the request URL params object is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const updateArtist = async (req, res, next) => {
    await updateItem(req, res, next, Artist, req.params.artistId);
};

/**
 * Uses the deleteItem function on the Artist model
 * The artistId parameter in the request URL params object is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const deleteArtist = async (req, res, next) => {
    await deleteItem(req, res, next, Artist, req.params.artistId);
};

export { listArtists, createArtist, getArtist, updateArtist, deleteArtist };
