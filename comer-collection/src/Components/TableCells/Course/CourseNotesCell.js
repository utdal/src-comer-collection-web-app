import React from "react";
import { Typography } from "@mui/material";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";

export const CourseNotesCell = () => {
    const course = useTableRowItem();
    return (
        <Typography variant="body1">
            {course.notes}
        </Typography>
    );
};
