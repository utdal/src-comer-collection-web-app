import createError from "http-errors";
import db from "../sequelize.js";
import { Op } from "sequelize";
const { sequelize } = db;

/**
 * Manages associations between entities in the database.  The "primary" entity is the one
 * that contains the "secondary" entities.  For many-to-many relationships, these can be
 * interchangeable, but one of them still must be considered primary for a specific call.
 *
 * The request body must contain a field called "action" with a value in ["set", "assign", "unassign"].
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @param {import("sequelize").Model} model The Sequelize model to query
 * @param {{
 *  set: function,
 *  addMultiple: function,
 *  removeMultiple: function
 * }} association The association object inside the Sequelize model (e.g., Image.associations.Artists)
 * @param {number[]} primaryIds
 * @param {number[]} secondaryIds
 */
const manageManyToManyAssociation = async (req, res, next, model, association, primaryIds, secondaryIds) => {
    const action = req.body.action;
    try {
        if (!Array.isArray(primaryIds)) {
            throw new Error("primaryIds must be an array");
        } else if (!Array.isArray(secondaryIds)) {
            throw new Error("secondaryIds must be an array");
        }
        await sequelize.transaction(async (t) => {
            const primaries = Array.from(await model.findAll({
                where: {
                    id: {
                        [Op.in]: primaryIds
                    }
                },
                transaction: t
            }));
            const { set, addMultiple, removeMultiple } = association.accessors;
            for (const p of primaries) {
                switch (action) {
                case "set":
                    await p[set](secondaryIds);
                    break;
                case "assign":
                    await p[addMultiple](secondaryIds);
                    break;
                case "unassign":
                    await p[removeMultiple](secondaryIds);
                    break;
                default:
                    throw new Error("Invalid action for M:N association");
                }
            }
        });
        res.sendStatus(204);
    } catch (e) {
        next(createError(400, { debugMessage: e.message + "\n" + e.stack }));
    }
};

export { manageManyToManyAssociation };
