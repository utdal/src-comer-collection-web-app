import React from "react";
import { Typography } from "@mui/material";
import { Course } from "../../../Classes/Entities/Course.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const CourseEndDateTimeCell = () => {
    const course = useTableCellItem();
    return (
        <Typography variant="body1">
            {Course.formatDate(course.date_end)}

            ,
            {Course.formatTime(course.date_end)}
        </Typography>
    );
};
