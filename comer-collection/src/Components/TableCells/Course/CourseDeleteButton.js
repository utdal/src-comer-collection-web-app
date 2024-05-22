import React, { useCallback } from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import { DeleteButton } from "../Entity/DeleteButton.js";

export const CourseDeleteButton = () => {
    const course = useTableRowItem();
    const { handleOpenCourseDeleteDialog } = useManagementCallbacks();
    const handleOpenDeleteDialog = useCallback(() => {
        handleOpenCourseDeleteDialog(course);
    }, [course, handleOpenCourseDeleteDialog]);
    return (
        <DeleteButton
            disabled={course.Users.length > 0}
            onClick={handleOpenDeleteDialog}
        />
    );
};
