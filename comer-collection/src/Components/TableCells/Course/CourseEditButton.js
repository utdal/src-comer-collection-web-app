import React, { useCallback } from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import { EditButton } from "../Entity/EditButton.js";

export const CourseEditButton = () => {
    const course = useTableRowItem();
    const { handleOpenCourseEditDialog } = useManagementCallbacks();
    const handleOpenEditDialog = useCallback(() => {
        handleOpenCourseEditDialog(course);
    }, [course, handleOpenCourseEditDialog]);
    return (
        <EditButton onClick={handleOpenEditDialog} />
    );
};
