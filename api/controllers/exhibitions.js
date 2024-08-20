import createError from "http-errors";
import db from "../sequelize.js";
import { canUserCreateExhibition } from "./users.js";
import { listItems, getItem, createItem, updateItem, deleteItem } from "./items.js";
const { User, Course, Exhibition, sequelize } = db;

const isAppUserExhibitionOwner = (appUser, exhibitionId) => {
    // Exhibitions owned by current app user are already included
    // during authentication process.  Scan that list to determine
    // whether the exhibition being edited is owned by the current user.
    return Boolean(appUser.toJSON().Exhibitions
        .find((ex) => ex.id === parseInt(exhibitionId)));
};

const listExhibitions = async (req, res, next) => {
    await listItems(req, res, next, Exhibition, {
        model: User,
        include: [Course]
    });
};

const listPublicExhibitions = async (req, res, next) => {
    if (req.app_user && parseInt(req.query.public_only) !== 1) {
        return next();
    }
    await listItems(req, res, next, Exhibition.scope("with_public_curators"), [], {
        privacy: ["PUBLIC", "PUBLIC_ANONYMOUS"]
    });
};

const createExhibition = async (req, res, next) => {
    if (!canUserCreateExhibition(req.app_user)) {
        return next();
    }
    const now = Date.now();
    req.body = {
        ...req.body,
        date_created: now,
        date_modified: now,
        exhibition_owner: req.app_user.id
    };
    await createItem(req, res, next, Exhibition, [
        "title", "privacy",
        "date_created", "date_modified",
        "exhibition_owner"
    ]);
};

const getExhibition = async (req, res, next) => {
    await getItem(req, res, next, Exhibition, {
        model: User,
        include: [Course]
    }, req.params.exhibitionId);
};

const ownerEditExhibitionSettings = async (req, res, next) => {
    if (!isAppUserExhibitionOwner(req.app_user, req.params.exhibitionId)) {
        return next();
    }
    await updateItem(req, res, next, Exhibition, req.params.exhibitionId, [
        "title", "privacy"
    ]);
};

const ownerDeleteExhibition = async (req, res, next) => {
    if (!isAppUserExhibitionOwner(req.app_user, req.params.exhibitionId)) {
        return next();
    }
    await deleteItem(req, res, next, Exhibition, req.params.exhibitionId);
};

const adminEditExhibitionSettings = async (req, res, next) => {
    await updateItem(req, res, next, Exhibition, req.params.exhibitionId, [
        "title", "privacy"
    ]);
};

const adminDeleteExhibition = async (req, res, next) => {
    await deleteItem(req, res, next, Exhibition, req.params.exhibitionId);
};

const ownerLoadExhibition = async (req, res, next) => {
    if (!isAppUserExhibitionOwner(req.app_user, req.params.exhibitionId)) {
        return next();
    }
    try {
        const exhibition = await Exhibition.scope([
            "with_data",
            "with_public_curators"
        ]).findByPk(req.params.exhibitionId);
        if (!exhibition) {
            next(createError(404));
        } else {
            res.status(200).json({
                data: {
                    ...exhibition.toJSON(),
                    isEditable: true
                }
            });
        }
    } catch (e) {
        next(createError(400), { debugMessage: e.message });
    }
};

const adminLoadExhibition = async (req, res, next) => {
    try {
        const exhibition = await Exhibition.scope([
            "with_data",
            "with_public_curators"
        ]).findByPk(req.params.exhibitionId);
        if (!exhibition) {
            next(createError(404));
        } else {
            res.status(200).json({
                data: {
                    ...exhibition.toJSON(),
                    isEditable: true
                }
            });
        }
    } catch (e) {
        next(createError(400), { debugMessage: e.message });
    }
};

const publicLoadExhibition = async (req, res, next) => {
    if (req.app_user && (isAppUserExhibitionOwner(req.app_user, req.params.exhibitionId) || req.app_user.is_admin)) {
        return next();
    }
    try {
        const exhibition = await Exhibition.scope([
            "with_data",
            "with_public_curators"
        ]).findOne({
            where: {
                id: req.params.exhibitionId,
                privacy: ["PUBLIC", "PUBLIC_ANONYMOUS"]
            }
        });
        if (!exhibition) {
            next(createError(401));
        } else {
            res.status(200).json({
                data: {
                    ...exhibition.toJSON(),
                    isEditable: false
                }
            });
        }
    } catch (e) {
        next(createError(400), { debugMessage: e.message });
    }
};

const saveExhibitionHelper = async (req, res, next) => {
    try {
        await sequelize.transaction(async (t) => {
            const exhibition = await Exhibition.findByPk(req.params.exhibitionId, {
                transaction: t
            });
            if (!exhibition) { next(createError(404)); } else {
                await exhibition.update({
                    data: req.body.data,
                    date_modified: Date.now()
                }, { transaction: t });
                await exhibition.setImages(
                    JSON.parse(req.body.data).images.map((i) => i.image_id), { transaction: t }
                );
            }
            res.sendStatus(204);
        });
    } catch (e) {
        next(createError(400), { debugMessage: e.message + "\n" + e.stack });
    }
};

const ownerSaveExhibition = async (req, res, next) => {
    if (!isAppUserExhibitionOwner(req.app_user, req.params.exhibitionId)) {
        return next();
    }
    await saveExhibitionHelper(req, res, next);
};

const adminSaveExhibition = async (req, res, next) => {
    await saveExhibitionHelper(req, res, next);
};

export { listPublicExhibitions, createExhibition, adminEditExhibitionSettings, ownerEditExhibitionSettings, ownerDeleteExhibition, adminDeleteExhibition, listExhibitions, getExhibition, ownerLoadExhibition, adminLoadExhibition, publicLoadExhibition, ownerSaveExhibition, adminSaveExhibition };
