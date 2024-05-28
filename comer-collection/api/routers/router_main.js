import { Router } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";

import apiRouterPublic from "./router_public.js";
import apiRouterUserTempPw from "./router_user_temp_pw.js";
import apiRouterUser from "./router_user.js";
import apiRouterCollectionManager from "./router_collection_manager.js";
import apiRouterAdmin from "./router_admin.js";

import { routerCoursesAdmin } from "./router_courses.js";
import { routerUsersAdmin } from "./router_users.js";
import { routerEnrollmentsAdmin } from "./router_enrollments.js";

import db from "../sequelize.js";
import { routerImagesCollectionManager, routerImagesPublic } from "./router_images.js";
import { routerArtistsCollectionManager, routerArtistsPublic } from "./router_artists.js";
import { routerTagsCollectionManager, routerTagsPublic } from "./router_tags.js";
import { routerImageArtistsAdmin } from "./router_imageartists.js";
import { routerImageTagsAdmin } from "./router_imagetags.js";
const router = Router();
const { User, Course, Exhibition } = db;

/**
 * @description Check the request for a valid JSON web token.  If the token is valid,
 * attach information about the associated user to the request: req.app_user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const authenticateUser = async (req, res, next) => {
    try {
        const header = req.get("Authorization");
        if (!header) {
            throw new Error("Authorization header not present");
        } else if (!header.startsWith("Bearer ")) {
            throw new Error("Authorization header does not start with Bearer");
        }

        const token = header.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id, {
            include: [Course, Exhibition]
        });

        if (!user) {
            throw new Error("User not found");
        } else if (!user.is_active) {
            throw new Error("User is not active");
        } else if (`"${decoded.pw_updated}"` !== JSON.stringify(user.pw_updated)) {
            // Check if password has changed since token was generated
            throw new Error("Token password update time does not match the latest password update time");
        }

        req.app_user = user;
        console.log("authorized successfully and User instance attached to request object");
    } catch (e) {
        req.app_user = null;
        req.app_user_auth_error = e.message;
    } finally {
        next();
    }
};

/**
 * @description Check the request for a valid JSON web token.  If the token is valid,
 * attach information about the associated user to the request: req.app_user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const requireAuthenticatedUser = async (req, res, next) => {
    if (req.app_user) {
        next();
    } else {
        next(createError(401, { debugMessage: req.app_user_auth_error }));
    }
};

export const hasPermanentPassword = (appUser) => {
    return appUser && !appUser.pw_change_required;
};

export const isAtLeastCollectionManager = (appUser) => {
    return hasPermanentPassword(appUser) && (appUser?.is_admin || appUser?.is_collection_manager);
};

export const isAdmin = (appUser) => {
    return hasPermanentPassword(appUser) && appUser?.is_admin;
};

/**
 * Ensure the current app user is a collection manager or administrator
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const requireAtLeastCollectionManager = async (req, res, next) => {
    const { app_user: appUser } = req;
    if (isAtLeastCollectionManager(appUser)) {
        next();
    } else {
        next(createError(403, { debugMessage: "Action requires at least collection manager privileges" }));
    }
};

/**
 * Ensure the current app user is an administrator
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const requireAdmin = async (req, res, next) => {
    const { app_user: appUser } = req;
    if (isAdmin(appUser)) {
        next();
    } else {
        next(createError(403, { debugMessage: "Action requires admin privileges" }));
    }
};

/**
 * Ensure the current app user does not have a password change requirement
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const requirePermanentPassword = async (req, res, next) => {
    const { app_user: appUser } = req;
    if (hasPermanentPassword(appUser)) {
        next();
    } else {
        next(createError(401, { debugMessage: "Please change your password and try again" }));
    }
};

router.use(authenticateUser);

// Routes for querying data
router.use("/public", apiRouterPublic);
router.use("/user", requireAuthenticatedUser, apiRouterUserTempPw);
router.use("/user", requirePermanentPassword, apiRouterUser);
router.use("/admin", requireAuthenticatedUser, requirePermanentPassword, requireAtLeastCollectionManager, apiRouterCollectionManager);
router.use("/admin", requireAdmin, apiRouterAdmin);

router.use("/users",
    requireAuthenticatedUser,
    requireAdmin,
    routerUsersAdmin
);

router.use("/courses",
    requireAuthenticatedUser,
    requireAdmin,
    routerCoursesAdmin
);

router.use("/enrollments",
    requireAuthenticatedUser,
    requireAdmin,
    routerEnrollmentsAdmin
);

router.use("/images",
    routerImagesPublic,
    requireAuthenticatedUser,
    requireAtLeastCollectionManager,
    routerImagesCollectionManager
);

router.use("/artists",
    routerArtistsPublic,
    requireAuthenticatedUser,
    requireAtLeastCollectionManager,
    routerArtistsCollectionManager
);

router.use("/tags",
    routerTagsPublic,
    requireAuthenticatedUser,
    requireAtLeastCollectionManager,
    routerTagsCollectionManager
);

router.use("/imageartists",
    requireAuthenticatedUser,
    requireAdmin,
    routerImageArtistsAdmin
);

router.use("/imagetags",
    requireAuthenticatedUser,
    requireAdmin,
    routerImageTagsAdmin
);

export default router;
