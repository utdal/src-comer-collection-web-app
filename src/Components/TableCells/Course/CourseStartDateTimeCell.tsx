import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { CourseItem } from "../../../index.js";
import { formatDate, formatTime } from "../../../Classes/Entity";

const CourseStartDateTimeCell = (): React.JSX.Element => {
    const course = useTableCellItem() as CourseItem;
    return (
        <Typography variant="body1">
            {formatDate(course.date_start)}

            ,
            {formatTime(course.date_start)}
        </Typography>
    );
};

export default CourseStartDateTimeCell;
