import React, { useCallback } from "react";
import { DeleteButton } from "../Entity/DeleteButton.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

export const ImageDeleteButton = () => {
    const image = useTableCellItem();
    const { openDialogByIntentWithSingleUnderlyingItem } = useTableCellManagementCallbacks();
    const handleOpenDeleteDialog = useCallback(() => {
        openDialogByIntentWithSingleUnderlyingItem("single-delete", image);
    }, [openDialogByIntentWithSingleUnderlyingItem, image]);
    return (
        <DeleteButton
            onClick={handleOpenDeleteDialog}
        />
    );
};
