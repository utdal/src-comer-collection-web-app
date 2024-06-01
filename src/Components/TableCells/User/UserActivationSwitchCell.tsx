import React from "react";
import { Switch } from "@mui/material";
import { useAppUser } from "../../../Hooks/useAppUser";
import { useTableCellItem } from "../../../ContextProviders/TableCellProvider";
import type { AppUser, UserItem } from "../../..";

const UserActivationSwitchCell = (): React.JSX.Element => {
    const user = useTableCellItem() as UserItem;
    const appUser = useAppUser() as AppUser;
    // const { handleChangeUserActivationStatus } = useTableCellManagementCallbacks();
    // const handleChangeActivationStatus = useCallback((e) => {
    //     handleChangeUserActivationStatus(user, e.target.checked);
    // }, [handleChangeUserActivationStatus, user]);
    return (
        <Switch
            checked={user.is_active ? user.has_password : false}
            color={user.is_admin_or_collection_manager ? "secondary" : "primary"}
            disabled={user.id === appUser.id || !user.has_password}
            // itemID={user.id}
            // onClick={handleChangeActivationStatus}
        />
    );
};

export default UserActivationSwitchCell;
