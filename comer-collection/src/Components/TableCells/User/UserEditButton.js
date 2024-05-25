import React, { useCallback } from "react";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

import { EditButton } from "../Entity/EditButton.js";

export const UserEditButton = () => {
    const user = useTableCellItem();
    const { handleOpenUserEditDialog } = useTableCellManagementCallbacks();
    const handleOpenEditDialog = useCallback(() => {
        handleOpenUserEditDialog(user);
    }, [user, handleOpenUserEditDialog]);
    return (
        <EditButton onClick={handleOpenEditDialog} />
    );
};
