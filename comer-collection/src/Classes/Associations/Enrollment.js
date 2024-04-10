import { PersonAddIcon, PersonRemoveIcon } from "../../Imports/Icons.js";
import { Course } from "../Entities/Course.js";
import { User } from "../Entities/User.js";
import { Association } from "../Association.js";

class Enrollment extends Association {
    static url = "/api/admin/enrollments";

    static singular = "enrollment";
    static plural = "enrollments";

    static assignPresent = "enroll";
    static assignPast = "enrolled";
    static unassignPresent = "unenroll";
    static unassignPast = "unenrolled";

    static AssignIcon = PersonAddIcon;
    static UnassignIcon = PersonRemoveIcon;

}

class EnrollmentUserPrimary extends Enrollment {
    static primary = User;
    static secondary = Course;
}

class EnrollmentCoursePrimary extends Enrollment {
    static primary = Course;
    static secondary = User;

    static assignPresent = "enroll in";
    static assignPast = "enrolled in";
    static unassignPresent = "unenroll from";
    static unassignPast = "unenrolled from";
}

export { EnrollmentUserPrimary, EnrollmentCoursePrimary };