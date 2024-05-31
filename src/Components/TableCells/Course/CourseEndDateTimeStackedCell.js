import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";
import { Course } from "../../../Classes/Entities/Course.ts";

export const CourseEndDateTimeStackedCell = () => {
    const course = useTableCellItem();
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
