import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const CourseDateRangeStackedCell = () => {
    const course = useTableCellItem();
    return (
        <Stack>
            <Typography variant="body1">
                {new Date(course.date_start).toLocaleDateString()}
            </Typography>

            <Typography variant="body1">
                {new Date(course.date_end).toLocaleDateString()}
            </Typography>
        </Stack>
    );
};
