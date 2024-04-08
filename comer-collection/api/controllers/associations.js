import createError from "http-errors";
import db from "../sequelize.js";
const { sequelize } = db;
import { Op } from "sequelize";


const manageManyToManyAssociation = async (req, res, next, model, association, primaryIds, secondaryIds) => {
    const action = req.body.action;
    try {
        if (!Array.isArray(primaryIds)) {
            throw "primaryIds must be an array";
        } else if (!Array.isArray(secondaryIds)) {
            throw "secondaryIds must be an array";
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
            for (let p of primaries) {
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
                    throw "Invalid action for M:N association";
                }
            }
        });
        res.sendStatus(204);
    } catch (e) {
        next(createError(400, { debugMessage: e.message + "\n" + e.stack }));
    }
};


export { manageManyToManyAssociation };