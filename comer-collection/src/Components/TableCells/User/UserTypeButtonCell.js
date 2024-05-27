import React, { useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { useAppUser } from "../../../Hooks/useAppUser.js";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

import { CollectionManagerIcon, PersonIcon, SecurityIcon } from "../../../Imports/Icons.js";

export const UserTypeButtonCell = () => {
    const user = useTableCellItem();
    const appUser = useAppUser();
    const { handleOpenUserPrivilegesDialog } = useTableCellManagementCallbacks();
    const handleOpenPrivilegesDialog = useCallback(() => {
        handleOpenUserPrivilegesDialog(user);
    }, [handleOpenUserPrivilegesDialog, user]);
    return (
        <Button
            color="lightgrey"
            disabled={user.id === appUser.id}
            onClick={handleOpenPrivilegesDialog}
            startIcon={
                (user.is_admin && <SecurityIcon color="secondary" />) ||
                (user.is_collection_manager && <CollectionManagerIcon color="secondary" />) ||
                (<PersonIcon color="primary" />)
            }
            sx={{ textTransform: "unset" }}
        >
            <Typography
                align="left"
                variant="body1"
                width={90}
            >
                {user.is_admin ? "Administrator" : user.is_collection_manager ? "Collection Manager" : "Curator"}
            </Typography>
        </Button>
    );
};
