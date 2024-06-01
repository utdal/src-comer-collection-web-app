import { PersonAddIcon, PersonRemoveIcon } from "../../Imports/Icons.js";
import { Course } from "../Entities/Course";
import { User } from "../Entities/User";
import { Association } from "../Association";
import CourseIDCell from "../../Components/TableCells/Course/CourseIDCell";
import CourseNameCell from "../../Components/TableCells/Course/CourseNameCell";
import CourseDateRangeStackedCell from "../../Components/TableCells/Course/CourseDateRangeStackedCell";
import UserIDWithAccessIconCell from "../../Components/TableCells/User/UserIDWithAccessIconCell";
import UserStackedNameEmailCell from "../../Components/TableCells/User/UserStackedNameEmailCell";
import type React from "react";
import type { Item, SortableValue, TableFieldDefinition } from "../../index.js";

class Enrollment extends Association {
    public static url = "/api/enrollments";

    public static singular = "enrollment";

    public static plural = "enrollments";

    public static AssignIcon = PersonAddIcon as React.FunctionComponent;

    public static UnassignIcon = PersonRemoveIcon as React.FunctionComponent;
}

class EnrollmentUserPrimary extends Enrollment {
    public static primary = User;

    public static secondary = Course;

    public static assignPresent = "enroll";

    public static assignPast = "enrolled";

    public static unassignPresent = "unenroll";

    public static unassignPast = "unenrolled";

    public static secondaryFieldInPrimary = "Courses";

    public static secondarySearchBoxFields = ["name"];

    public static secondarySearchBoxPlaceholder = "Search courses by name";

    public static tableFields: TableFieldDefinition[] = [
        {
            columnDescription: "ID",
            TableCellComponent: CourseIDCell,
            generateSortableValue: (course: Item): SortableValue => course.id
        },
        {
            columnDescription: "Name",
            maxWidth: "200px",
            TableCellComponent: CourseNameCell,
            generateSortableValue: (course: Item): SortableValue => course.name as string
        },
        {
            columnDescription: "Dates",
            TableCellComponent: CourseDateRangeStackedCell
        }
    ];
}

class EnrollmentCoursePrimary extends Enrollment {
    public static primary = Course;

    public static secondary = User;

    public static assignPresent = "enroll in";

    public static assignPast = "enrolled in";

    public static unassignPresent = "unenroll from";

    public static unassignPast = "unenrolled from";

    public static secondaryFieldInPrimary = "Users";

    public static secondarySearchBoxFields = User.searchBoxFields;

    public static secondarySearchBoxPlaceholder = User.searchBoxPlaceholder;

    public static tableFields: TableFieldDefinition[] = [
        {
            columnDescription: "ID",
            TableCellComponent: UserIDWithAccessIconCell,
            generateSortableValue: (user: Item): SortableValue => user.id
        },
        {
            columnDescription: "User",
            TableCellComponent: UserStackedNameEmailCell,
            generateSortableValue: (user: Item): SortableValue => (user.full_name_reverse as string).toLowerCase()
        }
    ];
}

export { EnrollmentUserPrimary, EnrollmentCoursePrimary };
