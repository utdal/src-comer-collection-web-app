import React, { useCallback } from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { DeleteButton } from "../Entity/DeleteButton.js";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";

export const ImageDeleteButton = () => {
    const image = useTableRowItem();
    const { handleOpenImageDeleteDialog } = useManagementCallbacks();
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
