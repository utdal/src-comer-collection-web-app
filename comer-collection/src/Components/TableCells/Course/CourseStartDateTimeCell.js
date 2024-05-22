import React from "react";
import { Typography } from "@mui/material";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Course } from "../../../Classes/Entities/Course.js";

export const CourseStartDateTimeCell = () => {
    const course = useTableRowItem();
    return (
        <Typography variant="body1">
            {Course.formatDate(course.date_start)}

            ,
            {Course.formatTime(course.date_start)}
        </Typography>
    );
};
