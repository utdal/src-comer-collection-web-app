import React, { useCallback } from "react";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

import { DeleteButton } from "../Entity/DeleteButton.js";

export const CourseDeleteButton = () => {
    const course = useTableCellItem();
    const { handleOpenCourseDeleteDialog } = useTableCellManagementCallbacks();
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
