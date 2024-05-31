import db from "../sequelize.js";
import { manageManyToManyAssociation } from "./associations.js";
const { User } = db;

/**
 * Calls manageManyToManyAssociation for Users and Courses.  In the application, either
 * User or Course may be considered the primary entity depending on the situation,
 * but on the backend, User is considered the primary entity.
 * This was an arbitrary but necessary decision.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const manageUserCourses = async (req, res, next) => {
    const { users, courses } = req.body;
    await manageManyToManyAssociation(req, res, next, User, User.associations.Courses, users, courses);
};

export { manageUserCourses };
