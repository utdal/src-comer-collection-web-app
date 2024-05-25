import React, { useCallback } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

import { SchoolIcon } from "../../../Imports/Icons.js";

export const UserCourseAssignmentCell = () => {
    const user = useTableCellItem();
    const { handleOpenUserAssignCourseDialog } = useTableCellManagementCallbacks();
    const handleOpenAssignCourseDialog = useCallback(() => {
        handleOpenUserAssignCourseDialog(user);
    }, [handleOpenUserAssignCourseDialog, user]);
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <Button
                color="lightgrey"
                onClick={handleOpenAssignCourseDialog}
                startIcon={<SchoolIcon />}
                variant="text"
            >
                <Typography variant="body1">
                    {user.Courses.length}
                </Typography>
            </Button>
        </Stack>
    );
};
