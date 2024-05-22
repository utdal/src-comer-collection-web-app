import React, { useCallback } from "react";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import { EditButton } from "../Entity/EditButton.js";

export const UserEditButton = () => {
    const user = useTableRowItem();
    const { handleOpenUserEditDialog } = useManagementCallbacks();
    const handleOpenEditDialog = useCallback(() => {
        handleOpenUserEditDialog(user);
    }, [user, handleOpenUserEditDialog]);
    return (
        <EditButton onClick={handleOpenEditDialog} />
    );
};
