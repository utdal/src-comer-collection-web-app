import React, { useCallback } from "react";
import { EditButton } from "../Entity/EditButton.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

export const ImageEditButton = () => {
    const image = useTableCellItem();
    const { openDialogByIntentWithSingleUnderlyingItem } = useTableCellManagementCallbacks();
    const handleOpenEditDialog = useCallback(() => {
        openDialogByIntentWithSingleUnderlyingItem("single-edit", image);
    }, [openDialogByIntentWithSingleUnderlyingItem, image]);
    return (
        <EditButton onClick={handleOpenEditDialog} />
    );
};
