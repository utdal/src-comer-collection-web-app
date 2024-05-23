import React from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { EntityManageDeleteButton } from "../Entity/EntityManageDeleteButton.js";

export const TagManageDeleteButton = () => {
    const tag = useTableRowItem();
    return (
        <EntityManageDeleteButton
            disabled={tag.Images.length > 0}
        />
    );
};
