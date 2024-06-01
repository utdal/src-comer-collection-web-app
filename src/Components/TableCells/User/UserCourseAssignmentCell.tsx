import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";

import { SchoolIcon } from "../../../Imports/Icons";
import type { CourseItem, UserItem } from "../../..";

const UserCourseAssignmentCell = (): React.JSX.Element => {
    const user = useTableCellItem() as UserItem;
    // const { handleOpenUserAssignCourseDialog } = useTableCellManagementCallbacks();
    // const handleOpenAssignCourseDialog = useCallback(() => {
    //     handleOpenUserAssignCourseDialog(user);
    // }, [handleOpenUserAssignCourseDialog, user]);
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing={1}
        >
            <Button
                // color="lightgrey"
                // onClick={handleOpenAssignCourseDialog}
                startIcon={<SchoolIcon />}
                variant="text"
            >
                <Typography variant="body1">
                    {(user.Courses as CourseItem[]).length}
                </Typography>
            </Button>
        </Stack>
    );
};

export default UserCourseAssignmentCell;
