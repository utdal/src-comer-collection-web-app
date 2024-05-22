import React, { useCallback } from "react";
import { Switch } from "@mui/material";
import { useAppUser } from "../../../ContextProviders/AppUser.js";
import { useTableRowItem } from "../../../ContextProviders/TableRowProvider.js";
import { useManagementCallbacks } from "../../../ContextProviders/ManagementPageProvider.js";

export const UserActivationSwitchCell = () => {
    const user = useTableRowItem();
    const [appUser] = useAppUser();
    const { handleChangeUserActivationStatus } = useManagementCallbacks();
    const handleChangeActivationStatus = useCallback((e) => {
        handleChangeUserActivationStatus(user, e.target.checked);
    }, [handleChangeUserActivationStatus, user]);
    return (
        <Switch
            checked={user.is_active ? user.has_password : null}
            color={user.is_admin_or_collection_manager ? "secondary" : "primary"}
            disabled={user.id === appUser.id || !user.has_password}
            itemID={user.id}
            onClick={handleChangeActivationStatus}
        />
    );
};
