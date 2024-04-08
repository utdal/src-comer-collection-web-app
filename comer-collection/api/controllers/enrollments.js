import db from "../sequelize.js";
const { User } = db;
import { manageManyToManyAssociation } from "./associations.js";

const manageUserCourses = async (req, res, next) => {
    const { users, courses } = req.body;
    await manageManyToManyAssociation(req, res, next, User, User.associations.Courses, users, courses);
};

export { manageUserCourses };