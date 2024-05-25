import React, { useCallback } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

import { PersonIcon } from "../../../Imports/Icons.js";

export const CourseUserAssignmentCell = () => {
    const course = useTableCellItem();
    const { handleOpenAssignCourseUserDialog } = useTableCellManagementCallbacks();
    const handleOpenAssignUserDialog = useCallback(() => {
        handleOpenAssignCourseUserDialog(course);
    }, [course, handleOpenAssignCourseUserDialog]);
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <Button
                color="primary"
                onClick={handleOpenAssignUserDialog}
                startIcon={<PersonIcon />}
                variant="outlined"
            >
                <Typography variant="body1">
                    {course.Users.length}
                </Typography>
            </Button>
        </Stack>
    );
};
