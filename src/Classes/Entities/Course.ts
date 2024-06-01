/* eslint-disable react/prop-types */
import type React from "react";
import CourseEndDateTimeStackedCell from "../../Components/TableCells/Course/CourseEndDateTimeStackedCell";
import CourseIDCell from "../../Components/TableCells/Course/CourseIDCell";
import CourseNameCell from "../../Components/TableCells/Course/CourseNameCell";
import CourseNotesCell from "../../Components/TableCells/Course/CourseNotesCell";
import CourseOptionsCell from "../../Components/TableCells/Course/CourseOptionsCell";
import CourseStartDateTimeStackedCell from "../../Components/TableCells/Course/CourseStartDateTimeStackedCell";
import CourseStatusCell from "../../Components/TableCells/Course/CourseStatusCell";
import CourseUserAssignmentCell from "../../Components/TableCells/Course/CourseUserAssignmentCell";
import { SchoolIcon } from "../../Imports/Icons.js";
import { Entity } from "../Entity";
import type { EntityFieldDefinition, Item, SortableValue, TableFieldDefinition } from "../../index.js";

class Course extends Entity {
    public static baseUrl = "/api/courses";

    public static singular = "course";

    public static plural = "courses";

    public static multiCreateDialogSubtitle = "You can enroll users after creating the courses.";

    public static DefaultIcon = SchoolIcon as React.FunctionComponent;

    public static searchBoxPlaceholder = "Search courses by name";

    public static fieldDefinitions: EntityFieldDefinition[] = [
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
            multiline: true,
            isRequired: false
        }
    ];

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
            generateSortableValue: (course: Item): SortableValue => (course.name as string).toLowerCase()
        },
        {
            columnDescription: "Start",
            TableCellComponent: CourseStartDateTimeStackedCell,
            generateSortableValue: (course: Item): SortableValue => new Date(course.date_start as string)
        },
        {
            columnDescription: "End",
            TableCellComponent: CourseEndDateTimeStackedCell,
            generateSortableValue: (course: Item): SortableValue => new Date(course.date_end as string)
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
