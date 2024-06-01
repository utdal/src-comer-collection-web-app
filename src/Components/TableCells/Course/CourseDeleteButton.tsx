import React from "react";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import EntityDeleteButton from "../Entity/EntityDeleteButton.js";
import type { CourseItem } from "../../../index.js";

const CourseDeleteButton = (): React.JSX.Element => {
    const course = useTableCellItem() as CourseItem;
    return (
        <EntityDeleteButton
            disabled={(course.Users as CourseItem[]).length > 0}
        />
    );
};

export default CourseDeleteButton;
