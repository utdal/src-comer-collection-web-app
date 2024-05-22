import React from "react";
import { Typography } from "@mui/material";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";

export const CourseNameCell = () => {
    const course = useTableRowItem();
    return (
        <Typography variant="body1">
            {course.name}
        </Typography>
    );
};
