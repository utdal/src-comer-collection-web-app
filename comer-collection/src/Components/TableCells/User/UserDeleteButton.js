import React, { useCallback } from "react";
import { useAppUser } from "../../../Hooks/useAppUser.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

import { DeleteButton } from "../Entity/DeleteButton.js";

export const UserDeleteButton = () => {
    const user = useTableCellItem();
    const appUser = useAppUser();
    const { handleOpenUserDeleteDialog } = useTableCellManagementCallbacks();
    const handleOpenDeleteDialog = useCallback(() => {
        handleOpenUserDeleteDialog(user);
    }, [user, handleOpenUserDeleteDialog]);
    const disabled = Boolean(user.Courses.length || user.Exhibitions.length || user.id === appUser.id);
    return (
        <DeleteButton
            disabled={disabled}
            onClick={handleOpenDeleteDialog}
        />
    );
};
