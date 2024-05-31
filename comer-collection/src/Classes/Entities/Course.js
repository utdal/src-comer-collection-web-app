/* eslint-disable react/prop-types */
import { CourseEndDateTimeStackedCell } from "../../Components/TableCells/Course/CourseEndDateTimeStackedCell.js";
import { CourseIDCell } from "../../Components/TableCells/Course/CourseIDCell.js";
import { CourseNameCell } from "../../Components/TableCells/Course/CourseNameCell.js";
import { CourseNotesCell } from "../../Components/TableCells/Course/CourseNotesCell.js";
import CourseOptionsCell from "../../Components/TableCells/Course/CourseOptionsCell.js";
import { CourseStartDateTimeStackedCell } from "../../Components/TableCells/Course/CourseStartDateTimeStackedCell.js";
import { CourseStatusCell } from "../../Components/TableCells/Course/CourseStatusCell.js";
import { CourseUserAssignmentCell } from "../../Components/TableCells/Course/CourseUserAssignmentCell.js";
import { SchoolIcon } from "../../Imports/Icons.js";
import { Entity } from "../Entity.js";

class Course extends Entity {
    static baseUrl = "/api/courses";
    static singular = "course";
    static plural = "courses";

    static multiCreateDialogSubtitle = "You can enroll users after creating the courses.";
    static DefaultIcon = SchoolIcon;

    static loader = async () => {
        return await this.handleFetchAll();
    };

    static searchBoxPlaceholder = "Search courses by name";

    static fieldDefinitions = [
        {
            fieldName: "name",
            displayName: "Course Name",
            inputType: "textarea",
            isRequired: true
        },
        {
            fieldName: "date_start",
            displayName: "Start",
            inputType: "datetime-local",
            isRequired: true
        },
        {
            fieldName: "date_end",
            displayName: "End",
            inputType: "datetime-local",
            isRequired: true
        },
        {
            fieldName: "notes",
            displayName: "Notes",
            inputType: "textarea",
            multiline: true
        }
    ];

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
            generateSortableValue: (course) => course.name.toLowerCase()
        },
        {
            columnDescription: "Start",
            TableCellComponent: CourseStartDateTimeStackedCell,
            generateSortableValue: (course) => new Date(course.date_start)
        },
        {
            columnDescription: "End",
            TableCellComponent: CourseEndDateTimeStackedCell,
            generateSortableValue: (course) => new Date(course.date_end)
        },
        {
            columnDescription: "Status",
            TableCellComponent: CourseStatusCell
        },
        {
            columnDescription: "Enrollment",
            TableCellComponent: CourseUserAssignmentCell
        },
        {
            columnDescription: "Notes",
            TableCellComponent: CourseNotesCell
        },
        {
            columnDescription: "Options",
            TableCellComponent: CourseOptionsCell
        }
    ];
}

export { Course };
