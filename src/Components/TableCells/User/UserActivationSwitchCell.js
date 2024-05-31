import React, { useCallback } from "react";
import { Switch } from "@mui/material";
import { useAppUser } from "../../../Hooks/useAppUser.ts";
import { useTableCellItem, useTableCellManagementCallbacks } from "../../../ContextProviders/TableCellProvider.js";

export const UserActivationSwitchCell = () => {
    const user = useTableCellItem();
    const appUser = useAppUser();
    const { handleChangeUserActivationStatus } = useTableCellManagementCallbacks();
    const handleChangeActivationStatus = useCallback((e) => {
        handleChangeUserActivationStatus(user, e.target.checked);
    }, [handleChangeUserActivationStatus, user]);
    return (
        <Switch
            checked={user.is_active ? user.has_password : false}
            color={user.is_admin_or_collection_manager ? "secondary" : "primary"}
            disabled={user.id === appUser.id || !user.has_password}
            itemID={user.id}
            onClick={handleChangeActivationStatus}
        />
    );
};
