import React, { useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { useAppUser } from "../../../ContextProviders/AppUser.js";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { LockIcon, LockResetIcon, OpenInNewIcon } from "../../../Imports/Icons.js";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";

export const UserPasswordSetOrResetCell = () => {
    const user = useTableRowItem();
    const appUser = useAppUser();
    const { handleOpenUserPasswordResetDialog, handleNavigateToChangePassword } = useManagementCallbacks();
    const handleOpenPasswordResetDialog = useCallback(() => {
        handleOpenUserPasswordResetDialog(user);
    }, [handleOpenUserPasswordResetDialog, user]);
    if (appUser.id === user.id) {
        return (
            <Button
                color="secondary"
                onClick={handleNavigateToChangePassword}
                startIcon={<OpenInNewIcon />}
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
