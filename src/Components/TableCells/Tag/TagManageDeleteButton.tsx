import React from "react";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import EntityDeleteButton from "../Entity/EntityDeleteButton";
import type { ImageItem } from "../../../index.js";

const TagManageDeleteButton = (): React.JSX.Element => {
    const tag = useTableCellItem();
    return (
        <EntityDeleteButton
            disabled={(tag.Images as ImageItem[]).length > 0}
        />
    );
};

export default TagManageDeleteButton;
