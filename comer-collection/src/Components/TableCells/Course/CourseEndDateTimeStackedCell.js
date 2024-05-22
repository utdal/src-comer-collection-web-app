import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Course } from "../../../Classes/Entities/Course.js";

export const CourseEndDateTimeStackedCell = () => {
    const course = useTableRowItem();
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
