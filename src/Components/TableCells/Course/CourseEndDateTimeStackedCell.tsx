import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import { Course } from "../../../Classes/Entities/Course";
import type { CourseItem } from "../../..";

const CourseEndDateTimeStackedCell = (): React.JSX.Element => {
    const course = useTableCellItem() as CourseItem;
    return (
        <Stack
            direction="column"
            padding={0}
        >
            <Typography variant="body1">
                {Course.formatDate(course.date_end)}
            </Typography>

            <Typography variant="body1">
                {Course.formatTime(course.date_end)}
            </Typography>
        </Stack>
    );
};

export default CourseEndDateTimeStackedCell;
