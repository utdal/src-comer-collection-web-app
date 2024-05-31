import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";
import { Course } from "../../../Classes/Entities/Course.js";

export const CourseStartDateTimeStackedCell = () => {
    const course = useTableCellItem();
    return (
        <Stack
            direction="column"
            padding={0}
        >
            <Typography variant="body1">
                {Course.formatDate(course.date_start)}
            </Typography>

            <Typography variant="body1">
                {Course.formatTime(course.date_start)}
            </Typography>
        </Stack>
    );
};
