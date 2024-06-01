import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { CourseItem } from "../../..";
import { formatDate, formatTime } from "../../../Classes/Entity";

const CourseStartDateTimeStackedCell = (): React.JSX.Element => {
    const course = useTableCellItem() as CourseItem;
    return (
        <Stack
            direction="column"
            padding={0}
        >
            <Typography variant="body1">
                {formatDate(course.date_start)}
            </Typography>

            <Typography variant="body1">
                {formatTime(course.date_start)}
            </Typography>
        </Stack>
    );
};

export default CourseStartDateTimeStackedCell;
