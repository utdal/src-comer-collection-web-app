import { verify, hash as _hash } from "argon2";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import db from "../sequelize.js";
import { deleteItem, updateItem, createItem, listItems, getItem } from "./items.js";
const { User, Course, Exhibition, sequelize } = db;

/**
 * Generate signed JSON web token from User instance
 * @param {db.User} user
 * @returns {Promise<string>}
 */
const getSignedTokenForUser = async (user) => {
    const tokenData = {
        id: user.id,
        pw_updated: user.pw_updated
    };
    return jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "10d" });
};

/**
 * Verify password against hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<Boolean>} A Promise resolving to true if hash and password match, false otherwise
 */
const doesPasswordMatchHash = async (password, hash) => {
    return Boolean(password) && Boolean(hash) &&
        await verify(hash, password);
};

/**
 * Determine whether a User is allowed to create an exhibition
 * @param {{
 *  is_admin: boolean,
 *  exhibition_quota: number,
 *  Courses: {
 *   status: string
 *  }[],
 *  Exhibitions: object[]
 * }} userJSON The JSON representation of the User instance
 * @returns True if user is allowed to create an exhibition, false otherwise
 */
const canUserCreateExhibition = (userJSON) => {
    return Boolean(userJSON.is_admin || (userJSON.Courses?.filter((c) => c.status === "Active").length && userJSON.exhibition_quota > userJSON.Exhibitions.length));
};

/**
 * Functions that can be applied to a User using the listItems and getItem functions
 * @type {object.<string, Function>}
 */
const userItemFunctions = {
    /**
     * @param {db.User} user
     */
    can_create_exhibition (user) {
        return canUserCreateExhibition(user);
    }
};

