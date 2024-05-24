import React, { useCallback } from "react";
import { EditButton } from "../Entity/EditButton.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

export const ImageEditButton = () => {
    const image = useTableCellItem();
    const { handleOpenImageEditDialog } = useTableCellManagementCallbacks();
    const handleOpenEditDialog = useCallback(() => {
        handleOpenImageEditDialog(image);
    }, [image, handleOpenImageEditDialog]);
    return (
        <EditButton onClick={handleOpenEditDialog} />
    );
};
