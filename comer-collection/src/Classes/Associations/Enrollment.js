import { PersonAddIcon, PersonRemoveIcon } from "../../Imports/Icons.js";
import { Course } from "../Entities/Course.js";
import { User } from "../Entities/User.js";
import { Association } from "../Association.js";

class Enrollment extends Association {
    static url = "/api/admin/enrollments";

    static singular = "enrollment";
    static plural = "enrollments";

    static AssignIcon = PersonAddIcon;
    static UnassignIcon = PersonRemoveIcon;
}

class EnrollmentUserPrimary extends Enrollment {
    static primary = User;
    static secondary = Course;

    static assignPresent = "enroll";
    static assignPast = "enrolled";
    static unassignPresent = "unenroll";
    static unassignPast = "unenrolled";

    static secondaryFieldInPrimary = "Courses";

    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: Course.TableCells.ID,
            generateSortableValue: (course) => course.id
        },
        {
            columnDescription: "Name",
            maxWidth: "200px",
            TableCellComponent: Course.TableCells.Name,
            generateSortableValue: (course) => course.name
        },
        {
            columnDescription: "Dates",
            TableCellComponent: Course.TableCells.CourseDateRangeStacked
        }
    ];
}

class EnrollmentCoursePrimary extends Enrollment {
    static primary = Course;
    static secondary = User;

    static assignPresent = "enroll in";
    static assignPast = "enrolled in";
    static unassignPresent = "unenroll from";
    static unassignPast = "unenrolled from";

    static secondaryFieldInPrimary = "Users";

    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: User.TableCells.IDWithAccessIcon,
            generateSortableValue: (user) => user.id
        },
        {
            columnDescription: "User",
            TableCellComponent: User.TableCells.StackedNameEmail,
            generateSortableValue: (user) => user.full_name_reverse?.toLowerCase() ?? ""
        }
    ];
}

export { EnrollmentUserPrimary, EnrollmentCoursePrimary };
