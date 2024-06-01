import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { CourseItem } from "../../../index.js";
import { formatDate, formatTime } from "../../../Classes/Entity.js";

const CourseEndDateTimeCell = (): React.JSX.Element => {
    const course = useTableCellItem() as CourseItem;
    return (
        <Typography variant="body1">
            {formatDate(course.date_end)}

            ,
            {formatTime(course.date_end)}
        </Typography>
    );
};

export default CourseEndDateTimeCell;
