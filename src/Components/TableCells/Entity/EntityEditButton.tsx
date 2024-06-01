import React, { useCallback } from "react";
import { IconButton } from "@mui/material";
import { EditIcon } from "../../../Imports/Icons.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider";

const EntityEditButton = ({ disabled = false }: {
    readonly disabled?: boolean;
}): React.JSX.Element => {
    const item = useTableCellItem();
    const { openDialogByIntentWithSingleUnderlyingItem } = useTableCellManagementCallbacks();
    const handleOpenEditDialog = useCallback(() => {
        openDialogByIntentWithSingleUnderlyingItem("single-edit", item);
    }, [openDialogByIntentWithSingleUnderlyingItem, item]);
    return (
        <IconButton
            disabled={disabled}
            onClick={handleOpenEditDialog}
        >
            <EditIcon />
        </IconButton>
    );
};

export default EntityEditButton;
