import React from "react";
import { Typography } from "@mui/material";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { Course } from "../../../Classes/Entities/Course.js";

export const EndDateTime = () => {
    const course = useTableRowItem();
    return (
        <Typography variant="body1">
            {Course.formatDate(course.date_end)}

            ,
            {Course.formatTime(course.date_end)}
        </Typography>
    );
};
