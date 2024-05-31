import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const CourseIDCell = () => {
    const course = useTableCellItem();
    return (
        <Typography variant="body1">
            {course.id}
        </Typography>
    );
};
