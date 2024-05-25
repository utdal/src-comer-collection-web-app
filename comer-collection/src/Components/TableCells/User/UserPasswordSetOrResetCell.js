import React, { useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { useAppUser } from "../../../ContextProviders/AppUser.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";
import { LockIcon, LockResetIcon } from "../../../Imports/Icons.js";

export const UserPasswordSetOrResetCell = () => {
    const user = useTableCellItem();
    const [appUser] = useAppUser();
    const { handleOpenUserPasswordResetDialog, handleNavigateToChangePassword } = useTableCellManagementCallbacks();
    const handleOpenPasswordResetDialog = useCallback(() => {
        handleOpenUserPasswordResetDialog(user);
    }, [handleOpenUserPasswordResetDialog, user]);

    if (appUser.id === user.id) {
        return (
            <Button
                color="secondary"
                onClick={handleNavigateToChangePassword}
                variant="outlined"
            >
                <Typography variant="body1">
                    Change
                </Typography>
            </Button>
        );
    } else {
        return (
            <Button
                color={user.is_admin_or_collection_manager ? "secondary" : "primary"}
                itemID={user.id}
                onClick={handleOpenPasswordResetDialog}
                startIcon={user.has_password ? <LockResetIcon /> : <LockIcon />}
                variant={user.has_password ? "outlined" : "contained"}
            >
                <Typography variant="body1">
                    {user.has_password ? "Reset" : "Set"}
                </Typography>
            </Button>
        );
    }
};
