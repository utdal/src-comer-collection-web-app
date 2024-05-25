import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const CourseNotesCell = () => {
    const course = useTableCellItem();
    return (
        <Typography variant="body1">
            {course.notes}
        </Typography>
    );
};
