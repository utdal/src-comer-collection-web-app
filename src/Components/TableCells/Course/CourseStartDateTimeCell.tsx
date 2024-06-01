import React from "react";
import { Typography } from "@mui/material";
import { Course } from "../../../Classes/Entities/Course";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { CourseItem } from "../../../index.js";

const CourseStartDateTimeCell = (): React.JSX.Element => {
    const course = useTableCellItem() as CourseItem;
    return (
        <Typography variant="body1">
            {Course.formatDate(course.date_start)}

            ,
            {Course.formatTime(course.date_start)}
        </Typography>
    );
};

export default CourseStartDateTimeCell;
