import db from "../sequelize.js";
import { manageManyToManyAssociation } from "./associations.js";
const { User } = db;

const manageUserCourses = async (req, res, next) => {
    const { users, courses } = req.body;
    await manageManyToManyAssociation(req, res, next, User, User.associations.Courses, users, courses);
};

export { manageUserCourses };
