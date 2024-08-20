import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { CourseItem } from "../../..";
import { formatDate, formatTime } from "../../../Classes/Entity";

const CourseEndDateTimeStackedCell = (): React.JSX.Element => {
    const course = useTableCellItem() as CourseItem;
    return (
        <Stack
            direction="column"
            padding={0}
        >
            <Typography variant="body1">
                {formatDate(course.date_end)}
            </Typography>

            <Typography variant="body1">
                {formatTime(course.date_end)}
            </Typography>
        </Stack>
    );
};

export default CourseEndDateTimeStackedCell;
