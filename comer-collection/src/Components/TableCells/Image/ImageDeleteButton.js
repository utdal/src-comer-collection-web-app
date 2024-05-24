import React, { useCallback } from "react";
import { DeleteButton } from "../Entity/DeleteButton.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

export const ImageDeleteButton = () => {
    const image = useTableCellItem();
    const { handleOpenImageDeleteDialog } = useTableCellManagementCallbacks();
    const handleOpenDeleteDialog = useCallback(() => {
        handleOpenImageDeleteDialog(image);
    }, [image, handleOpenImageDeleteDialog]);
    return (
        <DeleteButton
            disabled={image.Exhibitions.length > 0}
            onClick={handleOpenDeleteDialog}
        />
    );
};
