import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";

import { PersonIcon } from "../../../Imports/Icons.js";
import type { CourseItem, UserItem } from "../../..";

const CourseUserAssignmentCell = (): React.JSX.Element => {
    const course = useTableCellItem() as CourseItem;
    // const { handleOpenAssignCourseUserDialog } = useTableCellManagementCallbacks();
    // const handleOpenAssignUserDialog = useCallback((): React.JSX.Element => {
    //     handleOpenAssignCourseUserDialog(course);
    // }, [course, handleOpenAssignCourseUserDialog]);
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <Button
                color="primary"
                // onClick={handleOpenAssignUserDialog}
                startIcon={<PersonIcon />}
                variant="outlined"
            >
                <Typography variant="body1">
                    {(course.Users as UserItem[]).length}
                </Typography>
            </Button>
        </Stack>
    );
};

export default CourseUserAssignmentCell;
