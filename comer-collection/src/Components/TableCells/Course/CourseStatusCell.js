import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { AccessTimeIcon, CheckIcon, ExpiredIcon } from "../../../Imports/Icons.js";

export const CourseStatusCell = () => {
    const course = useTableRowItem();
    return (
        <Stack
            direction="row"
            spacing={1}
        >
            {
                (course.status === "Active" && <CheckIcon color="grey" />) ||
                (course.status === "Upcoming" && <AccessTimeIcon color="grey" />) ||
                (course.status === "Expired" && <ExpiredIcon color="grey" />)
            }

            <Typography variant="body1">
                {course.status}
            </Typography>
        </Stack>
    );
};
