import React from "react";
import { EntityManageDeleteButton } from "../Entity/EntityManageDeleteButton.js";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider.js";

export const TagManageDeleteButton = () => {
    const tag = useTableCellItem();
    return (
        <EntityManageDeleteButton
            disabled={tag.Images.length > 0}
        />
    );
};
