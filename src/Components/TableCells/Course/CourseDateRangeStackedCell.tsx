import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { CourseItem } from "../../..";

const CourseDateRangeStackedCell = (): React.JSX.Element => {
    const course = useTableCellItem() as CourseItem;
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

export default CourseDateRangeStackedCell;
