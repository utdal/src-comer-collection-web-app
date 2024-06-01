import React, { useCallback } from "react";
import { IconButton } from "@mui/material";
import { DeleteIcon } from "../../../Imports/Icons.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider";

const EntityDeleteButton = ({ disabled = false }: {
    readonly disabled?: boolean;
}): React.JSX.Element => {
    const item = useTableCellItem();
    const { openDialogByIntentWithSingleUnderlyingItem } = useTableCellManagementCallbacks();
    const handleOpenDeleteDialog = useCallback(() => {
        openDialogByIntentWithSingleUnderlyingItem("single-delete", item);
    }, [openDialogByIntentWithSingleUnderlyingItem, item]);
    return (
        <IconButton
            disabled={disabled}
            onClick={handleOpenDeleteDialog}
        >
            <DeleteIcon />
        </IconButton>
    );
};

export default EntityDeleteButton;
