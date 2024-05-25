import React, { useCallback } from "react";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

import { EditButton } from "../Entity/EditButton.js";

export const CourseEditButton = () => {
    const course = useTableCellItem();
    const { handleOpenCourseEditDialog } = useTableCellManagementCallbacks();
    const handleOpenEditDialog = useCallback(() => {
        handleOpenCourseEditDialog(course);
    }, [course, handleOpenCourseEditDialog]);
    return (
        <EditButton onClick={handleOpenEditDialog} />
    );
};
