import { PersonAddIcon, PersonRemoveIcon } from "../../Imports/Icons.js";
import { Course } from "../Entities/Course.ts";
import { User } from "../Entities/User.ts";
import { Association } from "../Association.ts";
import { CourseIDCell } from "../../Components/TableCells/Course/CourseIDCell.js";
import { CourseNameCell } from "../../Components/TableCells/Course/CourseNameCell.js";
import { CourseDateRangeStackedCell } from "../../Components/TableCells/Course/CourseDateRangeStackedCell.js";
import { UserIDWithAccessIconCell } from "../../Components/TableCells/User/UserIDWithAccessIconCell.js";
import { UserStackedNameEmailCell } from "../../Components/TableCells/User/UserStackedNameEmailCell.js";

class Enrollment extends Association {
    static url = "/api/enrollments";

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

    static secondarySearchBoxFields = ["name"];
    static secondarySearchBoxPlaceholder = "Search courses by name";

    /**
     * @type {TableFieldDefinition[]}
     */
    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: CourseIDCell,
            generateSortableValue: (course) => course.id
        },
        {
            columnDescription: "Name",
            maxWidth: "200px",
            TableCellComponent: CourseNameCell,
            generateSortableValue: (course) => course.name
        },
        {
            columnDescription: "Dates",
            TableCellComponent: CourseDateRangeStackedCell
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

    static secondarySearchBoxFields = User.searchBoxFields;
    static secondarySearchBoxPlaceholder = User.searchBoxPlaceholder;

    static tableFields = [
        {
            columnDescription: "ID",
            TableCellComponent: UserIDWithAccessIconCell,
            generateSortableValue: (user) => user.id
        },
        {
            columnDescription: "User",
            TableCellComponent: UserStackedNameEmailCell,
            generateSortableValue: (user) => user.full_name_reverse?.toLowerCase() ?? ""
        }
    ];
}

export { EnrollmentUserPrimary, EnrollmentCoursePrimary };
