import React from "react";
import { Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { CourseItem } from "../../..";

const CourseIDCell = (): React.JSX.Element => {
    const course = useTableCellItem() as CourseItem;
    return (
        <Typography variant="body1">
            {course.id}
        </Typography>
    );
};

export default CourseIDCell;