/**
 * Uses the listItems function on the User model and includes Courses and Exhibitions
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const listUsers = async (req, res, next) => {
    listItems(req, res, next, User, [Course, Exhibition], {}, userItemFunctions);
};

/**
 * Uses the createItem function on the User model.
 * Restricts permitted fields to email, given_name, family_name, and exhibition_quota.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const createUser = async (req, res, next) => {
    await createItem(req, res, next, User, [
        "email", "given_name", "family_name", "exhibition_quota"
    ]);
};

/**
 * Uses the updateItem function on the User model.
 * Restricts permitted fields to email, given_name, family_name, and exhibition_quota.
 * The userId parameter in the request URL params object is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const updateUser = async (req, res, next) => {
    await updateItem(req, res, next, User, req.params.userId, [
        "email", "family_name", "given_name", "exhibition_quota"
    ]);
};

/**
 * Uses the updateItem function on the User model.
 * Overrides request body to single field is_active with value false, and
 * restricts fields to is_active.
 * The userId parameter in the request URL params object is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const deactivateUser = async (req, res, next) => {
    if (parseInt(req.params.userId) === req.app_user.id) {
        next(createError(403, { debugMessage: "Admin cannot deactivate self" }));
    }
    req.body = { is_active: false };
    await updateItem(req, res, next, User, req.params.userId, ["is_active"]);
};

/**
 * Uses the updateItem function on the User model.
 * Overrides request body to single field is_active with value true, and
 * restricts fields to is_active.
 * The userId parameter in the request URL params object is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const activateUser = async (req, res, next) => {
    if (parseInt(req.params.userId) === req.app_user.id) {
        next(createError(403, { debugMessage: "Admin cannot activate self" }));
    }
    req.body = { is_active: true };
    await updateItem(req, res, next, User, req.params.userId, ["is_active"]);
};

/**
 * Uses the updateItem function on the User model.
 * Restricts fields to access_level.
 * The userId parameter in the request URL params object is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const changeUserAccess = async (req, res, next) => {
    if (parseInt(req.params.userId) === req.app_user.id) {
        next(createError(403, { debugMessage: "Admin cannot promote self" }));
    }
    await updateItem(req, res, next, User, req.params.userId, ["access_level"]);
};

/**
 * Uses the deleteItem function on the User model
 * The userId parameter in the request URL params object is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const deleteUser = async (req, res, next) => {
    if (parseInt(req.params.userId) === req.app_user.id) {
        next(createError(401, { debugMessage: "Admin cannot delete self" }));
    }
    await deleteItem(req, res, next, User, req.params.userId);
};

/**
 * Uses the getItem function on the User model and includes Courses and Exhibitions.
 * The userId parameter in the request URL params object is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const getUser = async (req, res, next) => {
    await getItem(req, res, next, User, [Course, Exhibition], req.params.userId, userItemFunctions);
};

/**
 * Uses the getItem function on the User model and includes Courses and Exhibitions.
 * The authenticated app user stored in req.app_user is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const getCurrentUser = async (req, res, next) => {
    await getItem(req, res, next, User, [Course, Exhibition], req.app_user.id, userItemFunctions);
};

/**
 * Uses the updateItem function on the User model.
 * Calculates the hash of the new password in the request body.
 *
 * Overrides request body to fields pw_hash with calculated hash,
 * pw_change_required with the value true, and pw_updated with the current time.
 * Restricts update fields to pw_hash, pw_change_required, and pw_updated.
 *
 * The userId parameter in the request URL params object is used as the primary key.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const resetUserPassword = async (req, res, next) => {
    if (parseInt(req.params.userId) === req.app_user.id) {
        next(createError(401, { debugMessage: "Admin cannot reset own password.  Use Change Password instead." }));
    } else if (!req.body.newPassword) {
        next(createError(400, { debugMessage: "Password reset request must contain the new password in the request body" }));
    }
    const hash = await _hash(req.body.newPassword);
    req.body = {
        pw_hash: hash,
        pw_change_required: true,
        pw_updated: Date.now()
    };
    await updateItem(req, res, next, User, req.params.userId, ["pw_hash", "pw_change_required", "pw_updated"]);
};

/**
 * Authenticates a user and, if successful, returns a signed JSON web token
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const signIn = async (req, res, next) => {
    try {
        await sequelize.transaction(async (t) => {
            const { email, password } = req.body;
            const user = await User.findOne({
                where: {
                    email
                },
                attributes: {
                    include: ["pw_hash"]
                },
                transaction: t
            });

            if (!user) {
                throw new Error("user does not exist");
            } else if (!user.is_active) {
                throw new Error("user is not active");
            }

            if (await doesPasswordMatchHash(password, user.pw_hash)) {
                const token = await getSignedTokenForUser(user);
                res.status(200).json({ token });
            } else {
                throw new Error("password is incorrect");
            }
        });
    } catch (e) {
        await next(createError(401, { debugMessage: e.message + "\n" + e.stack }));
    }
};

/**
 * Changes a user's password
 * Calculates the hash of the old password and compares it to the stored hash for the user.
 * If the hash matches the old password, then calculates the hash of the new password in the request body
 * and stores the new hash in the database.
 *
 * Also updates the pw_updated field to the current time and the pw_change_required field to false.
 *
 * The userId parameter in the request URL params object is used as the user's primary key.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const changePassword = async (req, res, next) => {
    try {
        await sequelize.transaction(async (t) => {
            const user = await User.findByPk(req.app_user.id, {
                attributes: {
                    include: ["pw_hash"]
                }
            }, { transaction: t });
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                throw new Error("Request must have both oldPassword and newPassword parameters");
            } else if (!user.pw_hash) {
                throw new Error("No current pw_hash found");
            } else if (!doesPasswordMatchHash(oldPassword, user.pw_hash)) {
                throw new Error("oldPassword is incorrect");
            }
            const hash = await _hash(newPassword);
            await user.update({
                pw_hash: hash,
                pw_change_required: false,
                pw_updated: Date.now()
            });

            const token = await getSignedTokenForUser(user);
            res.status(200).json({ token });
        });
    } catch (e) {
        next(createError(400, { debugMessage: e.message }));
    }
};

export { canUserCreateExhibition, listUsers, createUser, updateUser, deleteUser, getUser, getCurrentUser, resetUserPassword, deactivateUser, activateUser, changeUserAccess, signIn, changePassword };
