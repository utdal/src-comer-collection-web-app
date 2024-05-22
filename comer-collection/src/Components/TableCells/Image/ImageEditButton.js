import React, { useCallback } from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import { EditButton } from "../Entity/EditButton.js";

export const ImageEditButton = () => {
    const image = useTableRowItem();
    const { handleOpenImageEditDialog } = useManagementCallbacks();
    const handleOpenEditDialog = useCallback(() => {
        handleOpenImageEditDialog(image);
    }, [image, handleOpenImageEditDialog]);
    return (
        <EditButton onClick={handleOpenEditDialog} />
    );
};
