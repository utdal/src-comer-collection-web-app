import createError from "http-errors";
import db from "../sequelize.js";
import { Op } from "sequelize";
const { sequelize } = db;

/**
 * Generic GET function for database items
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @param {import("sequelize").Model} model The Sequelize model to query
 * @param {import("sequelize").IncludeOptions} include The include options to pass to findByPk
 * @param {String | number} itemId The primary key of the item to retrieve
 * @param {Object} itemFunctions Additional calculations to perform on the item and include in the returned item
 */
const getItem = async (req, res, next, model, include, itemId, itemFunctions = {}) => {
    try {
        if (req.body.id) {
            throw new Error("The request body should not contain an ID.  Put the ID in the URL.");
        }
        const item = await model.findByPk(itemId, { include });
        if (!item) {
            next(createError(404));
        }
        const i = item.toJSON();
        for (const f in itemFunctions) {
            i[f] = itemFunctions[f](i);
        }
        res.status(200).json({ data: i });
    } catch (e) {
        next(createError(400, { debugMessage: e.message }));
    }
};

/**
 * Generic LIST function for database items
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @param {import("sequelize").Model} model The Sequelize model to query
 * @param {import("sequelize").IncludeOptions} include The include options to pass to findAll
 * @param {import("sequelize").WhereOptions} where The where options to pass to findAll
 * @param {Object} itemFunctions Additional calculations to perform on the items and include in the returned items
 */
const listItems = async (req, res, next, model, include, where, itemFunctions = {}) => {
    try {
        const items = Array.from(await model.findAll({ include, where })).map((i) => {
            i = i.toJSON();
            for (const f in itemFunctions) {
                i[f] = itemFunctions[f](i);
            }
            return i;
        });
        res.status(200).json({ data: items });
    } catch (e) {
        next(createError(400, { debugMessage: e.message }));
    }
};

/**
 * Generic LIST function for DELETED database items
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @param {import("sequelize").Model} model The Sequelize model to query
 * @param {import("sequelize").IncludeOptions} include The include options to pass to findAll
 * @param {import("sequelize").WhereOptions} where The where options to pass to findAll
 * @param {Object} itemFunctions Additional calculations to perform on the items and include in the returned items
 */
const listDeletedItems = async (req, res, next, model, include, where, itemFunctions = {}) => {
    try {
        const items = Array.from(await model.findAll({
            include,
            where: {
                ...where,
                time_trashed: {
                    [Op.ne]: null
                }
            },
            paranoid: false
        })).map((i) => {
            i = i.toJSON();
            for (const f in itemFunctions) {
                i[f] = itemFunctions[f](i);
            }
            return i;
        });
        res.status(200).json({ data: items });
    } catch (e) {
        next(createError(400, { debugMessage: e.message }));
    }
};

/**
 * Generic CREATE function for database items
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @param {import("sequelize").Model} model The Sequelize model to query
 * @param {String[] | null} restrictFields If set, will cause an error if any field not on the list exists in the request body
 */
const createItem = async (req, res, next, model, restrictFields = null) => {
    try {
        if (req.body.id) {
            throw new Error("The request body should not contain an ID.  Put the ID in the URL.");
        } else if (restrictFields) {
            for (const f in req.body) {
                if (restrictFields.indexOf(f) < 0) {
                    throw new Error(`Request body contains field ${f} which is not in restrictFields`);
                }
            }
        }
        const newItem = await sequelize.transaction(async (t) => {
            return await model.create(req.body, {
                transaction: t
            });
        });
        res.status(201).json({ data: newItem.toJSON() });
    } catch (e) {
        next(createError(400, { debugMessage: e.message }));
    }
};

/**
 * Generic UPDATE function for database items
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @param {import("sequelize").Model} model The Sequelize model to query
 * @param {String | number} itemId The primary key of the item to update
 * @param {String[] | null} restrictFields If set, will cause an error if any field not on the list exists in the request body
 */
const updateItem = async (req, res, next, model, itemId, restrictFields = null) => {
    try {
        if (req.body.id) {
            throw new Error("The request body should not contain an ID.  Put the ID in the URL.");
        } else if (restrictFields) {
            for (const f in req.body) {
                if (restrictFields.indexOf(f) < 0) {
                    throw new Error(`Request body contains field ${f} which is not in restrictFields`);
                }
            }
        }
        await sequelize.transaction(async (t) => {
            const [rowsUpdated] = await model.update(req.body, {
                where: { id: itemId },
                transaction: t
            });
            if (rowsUpdated !== 1) {
                throw new Error(`Number of updated rows was ${rowsUpdated}`);
            }
        });
        res.sendStatus(204);
    } catch (e) {
        next(createError(400, { debugMessage: e.message + "\n" + e.stack }));
    }
};

/**
 * Generic DELETE function for database items
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @param {import("sequelize").Model} model The Sequelize model to query
 * @param {String | number} itemId The primary key of the item to update
 */
const deleteItem = async (req, res, next, model, itemId) => {
    try {
        if (req.body.id) {
            throw new Error("The request body should not contain an ID.  Put the ID in the URL.");
        }
        await sequelize.transaction(async (t) => {
            const rowsDeleted = await model.destroy({
                where: { id: itemId },
                transaction: t
            });
            if (rowsDeleted > 1) {
                throw new Error(`Number of deleted rows was ${rowsDeleted}`);
            }
        });
        res.sendStatus(204);
    } catch (e) {
        next(createError(400, { debugMessage: e.message }));
    }
};

/**
 * Generic PERMANENT DELETE function for database items with paranoid models
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @param {import("sequelize").Model} model The Sequelize model to query
 * @param {String | number} itemId The primary key of the item to update
 */
const permanentlyDeleteItem = async (req, res, next, model, itemId) => {
    try {
        if (req.body.id) {
            throw new Error("The request body should not contain an ID.  Put the ID in the URL.");
        }
        await sequelize.transaction(async (t) => {
            const rowsDeleted = await model.destroy({
                where: {
                    id: itemId,
                    time_trashed: {
                        [Op.ne]: null
                    }
                },
                force: true,
                transaction: t
            });
            if (rowsDeleted > 1) {
                throw new Error(`Number of deleted rows was ${rowsDeleted}`);
            }
        });
        res.sendStatus(204);
    } catch (e) {
        next(createError(400, { debugMessage: e.message }));
    }
};

export { getItem, listItems, listDeletedItems, updateItem, deleteItem, createItem, permanentlyDeleteItem };
