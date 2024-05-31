import React, { useCallback } from "react";
import { Button } from "@mui/material";
import { useAppUser } from "../../../Hooks/useAppUser.ts";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";
import { LockIcon, LockResetIcon } from "../../../Imports/Icons.js";
import { useNavigate } from "react-router";

const UserPasswordSetOrResetCell = () => {
    const user = useTableCellItem();
    const appUser = useAppUser();
    const navigate = useNavigate();

    const { openDialogByIntentWithSingleUnderlyingItem } = useTableCellManagementCallbacks();

    const handleOpenPasswordResetDialog = useCallback(() => {
        openDialogByIntentWithSingleUnderlyingItem("user-reset-password", user);
    }, [openDialogByIntentWithSingleUnderlyingItem, user]);

    const handleNavigateToChangePassword = useCallback(() => {
        navigate("/Account/ChangePassword");
    }, [navigate]);

    if (appUser.id === user.id) {
        return (
            <Button
                color="secondary"
                onClick={handleNavigateToChangePassword}
                variant="outlined"
            >
                Change
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
                {user.has_password ? "Reset" : "Set"}
            </Button>
        );
    }
};

export default UserPasswordSetOrResetCell;
