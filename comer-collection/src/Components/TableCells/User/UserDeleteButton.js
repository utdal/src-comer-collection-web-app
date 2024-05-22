import React, { useCallback } from "react";
import { useAppUser } from "../../../ContextProviders/AppUser.js";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";
import { DeleteButton } from "../Entity/DeleteButton.js";

export const UserDeleteButton = () => {
    const user = useTableRowItem();
    const appUser = useAppUser();
    const { handleOpenUserDeleteDialog } = useManagementCallbacks();
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
