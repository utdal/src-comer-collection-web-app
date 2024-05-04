import db from "../sequelize.js";
import { deleteItem, updateItem, createItem, listItems, getItem } from "./items.js";
const { User, Course } = db;

/**
 * Uses the listItems function on the Course model and includes Users
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const listCourses = async (req, res, next) => {
    await listItems(req, res, next, Course, [User], {});
};

/**
 * Uses the createItem function on the Course model
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const createCourse = async (req, res, next) => {
    await createItem(req, res, next, Course);
};

/**
 * Uses the getItem function on the Course model and includes Users.
 * The courseId parameter in the request URL params object is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const getCourse = async (req, res, next) => {
    await getItem(req, res, next, Course, [User], req.params.courseId);
};

/**
 * Uses the updateItem function on the Course model.
 * The courseId parameter in the request URL params object is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const updateCourse = async (req, res, next) => {
    await updateItem(req, res, next, Course, req.params.courseId);
};

/**
 * Uses the deleteItem function on the Course model
 * The courseId parameter in the request URL params object is used as the primary key
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const deleteCourse = async (req, res, next) => {
    await deleteItem(req, res, next, Course, req.params.courseId);
};

export { createCourse, getCourse, listCourses, deleteCourse, updateCourse };
