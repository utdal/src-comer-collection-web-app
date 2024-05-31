import React from "react";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";
import EntityDeleteButton from "../Entity/EntityDeleteButton.js";

const CourseDeleteButton = () => {
    const course = useTableCellItem();
    return (
        <EntityDeleteButton
            disabled={course.Users.length > 0}
        />
    );
};

export default CourseDeleteButton;
