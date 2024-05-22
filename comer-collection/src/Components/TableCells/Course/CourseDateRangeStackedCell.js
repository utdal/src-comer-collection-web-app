import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";

export const CourseDateRangeStackedCell = () => {
    const course = useTableRowItem();
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
