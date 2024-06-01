import React, { useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { useAppUser } from "../../../Hooks/useAppUser";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider";

import { CollectionManagerIcon, PersonIcon, SecurityIcon } from "../../../Imports/Icons.js";
import type { AppUser, UserItem } from "../../../index.js";

const UserTypeButtonCell = (): React.JSX.Element => {
    const user = useTableCellItem() as UserItem;
    const appUser = useAppUser() as AppUser;
    const { openDialogByIntentWithSingleUnderlyingItem } = useTableCellManagementCallbacks();
    const handleOpenPrivilegesDialog = useCallback(() => {
        openDialogByIntentWithSingleUnderlyingItem("user-change-privileges", user);
    }, [openDialogByIntentWithSingleUnderlyingItem, user]);
    return (
        <Button
            disabled={user.id === appUser.id}
            onClick={handleOpenPrivilegesDialog}
            startIcon={user.is_admin
                ? (
                    <SecurityIcon color="secondary" />
                )
                : user.is_collection_manager
                    ? (
                        <CollectionManagerIcon color="secondary" />
                    )
                    : <PersonIcon color="primary" />}
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

export default UserTypeButtonCell;
