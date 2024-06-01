import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { CourseItem } from "../../..";

const CourseNameCell = (): React.JSX.Element => {
    const course = useTableCellItem() as CourseItem;
    return (
        <Typography variant="body1">
            {course.name}
        </Typography>
    );
};

export default CourseNameCell;
