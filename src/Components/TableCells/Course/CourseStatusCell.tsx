import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import { AccessTimeIcon, CheckIcon, ExpiredIcon } from "../../../Imports/Icons";
import type { CourseItem } from "../../..";

const CourseStatusCell = (): React.JSX.Element => {
    const course = useTableCellItem() as CourseItem;
    return (
        <Stack
            direction="row"
            spacing={1}
        >
            {
                course.status === "Active"
                    ? (
                        <CheckIcon htmlColor="gray" />
                    )
                    : course.status === "Upcoming"
                        ? (
                            <AccessTimeIcon htmlColor="gray" />
                        )
                        : (
                            <ExpiredIcon htmlColor="gray" />
                        )
            }

            <Typography variant="body1">
                {course.status}
            </Typography>
        </Stack>
    );
};

export default CourseStatusCell;
